/**
 * API 请求封装
 */
class Api {
  constructor() {
    this.baseUrl = 'cloud://cook-prod'
    this.initialized = false
    this.init()
  }

  // 初始化云环境
  init() {
    if (!this.initialized && wx.cloud) {
      wx.cloud.init({
        env: 'cook-prod',
        traceUser: true
      })
      this.initialized = true
    }
  }

  /**
   * 调用云函数
   * @param {String} name - 云函数名称
   * @param {Object} data - 请求参数
   */
  callFunction(name, data = {}) {
    return new Promise((resolve, reject) => {
      if (!this.initialized) {
        this.init()
      }

      wx.cloud.callFunction({
        name,
        data
      }).then(res => {
        const { result } = res
        if (result.code === 200) {
          resolve(result.data)
        } else {
          reject(new Error(result.message || '请求失败'))
        }
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * 获取菜谱列表
   * @param {Object} params - 查询参数
   */
  getRecipes(params = {}) {
    return this.callFunction('getRecipes', params)
  }

  /**
   * 获取菜谱详情
   * @param {String} id - 菜谱ID
   */
  getRecipeDetail(id) {
    return this.callFunction('getRecipeDetail', { id })
  }

  /**
   * 收藏/取消收藏菜谱
   * @param {String} recipeId - 菜谱ID
   * @param {String} action - 操作类型：'add' 或 'remove'
   */
  toggleFavorite(recipeId, action) {
    return this.callFunction('toggleFavorite', { recipeId, action })
  }

  /**
   * 获取用户收藏列表
   * @param {Object} params - 查询参数
   */
  getFavorites(params = {}) {
    return this.callFunction('getFavorites', params)
  }

  /**
   * 提交菜谱反馈
   * @param {Object} feedback - 反馈信息
   */
  submitFeedback(feedback) {
    return this.callFunction('submitFeedback', feedback)
  }

  /**
   * 同步计时器记录
   * @param {Object} data - 计时器数据
   */
  syncTimer(data) {
    return this.callFunction('syncTimer', data)
  }

  /**
   * 获取菜谱更新状态
   */
  getSyncStatus() {
    return this.callFunction('getSyncStatus')
  }

  /**
   * 上传图片
   * @param {String} filePath - 本地文件路径
   * @param {String} dir - 存储目录
   */
  uploadImage(filePath, dir = 'feedback') {
    return new Promise((resolve, reject) => {
      const fileName = `${dir}/${Date.now()}_${Math.floor(Math.random() * 1000)}.${filePath.split('.').pop()}`

      wx.cloud.uploadFile({
        cloudPath: fileName,
        filePath,
        success: res => {
          resolve(res.fileID)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
}

export default new Api()