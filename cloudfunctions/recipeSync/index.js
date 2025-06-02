// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const path = require('path')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const recipesCollection = db.collection('recipes')
const syncStatusCollection = db.collection('syncStatus')

// GitHub API 配置
const GITHUB_API_URL = 'https://api.github.com'
const GITHUB_REPO = 'Anduin2017/HowToCook'
const GITHUB_CONTENT_PATH = 'dishes'

/**
 * 从GitHub获取菜谱目录
 */
async function fetchRecipeDirectories() {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/${GITHUB_CONTENT_PATH}`)
    return response.data.filter(item => item.type === 'dir')
  } catch (error) {
    console.error('获取菜谱目录失败:', error)
    throw new Error('获取菜谱目录失败')
  }
}

/**
 * 从GitHub获取菜谱内容
 * @param {String} dirPath - 菜谱目录路径
 */
async function fetchRecipeContent(dirPath) {
  try {
    // 获取目录下的README.md文件
    const response = await axios.get(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/${dirPath}/README.md`)

    // 解码Base64内容
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
    return content
  } catch (error) {
    console.error(`获取菜谱内容失败 (${dirPath}):`, error)
    return null
  }
}

/**
 * 解析菜谱Markdown内容
 * @param {String} content - Markdown内容
 * @param {String} dirPath - 菜谱目录路径
 */
function parseRecipeMarkdown(content, dirPath) {
  if (!content) return null

  // 提取标题
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : path.basename(dirPath)

  // 提取描述
  const descMatch = content.match(/^##\s+简介\s*\n+([^#]+)/m)
  const description = descMatch ? descMatch[1].trim() : ''

  // 提取食材
  const ingredientsMatch = content.match(/^##\s+所需原料\s*\n+([^#]+)/m)
  const ingredientsText = ingredientsMatch ? ingredientsMatch[1] : ''
  const ingredients = ingredientsText
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const parts = line.split(/[：:]/);
      const name = parts[0].replace(/^[-*]\s*/, '').trim()
      const rest = parts.slice(1).join(':').trim()

      // 尝试提取数量和备注
      const amountMatch = rest.match(/^([0-9]+[^\s]*)\s*(.*)$/)
      if (amountMatch) {
        return {
          name,
          amount: amountMatch[1],
          note: amountMatch[2] || ''
        }
      }

      return {
        name,
        amount: rest || '适量',
        note: ''
      }
    })

  // 提取工具
  const toolsMatch = content.match(/^##\s+所需工具\s*\n+([^#]+)/m)
  const toolsText = toolsMatch ? toolsMatch[1] : ''
  const tools = toolsText
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const name = line.replace(/^[-*]\s*/, '').trim()
      return {
        name,
        required: !line.includes('可选')
      }
    })

  // 提取步骤
  const stepsMatch = content.match(/^##\s+操作步骤\s*\n+([^#]+)/m)
  const stepsText = stepsMatch ? stepsMatch[1] : ''
  const steps = []

  // 使用正则表达式匹配步骤
  const stepRegex = /(\d+)\.\s+([^\n]+)(?:\n([^0-9][^\n]+)*)?/g
  let match
  let stepIndex = 1

  while ((match = stepRegex.exec(stepsText)) !== null) {
    const title = match[2].trim()
    const description = match[3] ? match[3].trim() : ''

    // 检查是否有计时信息
    let timer = null
    const timerMatch = description.match(/(\d+)\s*(分钟|秒钟|秒)/)
    if (timerMatch) {
      const duration = parseInt(timerMatch[1])
      const unit = timerMatch[2]
      // 转换为秒
      const seconds = unit === '分钟' ? duration * 60 : duration
      timer = {
        duration: seconds,
        description: description.substring(0, timerMatch.index + timerMatch[0].length)
      }
    }

    steps.push({
      id: stepIndex++,
      title,
      description,
      image: '', // 暂无图片
      timer
    })
  }

  // 提取小贴士
  const tipsMatch = content.match(/^##\s+小贴士\s*\n+([^#]+)/m)
  const tipsText = tipsMatch ? tipsMatch[1] : ''
  const tips = tipsText
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.replace(/^[-*]\s*/, '').trim())

  // 构建菜谱对象
  const recipe = {
    name: title,
    description,
    ingredients,
    tools,
    steps,
    tips,
    category: getCategoryFromPath(dirPath),
    difficulty: estimateDifficulty(steps.length, ingredients.length),
    time: estimateCookingTime(steps),
    tags: generateTags(title, description, dirPath),
    source: `https://github.com/${GITHUB_REPO}/tree/master/${dirPath}`,
    updatedAt: new Date()
  }

  return recipe
}

/**
 * 根据路径获取分类
 * @param {String} dirPath - 菜谱目录路径
 */
function getCategoryFromPath(dirPath) {
  const category = dirPath.split('/')[1].toLowerCase()

  if (category.includes('荤菜') || category.includes('meat')) {
    return '荤菜'
  } else if (category.includes('素菜') || category.includes('vegetable')) {
    return '素菜'
  } else if (category.includes('主食') || category.includes('staple')) {
    return '主食'
  } else if (category.includes('汤') || category.includes('soup')) {
    return '汤类'
  } else {
    return '其他'
  }
}

/**
 * 估算菜谱难度
 * @param {Number} stepsCount - 步骤数量
 * @param {Number} ingredientsCount - 食材数量
 */
function estimateDifficulty(stepsCount, ingredientsCount) {
  // 简单算法：步骤和食材数量越多，难度越大
  const score = stepsCount * 0.4 + ingredientsCount * 0.3

  if (score < 5) return 1
  if (score < 10) return 2
  if (score < 15) return 3
  if (score < 20) return 4
  return 5
}

/**
 * 估算烹饪时间
 * @param {Array} steps - 步骤列表
 */
function estimateCookingTime(steps) {
  // 基础时间：每个步骤3分钟
  let time = steps.length * 3

  // 加上计时器时间
  steps.forEach(step => {
    if (step.timer) {
      time += Math.ceil(step.timer.duration / 60)
    }
  })

  return time
}

/**
 * 生成标签
 * @param {String} title - 菜谱标题
 * @param {String} description - 菜谱描述
 * @param {String} dirPath - 菜谱目录路径
 */
function generateTags(title, description, dirPath) {
  const tags = []

  // 根据路径添加标签
  const pathParts = dirPath.split('/')
  if (pathParts.length > 1) {
    tags.push(pathParts[1])
  }

  // 根据标题添加标签
  if (title.includes('快手')) tags.push('快手菜')
  if (title.includes('简易')) tags.push('简易')

  // 根据描述添加标签
  if (description.includes('家常')) tags.push('家常菜')
  if (description.includes('下饭')) tags.push('下饭菜')
  if (description.includes('宴客')) tags.push('宴客菜')

  // 菜系标签
  const cuisines = ['川菜', '粤菜', '湘菜', '鲁菜', '苏菜', '浙菜', '闽菜', '徽菜']
  cuisines.forEach(cuisine => {
    if (title.includes(cuisine) || description.includes(cuisine)) {
      tags.push(cuisine)
    }
  })

  // 确保标签唯一
  return [...new Set(tags)]
}

/**
 * 更新同步状态
 * @param {Object} status - 同步状态
 */
async function updateSyncStatus(status) {
  try {
    // 查询现有状态
    const result = await syncStatusCollection.where({
      type: 'github'
    }).get()

    if (result.data.length > 0) {
      // 更新现有记录
      await syncStatusCollection.doc(result.data[0]._id).update({
        data: {
          ...status,
          updatedAt: new Date()
        }
      })
    } else {
      // 创建新记录
      await syncStatusCollection.add({
        data: {
          type: 'github',
          ...status,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }
  } catch (error) {
    console.error('更新同步状态失败:', error)
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取菜谱目录
    const directories = await fetchRecipeDirectories()

    let newRecipes = 0
    let updatedRecipes = 0
    const totalRecipes = directories.length

    // 处理每个菜谱目录
    for (const dir of directories) {
      const dirPath = `${GITHUB_CONTENT_PATH}/${dir.name}`

      // 获取菜谱内容
      const content = await fetchRecipeContent(dirPath)
      if (!content) continue

      // 解析菜谱内容
      const recipe = parseRecipeMarkdown(content, dirPath)
      if (!recipe) continue

      // 生成唯一ID
      const recipeId = `github_${dir.sha.substring(0, 10)}`

      // 检查菜谱是否已存在
      const existingRecipe = await recipesCollection.where({
        source: recipe.source
      }).get()

      if (existingRecipe.data.length > 0) {
        // 更新现有菜谱
        await recipesCollection.doc(existingRecipe.data[0]._id).update({
          data: {
            ...recipe,
            updatedAt: new Date()
          }
        })
        updatedRecipes++
      } else {
        // 添加新菜谱
        await recipesCollection.add({
          data: {
            _id: recipeId,
            ...recipe,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        newRecipes++
      }
    }

    // 更新同步状态
    await updateSyncStatus({
      lastSyncTime: new Date(),
      totalRecipes,
      newRecipes,
      updatedRecipes
    })

    return {
      code: 200,
      data: {
        totalRecipes,
        newRecipes,
        updatedRecipes
      }
    }
  } catch (error) {
    console.error('同步菜谱失败:', error)
    return {
      code: 500,
      message: error.message || '同步菜谱失败'
    }
  }
}