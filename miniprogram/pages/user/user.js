// pages/user/user.js
const app = getApp()

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    functionList: [
      {
        id: 'favorites',
        name: '我的收藏',
        icon: 'star',
        path: '/pages/user/favorites'
      },
      {
        id: 'history',
        name: '浏览历史',
        icon: 'time',
        path: '/pages/user/history'
      },
      {
        id: 'feedback',
        name: '意见反馈',
        icon: 'comment',
        path: '/pages/user/feedback'
      },
      {
        id: 'about',
        name: '关于我们',
        icon: 'info',
        path: '/pages/user/about'
      }
    ]
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    // 检查是否已有用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    }
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        // 存储用户信息
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  navigateTo(e) {
    const path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: path
    })
  }
})