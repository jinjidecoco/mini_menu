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
    }
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
              image: '/images/steps/recipe_001_1.jpg',
              timer: null
            },
            {
              id: 2,
              title: '炒鸡蛋',
              description: '锅烧热，倒入食用油，油热后倒入打散的鸡蛋',
              image: '/images/steps/recipe_001_2.jpg',
              timer: {duration: 60, description: '小火炒鸡蛋'}
            },
            {
              id: 3,
              title: '炒西红柿',
              description: '将炒好的鸡蛋盛出，锅中重新倒油，放入西红柿翻炒',
              image: '/images/steps/recipe_001_3.jpg',
              timer: {duration: 120, description: '中火炒西红柿'}
            },
            {
              id: 4,
              title: '混合炒制',
              description: '西红柿炒至出汁后，放入炒好的鸡蛋，加入盐和白糖翻炒均匀',
              image: '/images/steps/recipe_001_4.jpg',
              timer: {duration: 60, description: '混合翻炒'}
            },
            {
              id: 5,
              title: '出锅装盘',
              description: '炒至汤汁浓稠，关火出锅装盘',
              image: '/images/steps/recipe_001_5.jpg',
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
        },
        isFavorite: Math.random() > 0.5 // 模拟是否收藏
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
    // 这里应该调用云函数来更新收藏状态
    this.setData({
      isFavorite: !this.data.isFavorite
    })

    wx.showToast({
      title: this.data.isFavorite ? '已收藏' : '已取消收藏',
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
    this.setData({
      notes: e.detail.value
    })
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: `${this.data.recipe.name} - 程序员做饭指南`,
      path: `/pages/recipe/detail?id=${this.data.recipeId}`
    }
  }
})