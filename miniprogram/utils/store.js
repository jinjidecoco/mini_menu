// utils/store.js
import { observable, action } from 'mobx-miniprogram'

export const store = observable({
  // 用户信息
  userInfo: null,

  // 主题设置
  theme: 'light', // 'light' 或 'dark'

  // 收藏的菜谱ID列表
  favoriteRecipes: [],

  // 最近浏览的菜谱
  recentRecipes: [],

  // 用户笔记
  recipeNotes: {},

  // 设置用户信息
  setUserInfo: action(function(info) {
    this.userInfo = info
  }),

  // 切换主题
  toggleTheme: action(function() {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    // 持久化主题设置
    wx.setStorageSync('theme', this.theme)
  }),

  // 设置主题
  setTheme: action(function(theme) {
    this.theme = theme
    // 持久化主题设置
    wx.setStorageSync('theme', this.theme)
  }),

  // 添加收藏
  addFavorite: action(function(recipeId) {
    if (!this.favoriteRecipes.includes(recipeId)) {
      this.favoriteRecipes.push(recipeId)
      // 持久化收藏列表
      wx.setStorageSync('favoriteRecipes', this.favoriteRecipes)
      return true
    }
    return false
  }),

  // 取消收藏
  removeFavorite: action(function(recipeId) {
    const index = this.favoriteRecipes.indexOf(recipeId)
    if (index > -1) {
      this.favoriteRecipes.splice(index, 1)
      // 持久化收藏列表
      wx.setStorageSync('favoriteRecipes', this.favoriteRecipes)
      return true
    }
    return false
  }),

  // 检查是否收藏
  isFavorite: function(recipeId) {
    return this.favoriteRecipes.includes(recipeId)
  },

  // 添加最近浏览
  addRecentRecipe: action(function(recipe) {
    // 移除已存在的相同菜谱
    this.recentRecipes = this.recentRecipes.filter(item => item.id !== recipe.id)

    // 添加到列表开头
    this.recentRecipes.unshift({
      id: recipe.id,
      name: recipe.name,
      cover: recipe.cover,
      timestamp: new Date().getTime()
    })

    // 限制最大数量为10
    if (this.recentRecipes.length > 10) {
      this.recentRecipes.pop()
    }

    // 持久化最近浏览
    wx.setStorageSync('recentRecipes', this.recentRecipes)
  }),

  // 保存菜谱笔记
  saveRecipeNote: action(function(recipeId, note) {
    this.recipeNotes[recipeId] = note
    // 持久化笔记
    wx.setStorageSync('recipeNotes', this.recipeNotes)
  }),

  // 获取菜谱笔记
  getRecipeNote: function(recipeId) {
    return this.recipeNotes[recipeId] || ''
  },

  // 从本地存储加载数据
  loadFromStorage: action(function() {
    try {
      // 加载主题设置
      const theme = wx.getStorageSync('theme')
      if (theme) {
        this.theme = theme
      }

      // 加载收藏列表
      const favoriteRecipes = wx.getStorageSync('favoriteRecipes')
      if (favoriteRecipes) {
        this.favoriteRecipes = favoriteRecipes
      }

      // 加载最近浏览
      const recentRecipes = wx.getStorageSync('recentRecipes')
      if (recentRecipes) {
        this.recentRecipes = recentRecipes
      }

      // 加载笔记
      const recipeNotes = wx.getStorageSync('recipeNotes')
      if (recipeNotes) {
        this.recipeNotes = recipeNotes
      }
    } catch (e) {
      console.error('从本地存储加载数据失败', e)
    }
  })
})