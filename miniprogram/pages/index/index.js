// index.js
const app = getApp()

Page({
  data: {
    bannerList: [], // 轮播图数据
    recipeList: [], // 菜谱列表数据
    categoryList: [], // 分类列表
    loading: true, // 加载状态
  },

  onLoad: function () {
    this.loadData()
  },

  onPullDownRefresh: function () {
    this.loadData(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 加载首页数据
  loadData: function (callback) {
    this.setData({ loading: true })

    // 模拟数据加载
    setTimeout(() => {
      this.setData({
        loading: false,
        bannerList: [
          {
            id: 'banner1',
            image: '/images/banner/banner1.jpg',
            title: '程序员做饭指南',
            url: '/pages/recipe/detail?id=recipe_001'
          },
          {
            id: 'banner2',
            image: '/images/banner/banner2.jpg',
            title: '夏季清爽菜谱',
            url: '/pages/recipe/list?category=summer'
          }
        ],
        categoryList: [
          { id: 'meat', name: '荤菜', icon: '/images/category/meat.png' },
          { id: 'vegetable', name: '素菜', icon: '/images/category/vegetable.png' },
          { id: 'staple', name: '主食', icon: '/images/category/staple.png' },
          { id: 'soup', name: '汤类', icon: '/images/category/soup.png' }
        ],
        recipeList: [
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
          },
          {
            id: 'recipe_004',
            name: '蒜蓉炒青菜',
            cover: '/images/recipes/recipe_004.jpg',
            difficulty: 1,
            time: 10,
            category: '素菜',
            tags: ['快手菜', '健康菜']
          }
        ]
      })

      if (callback) {
        callback()
      }
    }, 1000)
  },

  // 跳转到菜谱详情
  goToRecipe: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recipe/detail?id=${id}`
    })
  },

  // 跳转到分类页
  goToCategory: function (e) {
    const id = e.currentTarget.dataset.id
    wx.switchTab({
      url: `/pages/category/category?id=${id}`
    })
  },

  // 跳转到搜索页
  goToSearch: function () {
    wx.switchTab({
      url: '/pages/search/search'
    })
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '程序员做饭指南 - 用代码思维重构烹饪流程',
      path: '/pages/index/index'
    }
  }
})