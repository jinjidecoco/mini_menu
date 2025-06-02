// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const feedbackCollection = db.collection('feedback')

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  try {
    // 获取请求参数
    const { recipeId, type, content, images = [], operationLogs = [] } = event

    // 参数验证
    if (!recipeId || !type || !content) {
      return {
        code: 400,
        message: '参数不完整'
      }
    }

    // 添加反馈记录
    const result = await feedbackCollection.add({
      data: {
        recipeId,
        type,
        content,
        images,
        operationLogs,
        userId: OPENID,
        status: 'pending', // 状态：pending, processing, resolved, rejected
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })

    return {
      code: 200,
      data: {
        feedbackId: result._id,
        createTime: new Date()
      }
    }
  } catch (error) {
    console.error('提交反馈失败:', error)
    return {
      code: 500,
      message: error.message || '提交反馈失败'
    }
  }
}