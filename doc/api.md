# API 文档

> 程序员做饭指南微信小程序前后端交互接口

## 接口规范

- 基础URL: `cloud://cook-prod.xxxx/api`
- 请求方式: HTTPS
- 数据格式: JSON
- 状态码:
  - `200`: 成功
  - `400`: 请求参数错误
  - `401`: 未授权
  - `404`: 资源不存在
  - `500`: 服务器内部错误

## 菜谱相关接口

### 1. 获取菜谱列表

获取分页菜谱列表，支持多种过滤条件。

**请求**

```
GET /recipes
```

**参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | Number | 否 | 页码，默认1 |
| size | Number | 否 | 每页数量，默认20，最大50 |
| category | String | 否 | 分类：荤菜/素菜/主食/汤类 |
| difficulty | Number | 否 | 难度等级：1-5 |
| time | Number | 否 | 烹饪时间（分钟） |
| ingredients | Array | 否 | 包含的食材，如 ["土豆", "胡萝卜"] |
| keyword | String | 否 | 搜索关键词 |

**响应**

```json
{
  "code": 200,
  "data": {
    "total": 156,
    "page": 1,
    "size": 20,
    "list": [
      {
        "id": "recipe_001",
        "name": "西红柿炒鸡蛋",
        "cover": "https://xxx.cloudfront.net/images/recipe_001.jpg",
        "difficulty": 1,
        "time": 15,
        "category": "荤菜",
        "tags": ["家常菜", "快手菜"],
        "ingredients": [
          {"name": "西红柿", "amount": "2个"},
          {"name": "鸡蛋", "amount": "3个"}
        ]
      },
      // ...更多菜谱
    ]
  }
}
```

### 2. 获取菜谱详情

获取单个菜谱的详细信息，包括步骤、计时器等。

**请求**

```
GET /recipes/:id
```

**参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | String | 是 | 菜谱ID |

**响应**

```json
{
  "code": 200,
  "data": {
    "id": "recipe_001",
    "name": "西红柿炒鸡蛋",
    "cover": "https://xxx.cloudfront.net/images/recipe_001.jpg",
    "difficulty": 1,
    "time": 15,
    "category": "荤菜",
    "tags": ["家常菜", "快手菜"],
    "description": "经典家常菜，酸甜可口",
    "ingredients": [
      {"name": "西红柿", "amount": "2个", "note": "洗净切块"},
      {"name": "鸡蛋", "amount": "3个", "note": "打散"}
    ],
    "tools": [
      {"name": "炒锅", "required": true},
      {"name": "锅铲", "required": true}
    ],
    "steps": [
      {
        "id": 1,
        "title": "准备食材",
        "description": "西红柿洗净切块，鸡蛋打散",
        "image": "https://xxx.cloudfront.net/images/steps/recipe_001_1.jpg",
        "timer": null
      },
      {
        "id": 2,
        "title": "炒鸡蛋",
        "description": "锅烧热，倒入食用油，油热后倒入打散的鸡蛋",
        "image": "https://xxx.cloudfront.net/images/steps/recipe_001_2.jpg",
        "timer": {"duration": 60, "description": "小火炒鸡蛋"}
      },
      // ...更多步骤
    ],
    "tips": [
      "西红柿最好选择成熟但不软烂的",
      "鸡蛋炒至七分熟即可盛出，避免过老"
    ],
    "nutritionFacts": {
      "calories": 220,
      "protein": "13g",
      "fat": "15g",
      "carbs": "8g"
    }
  }
}
```

### 3. 收藏菜谱

添加或取消收藏菜谱。

**请求**

```
POST /user/favorites
```

**参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| recipeId | String | 是 | 菜谱ID |
| action | String | 是 | "add"或"remove" |

**响应**

```json
{
  "code": 200,
  "data": {
    "success": true,
    "favorites": 120  // 该菜谱的总收藏数
  }
}
```

## 用户相关接口

### 1. 获取用户收藏列表

获取当前用户的收藏菜谱列表。

**请求**

```
GET /user/favorites
```

**参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | Number | 否 | 页码，默认1 |
| size | Number | 否 | 每页数量，默认20 |

**响应**

```json
{
  "code": 200,
  "data": {
    "total": 8,
    "page": 1,
    "size": 20,
    "list": [
      {
        "id": "recipe_001",
        "name": "西红柿炒鸡蛋",
        "cover": "https://xxx.cloudfront.net/images/recipe_001.jpg",
        "difficulty": 1,
        "favoriteTime": "2023-07-10T08:30:00Z"
      },
      // ...更多收藏菜谱
    ]
  }
}
```

### 2. 提交菜谱反馈

提交菜谱问题反馈或改进建议。

**请求**

```
POST /feedback
```

**参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| recipeId | String | 是 | 菜谱ID |
| type | String | 是 | 反馈类型: "bug"/"suggestion"/"improvement" |
| content | String | 是 | 反馈内容 |
| images | Array | 否 | 图片文件ID数组 |
| operationLogs | Array | 否 | 操作日志 |

**响应**

```json
{
  "code": 200,
  "data": {
    "feedbackId": "fb_12345",
    "createTime": "2023-07-14T10:30:00Z"
  }
}
```

## 计时器相关接口

### 1. 同步计时器记录

同步用户的计时器使用记录，用于优化体验。

**请求**

```
POST /timers/sync
```

**参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| recipeId | String | 是 | 菜谱ID |
| stepId | Number | 是 | 步骤ID |
| actualDuration | Number | 是 | 实际计时时长（秒） |
| completed | Boolean | 是 | 是否完成计时 |

**响应**

```json
{
  "code": 200,
  "data": {
    "success": true,
    "avgDuration": 65  // 该步骤的平均计时时长（秒）
  }
}
```

## 数据同步接口

### 1. 获取菜谱更新状态

获取菜谱数据的最新同步状态。

**请求**

```
GET /sync/status
```

**响应**

```json
{
  "code": 200,
  "data": {
    "lastSyncTime": "2023-07-13T22:00:00Z",
    "totalRecipes": 156,
    "newRecipes": 3,
    "updatedRecipes": 5
  }
}
```