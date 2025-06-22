// search.js
const app = getApp()

Page({
  data: {
    keyword: '',
    historyKeywords: [],
    hotKeywords: ['西红柿炒鸡蛋', '红烧肉', '糖醋排骨', '蒜蓉炒青菜', '麻婆豆腐'],
    recipeList: [],
    loading: false,
    showHistory: true,
    showHot: true,
    hasResult: false,
    pageNum: 1,
    pageSize: 10,
    hasMore: true
  },

  onLoad: function () {
    // 从本地存储获取搜索历史
    const historyKeywords = wx.getStorageSync('historyKeywords') || []
    this.setData({
      historyKeywords
    })
  },

  // 输入关键词
  onInput: function (e) {
    const keyword = e.detail.value.trim()
    this.setData({
      keyword,
      showHistory: keyword === '',
      showHot: keyword === ''
    })

    // 如果输入为空，清空搜索结果
    if (keyword === '') {
      this.setData({
        recipeList: [],
        hasResult: false
      })
    }
  },

  // 清空输入
  clearInput: function () {
    this.setData({
      keyword: '',
      recipeList: [],
      showHistory: true,
      showHot: true,
      hasResult: false
    })
  },

  // 执行搜索
  doSearch: function (e) {
    let keyword = this.data.keyword

    // 如果是从历史记录或热门搜索点击的
    if (e && e.currentTarget.dataset.keyword) {
      keyword = e.currentTarget.dataset.keyword
      this.setData({ keyword })
    }

    if (!keyword) return

    // 添加到搜索历史
    this.addToHistory(keyword)

    // 显示加载中
    this.setData({
      loading: true,
      showHistory: false,
      showHot: false,
      pageNum: 1,
      recipeList: []
    })

    // 模拟搜索请求
    setTimeout(() => {
      // 模拟数据
      const mockData = [
        {
          id: 'recipe_001',
          name: '西红柿炒鸡蛋',
          cover: '/images/recipes/recipe_001.jpg',
          difficulty: 1,
          time: 15,
          category: '荤菜',
          tags: ['家常菜', '快手菜']
        },
        {
          id: 'recipe_002',
          name: '麻婆豆腐',
          cover: '/images/recipes/recipe_002.jpg',
          difficulty: 2,
          time: 30,
          category: '荤菜',
          tags: ['川菜', '下饭菜']
        },
        {
          id: 'recipe_003',
          name: '糖醋排骨',
          cover: '/images/recipes/recipe_003.jpg',
          difficulty: 3,
          time: 45,
          category: '荤菜',
          tags: ['经典菜', '宴客菜']
        }
      ].filter(item => item.name.includes(keyword) || item.tags.some(tag => tag.includes(keyword)))

      // 更新数据
      this.setData({
        loading: false,
        recipeList: mockData,
        hasResult: true,
        hasMore: mockData.length >= this.data.pageSize
      })
    }, 1000)
  },

  // 添加到搜索历史
  addToHistory: function (keyword) {
    let historyKeywords = this.data.historyKeywords

    // 如果已经存在，先移除
    const index = historyKeywords.findIndex(item => item === keyword)
    if (index !== -1) {
      historyKeywords.splice(index, 1)
    }

    // 添加到开头
    historyKeywords.unshift(keyword)

    // 最多保留10条
    if (historyKeywords.length > 10) {
      historyKeywords = historyKeywords.slice(0, 10)
    }

    // 更新数据
    this.setData({
      historyKeywords
    })

    // 保存到本地存储
    wx.setStorageSync('historyKeywords', historyKeywords)
  },

  // 清空搜索历史
  clearHistory: function () {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: res => {
        if (res.confirm) {
          this.setData({
            historyKeywords: []
          })
          wx.removeStorageSync('historyKeywords')
        }
      }
    })
  },

  // 跳转到菜谱详情
  goToRecipe: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recipe/detail?id=${id}`
    })
  },

  // 上拉加载更多
  onReachBottom: function () {
    if (this.data.hasMore && this.data.hasResult && !this.data.loading) {
      this.loadMoreResults()
    }
  },

  // 加载更多结果
  loadMoreResults: function () {
    if (!this.data.hasMore) return

    this.setData({ loading: true })

    // 模拟加载更多
    setTimeout(() => {
      // 模拟没有更多数据
      this.setData({
        loading: false,
        hasMore: false
      })
    }, 1000)
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '程序员做饭指南 - 搜索菜谱',
      path: '/pages/search/search'
    }
  }
})