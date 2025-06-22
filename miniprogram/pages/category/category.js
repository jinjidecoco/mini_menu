// category.js
const app = getApp()

Page({
  data: {
    categories: [
      { id: 'meat', name: '荤菜', icon: '/images/svg/circle.svg', description: '各种肉类菜肴' },
      { id: 'vegetable', name: '素菜', icon: '/images/svg/circle.svg', description: '健康蔬菜料理' },
      { id: 'staple', name: '主食', icon: '/images/svg/circle.svg', description: '米饭、面食等主食' },
      { id: 'soup', name: '汤类', icon: '/images/svg/circle.svg', description: '营养丰富的汤品' },
      { id: 'dessert', name: '甜点', icon: '/images/svg/circle.svg', description: '甜品与饮料' }
    ],
    currentCategory: 'meat',
    recipeList: [],
    loading: true,
    pageNum: 1,
    pageSize: 10,
    hasMore: true
  },

  onLoad: function (options) {
    if (options && options.id) {
      this.setData({
        currentCategory: options.id
      })
    }
    this.loadRecipeList(true)
  },

  // 切换分类
  switchCategory: function (e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({
      currentCategory: categoryId,
      recipeList: [],
      pageNum: 1,
      hasMore: true
    })
    this.loadRecipeList(true)
  },

  // 加载菜谱列表
  loadRecipeList: function (refresh = false) {
    if (refresh) {
      this.setData({
        loading: true,
        pageNum: 1,
        recipeList: []
      })
    } else {
      if (!this.data.hasMore) return
      this.setData({ loading: true })
    }

    // 模拟数据加载，实际项目中应该调用云函数获取数据
    setTimeout(() => {
      // 模拟数据
      const mockData = {
        meat: [
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
        ],
        vegetable: [
          {
            id: 'recipe_004',
            name: '蒜蓉炒青菜',
            cover: '/images/recipes/recipe_004.jpg',
            difficulty: 1,
            time: 10,
            category: '素菜',
            tags: ['快手菜', '健康菜']
          },
          {
            id: 'recipe_005',
            name: '干煸四季豆',
            cover: '/images/recipes/recipe_005.jpg',
            difficulty: 2,
            time: 20,
            category: '素菜',
            tags: ['家常菜', '下饭菜']
          }
        ],
        staple: [
          {
            id: 'recipe_006',
            name: '蛋炒饭',
            cover: '/images/recipes/recipe_006.jpg',
            difficulty: 1,
            time: 15,
            category: '主食',
            tags: ['快手菜', '家常菜']
          }
        ],
        soup: [
          {
            id: 'recipe_007',
            name: '番茄蛋花汤',
            cover: '/images/recipes/recipe_007.jpg',
            difficulty: 1,
            time: 15,
            category: '汤类',
            tags: ['家常菜', '快手菜']
          }
        ],
        dessert: [
          {
            id: 'recipe_008',
            name: '芒果布丁',
            cover: '/images/recipes/recipe_008.jpg',
            difficulty: 2,
            time: 30,
            category: '甜点',
            tags: ['甜品', '下午茶']
          }
        ]
      }

      // 获取当前分类的菜谱
      const currentRecipes = mockData[this.data.currentCategory] || []

      // 分页处理
      const start = (this.data.pageNum - 1) * this.data.pageSize
      const end = start + this.data.pageSize
      const pageData = currentRecipes.slice(start, end)

      // 更新数据
      this.setData({
        loading: false,
        recipeList: refresh ? pageData : this.data.recipeList.concat(pageData),
        hasMore: end < currentRecipes.length,
        pageNum: this.data.pageNum + 1
      })
    }, 1000)
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.loadRecipeList(true)
    wx.stopPullDownRefresh()
  },

  // 上拉加载更多
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.loadRecipeList()
    }
  },

  // 跳转到菜谱详情
  goToRecipe: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recipe/detail?id=${id}`
    })
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '程序员做饭指南 - ' + this.getCategoryName(),
      path: '/pages/category/category?id=' + this.data.currentCategory
    }
  },

  // 获取当前分类名称
  getCategoryName: function() {
    const category = this.data.categories.find(item => item.id === this.data.currentCategory)
    return category ? category.name : '分类'
  },

  // 获取当前分类描述
  getCategoryDescription: function() {
    const category = this.data.categories.find(item => item.id === this.data.currentCategory)
    return category ? category.description : ''
  }
})