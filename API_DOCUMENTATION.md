# 📡 Pi Academy Social - API Documentation

Complete API reference for Pi Academy Social backend.

---

## 🌐 Base URL

```
Development: http://localhost:3001
Production: https://api.yourdomain.com
```

---

## 🔐 Authentication

All API requests require authentication via Pi Network SDK.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {pi_access_token}
```

---

## 📚 API Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "Pi Academy Backend API is running",
  "timestamp": "2024-12-16T14:00:00.000Z"
}
```

---

## 👤 User Endpoints

### Get User Profile

#### GET /api/users/:userId

Get user profile information.

**Parameters:**
- `userId` (string) - User ID from Pi Network

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "PIA123456789",
    "username": "Pioneer123",
    "avatar": "🎓",
    "joinDate": "2024-11-01"
  }
}
```

### Update User Profile

#### PUT /api/users/:userId

Update user profile.

**Request Body:**
```json
{
  "username": "NewUsername",
  "avatar": "🚀"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "PIA123456789",
    "username": "NewUsername",
    "avatar": "🚀",
    "joinDate": "2024-11-01"
  }
}
```

### Get User Progress

#### GET /api/users/:userId/progress

Get user learning progress and stats.

**Response:**
```json
{
  "success": true,
  "data": {
    "level": 3,
    "xp": 250,
    "xpToNext": 50,
    "streak": 5,
    "piBalance": 0.0125,
    "completedCourses": [1, 2],
    "totalPoints": 250,
    "stakingBalance": 0,
    "stakingRewards": 0
  }
}
```

### Update User Progress

#### PUT /api/users/:userId/progress

Update user progress (internal use).

**Request Body:**
```json
{
  "xp": 300,
  "level": 4,
  "piBalance": 0.015
}
```

---

## 💳 Payment Endpoints

### Approve Payment

#### POST /api/payments/approve

Approve a Pi Network payment (server-side).

**Request Body:**
```json
{
  "paymentId": "pi_payment_123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment approved",
  "paymentId": "pi_payment_123456"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid payment amount"
}
```

### Complete Payment

#### POST /api/payments/complete

Complete a Pi Network payment.

**Request Body:**
```json
{
  "paymentId": "pi_payment_123456",
  "txid": "0x1234567890abcdef"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment completed",
  "paymentId": "pi_payment_123456",
  "txid": "0x1234567890abcdef"
}
```

### Get Payment Status

#### GET /api/payments/:paymentId

Get payment status.

**Response:**
```json
{
  "success": true,
  "data": {
    "identifier": "pi_payment_123456",
    "status": "completed",
    "amount": 0.01,
    "memo": "Premium Subscription",
    "txid": "0x1234567890abcdef"
  }
}
```

**Payment Statuses:**
- `pending` - Payment initiated
- `completed` - Payment successful
- `cancelled` - Payment cancelled by user
- `failed` - Payment failed

---

## 📖 Course Endpoints

### Get All Courses

#### GET /api/courses

Get list of all available courses.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Introduction à Pi Network",
      "category": "Pi Basics",
      "xp": 50,
      "piReward": 0.0002,
      "premium": false,
      "icon": "🥧",
      "description": "Découvrez les fondamentaux de Pi Network"
    }
  ]
}
```

### Complete Course

#### POST /api/courses/complete

Mark a course as completed.

**Request Body:**
```json
{
  "userId": "PIA123456789",
  "courseId": 1,
  "score": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course completed",
  "rewards": {
    "xp": 50,
    "pi": 0.0002
  }
}
```

---

## 📱 Social Endpoints

### Get Social Feed

#### GET /api/social/feed?limit=50

Get social feed posts.

**Query Parameters:**
- `limit` (number, optional) - Number of posts to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user": "Pioneer123",
      "avatar": "🎓",
      "time": "2 hours ago",
      "content": "Just completed my first course!",
      "likes": 15,
      "timestamp": 1702742400000
    }
  ]
}
```

### Create Post

#### POST /api/social/post

Create a new social post.

**Request Body:**
```json
{
  "userId": "PIA123456789",
  "content": "Just completed my first course!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": "Pioneer123",
    "avatar": "🎓",
    "time": "Just now",
    "content": "Just completed my first course!",
    "likes": 0,
    "timestamp": 1702742400000
  }
}
```

### Like Post

#### POST /api/social/like

Like a social post.

**Request Body:**
```json
{
  "postId": "post_123456",
  "userId": "PIA123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post liked"
}
```

---

## 🏆 Leaderboard Endpoints

### Get Top Users

#### GET /api/leaderboard/top?limit=10

Get top users by points.

**Query Parameters:**
- `limit` (number, optional) - Number of users to return (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "username": "Pioneer123",
      "avatar": "🎓",
      "points": 1250,
      "level": 12
    }
  ]
}
```

---

## ❌ Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## 🔄 Rate Limiting

API requests are rate-limited to prevent abuse:

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later."
}
```

---

## 🔌 WebSocket Events (Future)

*Coming soon: Real-time updates for social feed, leaderboard, and notifications.*

---

## 📝 Example Usage

### JavaScript/TypeScript

```typescript
// Using fetch
const response = await fetch('http://localhost:3001/api/users/PIA123456789', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_pi_token'
  }
});

const data = await response.json();
console.log(data);
```

### cURL

```bash
# Get user profile
curl -X GET http://localhost:3001/api/users/PIA123456789 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_pi_token"

# Create post
curl -X POST http://localhost:3001/api/social/post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_pi_token" \
  -d '{"userId":"PIA123456789","content":"Hello World!"}'
```

---

## 🧪 Testing

### Postman Collection

Import the Postman collection for easy API testing:

```json
{
  "info": {
    "name": "Pi Academy API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/health"
      }
    }
  ]
}
```

### Environment Variables

```json
{
  "base_url": "http://localhost:3001",
  "pi_token": "your_test_token"
}
```

---

## 📞 Support

For API support and questions:
- **Documentation**: This file
- **Backend README**: [backend/README.md](backend/README.md)
- **Pi Network Docs**: https://developers.minepi.com

---

**API Version**: 1.0.0  
**Last Updated**: 2024-12-16
