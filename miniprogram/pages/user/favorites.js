const app = getApp()

Page({
  data: {
    favorites: [],
    loading: true,
    empty: false
  },

  onLoad() {
    this.loadFavorites()
  },

  onShow() {
    // 每次显示页面时重新加载收藏列表，以确保数据最新
    this.loadFavorites()
  },

  loadFavorites() {
    this.setData({ loading: true })

    // 从本地缓存获取收藏列表
    const favorites = wx.getStorageSync('favorites') || []

    setTimeout(() => {
      this.setData({
        favorites,
        loading: false,
        empty: favorites.length === 0
      })
    }, 500) // 模拟加载时间
  },

  // 跳转到菜谱详情页
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/recipe/detail?id=${id}`
    })
  },

  // 取消收藏
  cancelFavorite(e) {
    const { id, index } = e.currentTarget.dataset

    wx.showModal({
      title: '取消收藏',
      content: '确定要取消收藏这个菜谱吗？',
      success: (res) => {
        if (res.confirm) {
          // 从收藏列表中移除
          const favorites = this.data.favorites.filter(item => item.id !== id)

          // 更新本地存储
          wx.setStorageSync('favorites', favorites)

          // 更新页面数据
          this.setData({
            favorites,
            empty: favorites.length === 0
          })

          wx.showToast({
            title: '已取消收藏',
            icon: 'success'
          })
        }
      }
    })
  }
})