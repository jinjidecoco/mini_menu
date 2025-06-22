// pages/recipe/detail.js
const app = getApp()

Page({
  data: {
    recipeId: '',
    recipe: null,
    loading: true,
    currentStep: 0,
    timerRunning: false,
    timerSeconds: 0,
    timerInterval: null,
    isFavorite: false,
    showNotes: false,
    notes: ''
  },

    onLoad: function (options) {
    if (options.id) {
      this.setData({
        recipeId: options.id
      })
      this.loadRecipeDetail(options.id)

      // 检查是否已收藏
      this.checkFavoriteStatus(options.id)

      // 加载用户笔记
      this.loadNotesFromStorage()
    }
  },

  // 检查收藏状态
  checkFavoriteStatus: function(recipeId) {
    const favorites = wx.getStorageSync('favorites') || []
    const isFavorite = favorites.some(item => item.id === recipeId)

    this.setData({
      isFavorite: isFavorite
    })
  },

  onUnload: function () {
    // 清除计时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval)
    }
  },

  // 加载菜谱详情
  loadRecipeDetail: function (id) {
    this.setData({ loading: true })

    // 模拟数据加载
    setTimeout(() => {
      // 这里应该是从云数据库获取数据
      this.setData({
        loading: false,
        recipe: {
          id: 'recipe_001',
          name: '西红柿炒鸡蛋',
          cover: '/images/recipes/recipe_001.jpg',
          difficulty: 1,
          time: 15,
          category: '荤菜',
          tags: ['家常菜', '快手菜'],
          description: '经典家常菜，酸甜可口',
          ingredients: [
            {name: '西红柿', amount: '2个', note: '洗净切块'},
            {name: '鸡蛋', amount: '3个', note: '打散'},
            {name: '食用油', amount: '2勺', note: ''},
            {name: '盐', amount: '2克', note: ''},
            {name: '白糖', amount: '5克', note: '提鲜'}
          ],
          tools: [
            {name: '炒锅', required: true},
            {name: '锅铲', required: true},
            {name: '碗', required: true}
          ],
          steps: [
            {
              id: 1,
              title: '准备食材',
              description: '西红柿洗净切块，鸡蛋打散',
              image: '/images/recipes/recipe_001.jpg',
              timer: null
            },
            {
              id: 2,
              title: '炒鸡蛋',
              description: '锅烧热，倒入食用油，油热后倒入打散的鸡蛋',
              image: '/images/recipes/recipe_002.jpg',
              timer: {duration: 60, description: '小火炒鸡蛋'}
            },
            {
              id: 3,
              title: '炒西红柿',
              description: '将炒好的鸡蛋盛出，锅中重新倒油，放入西红柿翻炒',
              image: '/images/recipes/recipe_003.jpg',
              timer: {duration: 120, description: '中火炒西红柿'}
            },
            {
              id: 4,
              title: '混合炒制',
              description: '西红柿炒至出汁后，放入炒好的鸡蛋，加入盐和白糖翻炒均匀',
              image: '/images/recipes/recipe_004.jpg',
              timer: {duration: 60, description: '混合翻炒'}
            },
            {
              id: 5,
              title: '出锅装盘',
              description: '炒至汤汁浓稠，关火出锅装盘',
              image: '/images/recipes/recipe_001.jpg',
              timer: null
            }
          ],
          tips: [
            '西红柿最好选择成熟但不软烂的',
            '鸡蛋炒至七分熟即可盛出，避免过老'
          ],
          nutritionFacts: {
            calories: 220,
            protein: '13g',
            fat: '15g',
            carbs: '8g'
          }
        }
      })
    }, 1000)
  },

  // 切换步骤
  changeStep: function (e) {
    const step = parseInt(e.currentTarget.dataset.step)

    // 清除之前的计时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval)
    }

    this.setData({
      currentStep: step,
      timerRunning: false,
      timerSeconds: 0
    })
  },

  // 启动/暂停计时器
  toggleTimer: function () {
    const currentStepData = this.data.recipe.steps[this.data.currentStep]

    if (!currentStepData.timer) return

    if (this.data.timerRunning) {
      // 暂停计时器
      clearInterval(this.data.timerInterval)
      this.setData({
        timerRunning: false
      })
    } else {
      // 启动计时器
      let seconds = this.data.timerSeconds || currentStepData.timer.duration

      const interval = setInterval(() => {
        if (seconds <= 0) {
          clearInterval(interval)
          this.setData({
            timerRunning: false,
            timerSeconds: 0
          })

          // 播放提示音
          wx.vibrateLong()
          wx.showToast({
            title: '计时完成',
            icon: 'success'
          })

          return
        }

        seconds--
        this.setData({
          timerSeconds: seconds
        })
      }, 1000)

      this.setData({
        timerRunning: true,
        timerInterval: interval
      })
    }
  },

  // 重置计时器
  resetTimer: function () {
    const currentStepData = this.data.recipe.steps[this.data.currentStep]

    if (!currentStepData.timer) return

    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval)
    }

    this.setData({
      timerRunning: false,
      timerSeconds: currentStepData.timer.duration
    })
  },

  // 切换收藏状态
  toggleFavorite: function () {
    const newFavoriteStatus = !this.data.isFavorite

    // 更新状态
    this.setData({
      isFavorite: newFavoriteStatus
    })

    // 获取当前收藏列表
    const favorites = wx.getStorageSync('favorites') || []

    if (newFavoriteStatus) {
      // 添加到收藏
      const recipeToAdd = {
        id: this.data.recipe.id,
        name: this.data.recipe.name,
        image: this.data.recipe.cover,
        description: this.data.recipe.description,
        difficulty: this.data.recipe.difficulty,
        cookTime: this.data.recipe.time,
        timestamp: new Date().getTime()
      }

      // 检查是否已存在
      const existingIndex = favorites.findIndex(item => item.id === recipeToAdd.id)
      if (existingIndex === -1) {
        favorites.unshift(recipeToAdd) // 添加到列表开头
      }
    } else {
      // 从收藏中移除
      const index = favorites.findIndex(item => item.id === this.data.recipe.id)
      if (index !== -1) {
        favorites.splice(index, 1)
      }
    }

    // 保存到本地存储
    wx.setStorageSync('favorites', favorites)

    wx.showToast({
      title: newFavoriteStatus ? '已收藏' : '已取消收藏',
      icon: 'success'
    })
  },

  // 切换笔记区
  toggleNotes: function () {
    this.setData({
      showNotes: !this.data.showNotes
    })
  },

  // 更新笔记
  updateNotes: function (e) {
    const newNotes = e.detail.value

    this.setData({
      notes: newNotes
    })

    // 保存笔记到本地存储
    this.saveNotesToStorage(newNotes)
  },

  // 保存笔记到本地存储
  saveNotesToStorage: function(notes) {
    const recipeId = this.data.recipeId
    if (!recipeId) return

    // 获取所有笔记
    const allNotes = wx.getStorageSync('recipe_notes') || {}

    // 更新当前菜谱的笔记
    allNotes[recipeId] = {
      content: notes,
      updatedAt: new Date().getTime()
    }

    // 保存回本地存储
    wx.setStorageSync('recipe_notes', allNotes)
  },

  // 从本地存储加载笔记
  loadNotesFromStorage: function() {
    const recipeId = this.data.recipeId
    if (!recipeId) return

    const allNotes = wx.getStorageSync('recipe_notes') || {}
    const recipeNotes = allNotes[recipeId]

    if (recipeNotes) {
      this.setData({
        notes: recipeNotes.content
      })
    }
  },

  // 分享给朋友
  onShareAppMessage: function () {
    const recipe = this.data.recipe

    return {
      title: `${recipe.name} - 程序员做饭指南`,
      path: `/pages/recipe/detail?id=${this.data.recipeId}`,
      imageUrl: recipe.cover || '/images/share-default.png',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        })
      }
    }
  },

  // 分享到朋友圈
  onShareTimeline: function() {
    const recipe = this.data.recipe

    return {
      title: `【程序员做饭指南】${recipe.name}`,
      query: `id=${this.data.recipeId}`,
      imageUrl: recipe.cover || '/images/share-default.png'
    }
  }
})