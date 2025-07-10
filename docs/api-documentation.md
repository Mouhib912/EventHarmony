# API Documentation

This document provides detailed information about the EventHarmony API endpoints, request/response formats, and authentication requirements.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:5000/api
```

In production, this would be replaced with your domain.

## Authentication

Most API endpoints require authentication. To authenticate, include a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

You can obtain a JWT token by logging in through the `/api/auth/login` endpoint.

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of a request:

- `200 OK`: The request was successful
- `201 Created`: A resource was successfully created
- `400 Bad Request`: The request was malformed or invalid
- `401 Unauthorized`: Authentication is required or failed
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

Error responses follow this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## API Endpoints

### Authentication

#### Register a new user

```
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login

```
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Logout

```
GET /api/auth/logout
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get current user

```
GET /api/auth/me
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Update password

```
PUT /api/auth/updatepassword
```

**Request Body:**

```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123",
  "newPasswordConfirm": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Forgot password

```
POST /api/auth/forgotpassword
```

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email sent"
}
```

#### Reset password

```
PUT /api/auth/resetpassword/:resetToken
```

**Request Body:**

```json
{
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Users

#### Get all users (Admin only)

```
GET /api/users
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "admin"
    }
  ]
}
```

#### Get user by ID (Admin only)

```
GET /api/users/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Create user (Admin only)

```
POST /api/users
```

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "role": "user"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

#### Update user (Admin only)

```
PUT /api/users/:id
```

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "admin"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "admin"
  }
}
```

#### Delete user (Admin only)

```
DELETE /api/users/:id
```

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

#### Update profile

```
PUT /api/users/profile
```

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "user"
  }
}
```

#### Update profile image

```
PUT /api/users/profile/image
```

**Request Body:**
Form data with a file field named `image`

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "user",
    "image": "user-60d21b4667d0d8992e610c85-1624548486937.jpg"
  }
}
```

### Events

#### Get all events

```
GET /api/events
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "Tech Conference 2023",
      "description": "Annual technology conference",
      "startDate": "2023-06-15T00:00:00.000Z",
      "endDate": "2023-06-17T00:00:00.000Z",
      "location": "New York",
      "modules": ["registration", "badge", "b2b"],
      "client": "60d21b4667d0d8992e610c88"
    },
    {
      "_id": "60d21b4667d0d8992e610c89",
      "name": "Business Expo 2023",
      "description": "Business exhibition",
      "startDate": "2023-07-10T00:00:00.000Z",
      "endDate": "2023-07-12T00:00:00.000Z",
      "location": "Chicago",
      "modules": ["registration", "badge"],
      "client": "60d21b4667d0d8992e610c90"
    }
  ]
}
```

#### Get event by ID

```
GET /api/events/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "name": "Tech Conference 2023",
    "description": "Annual technology conference",
    "startDate": "2023-06-15T00:00:00.000Z",
    "endDate": "2023-06-17T00:00:00.000Z",
    "location": "New York",
    "modules": ["registration", "badge", "b2b"],
    "client": {
      "_id": "60d21b4667d0d8992e610c88",
      "name": "Tech Corp",
      "email": "contact@techcorp.com"
    }
  }
}
```

#### Create event (Admin/Product Owner only)

```
POST /api/events
```

**Request Body:**

```json
{
  "name": "Tech Conference 2023",
  "description": "Annual technology conference",
  "startDate": "2023-06-15",
  "endDate": "2023-06-17",
  "location": "New York",
  "modules": ["registration", "badge", "b2b"],
  "client": "60d21b4667d0d8992e610c88"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "name": "Tech Conference 2023",
    "description": "Annual technology conference",
    "startDate": "2023-06-15T00:00:00.000Z",
    "endDate": "2023-06-17T00:00:00.000Z",
    "location": "New York",
    "modules": ["registration", "badge", "b2b"],
    "client": "60d21b4667d0d8992e610c88"
  }
}
```

#### Update event (Admin/Product Owner/Client only)

```
PUT /api/events/:id
```

**Request Body:**

```json
{
  "name": "Tech Conference 2023 - Updated",
  "description": "Updated description",
  "location": "Boston"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "name": "Tech Conference 2023 - Updated",
    "description": "Updated description",
    "startDate": "2023-06-15T00:00:00.000Z",
    "endDate": "2023-06-17T00:00:00.000Z",
    "location": "Boston",
    "modules": ["registration", "badge", "b2b"],
    "client": "60d21b4667d0d8992e610c88"
  }
}
```

#### Delete event (Admin/Product Owner only)

```
DELETE /api/events/:id
```

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

### Participants

#### Get all participants for an event

```
GET /api/events/:eventId/participants
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c91",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "company": "ABC Corp",
      "position": "CEO",
      "event": "60d21b4667d0d8992e610c87",
      "badgePrinted": true,
      "checkedIn": true
    },
    {
      "_id": "60d21b4667d0d8992e610c92",
      "name": "Bob Smith",
      "email": "bob@example.com",
      "company": "XYZ Inc",
      "position": "CTO",
      "event": "60d21b4667d0d8992e610c87",
      "badgePrinted": false,
      "checkedIn": false
    }
  ]
}
```

#### Get participant by ID

```
GET /api/events/:eventId/participants/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c91",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "company": "ABC Corp",
    "position": "CEO",
    "event": "60d21b4667d0d8992e610c87",
    "badgePrinted": true,
    "checkedIn": true
  }
}
```

#### Create participant

```
POST /api/events/:eventId/participants
```

**Request Body:**

```json
{
  "name": "Charlie Brown",
  "email": "charlie@example.com",
  "company": "DEF Ltd",
  "position": "Manager",
  "phone": "+1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c93",
    "name": "Charlie Brown",
    "email": "charlie@example.com",
    "company": "DEF Ltd",
    "position": "Manager",
    "phone": "+1234567890",
    "event": "60d21b4667d0d8992e610c87",
    "badgePrinted": false,
    "checkedIn": false
  }
}
```

#### Update participant

```
PUT /api/events/:eventId/participants/:id
```

**Request Body:**

```json
{
  "name": "Charlie Brown Jr",
  "position": "Senior Manager",
  "badgePrinted": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c93",
    "name": "Charlie Brown Jr",
    "email": "charlie@example.com",
    "company": "DEF Ltd",
    "position": "Senior Manager",
    "phone": "+1234567890",
    "event": "60d21b4667d0d8992e610c87",
    "badgePrinted": true,
    "checkedIn": false
  }
}
```

#### Delete participant

```
DELETE /api/events/:eventId/participants/:id
```

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

#### Check-in participant

```
PUT /api/events/:eventId/participants/:id/checkin
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c93",
    "name": "Charlie Brown Jr",
    "email": "charlie@example.com",
    "company": "DEF Ltd",
    "position": "Senior Manager",
    "event": "60d21b4667d0d8992e610c87",
    "badgePrinted": true,
    "checkedIn": true,
    "checkInTime": "2023-06-15T10:30:00.000Z"
  }
}
```

#### Generate participant badge

```
GET /api/events/:eventId/participants/:id/badge
```

**Response:**
A QR code image or a JSON object with the QR code data URL.

### B2B Meetings

#### Get all meetings for an event

```
GET /api/events/:eventId/meetings
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c94",
      "participant1": {
        "_id": "60d21b4667d0d8992e610c91",
        "name": "Alice Johnson",
        "company": "ABC Corp"
      },
      "participant2": {
        "_id": "60d21b4667d0d8992e610c92",
        "name": "Bob Smith",
        "company": "XYZ Inc"
      },
      "event": "60d21b4667d0d8992e610c87",
      "startTime": "2023-06-15T14:00:00.000Z",
      "endTime": "2023-06-15T14:30:00.000Z",
      "status": "confirmed",
      "location": "Room A"
    },
    {
      "_id": "60d21b4667d0d8992e610c95",
      "participant1": {
        "_id": "60d21b4667d0d8992e610c91",
        "name": "Alice Johnson",
        "company": "ABC Corp"
      },
      "participant2": {
        "_id": "60d21b4667d0d8992e610c93",
        "name": "Charlie Brown Jr",
        "company": "DEF Ltd"
      },
      "event": "60d21b4667d0d8992e610c87",
      "startTime": "2023-06-15T15:00:00.000Z",
      "endTime": "2023-06-15T15:30:00.000Z",
      "status": "pending",
      "location": "Room B"
    }
  ]
}
```

#### Get meeting by ID

```
GET /api/events/:eventId/meetings/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c94",
    "participant1": {
      "_id": "60d21b4667d0d8992e610c91",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "company": "ABC Corp",
      "position": "CEO"
    },
    "participant2": {
      "_id": "60d21b4667d0d8992e610c92",
      "name": "Bob Smith",
      "email": "bob@example.com",
      "company": "XYZ Inc",
      "position": "CTO"
    },
    "event": "60d21b4667d0d8992e610c87",
    "startTime": "2023-06-15T14:00:00.000Z",
    "endTime": "2023-06-15T14:30:00.000Z",
    "status": "confirmed",
    "location": "Room A",
    "notes": "Discuss partnership opportunities"
  }
}
```

#### Create meeting

```
POST /api/events/:eventId/meetings
```

**Request Body:**

```json
{
  "participant1": "60d21b4667d0d8992e610c91",
  "participant2": "60d21b4667d0d8992e610c93",
  "startTime": "2023-06-16T10:00:00.000Z",
  "endTime": "2023-06-16T10:30:00.000Z",
  "location": "Room C",
  "notes": "Initial introduction"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c96",
    "participant1": "60d21b4667d0d8992e610c91",
    "participant2": "60d21b4667d0d8992e610c93",
    "event": "60d21b4667d0d8992e610c87",
    "startTime": "2023-06-16T10:00:00.000Z",
    "endTime": "2023-06-16T10:30:00.000Z",
    "status": "pending",
    "location": "Room C",
    "notes": "Initial introduction"
  }
}
```

#### Update meeting

```
PUT /api/events/:eventId/meetings/:id
```

**Request Body:**

```json
{
  "status": "confirmed",
  "location": "Room D",
  "notes": "Updated notes"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c96",
    "participant1": "60d21b4667d0d8992e610c91",
    "participant2": "60d21b4667d0d8992e610c93",
    "event": "60d21b4667d0d8992e610c87",
    "startTime": "2023-06-16T10:00:00.000Z",
    "endTime": "2023-06-16T10:30:00.000Z",
    "status": "confirmed",
    "location": "Room D",
    "notes": "Updated notes"
  }
}
```

#### Delete meeting

```
DELETE /api/events/:eventId/meetings/:id
```

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

### Statistics

#### Get event statistics

```
GET /api/events/:eventId/statistics
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalParticipants": 150,
    "checkedIn": 120,
    "badgePrinted": 130,
    "totalMeetings": 75,
    "confirmedMeetings": 60,
    "pendingMeetings": 10,
    "cancelledMeetings": 5,
    "participantsByCompany": [
      { "company": "ABC Corp", "count": 15 },
      { "company": "XYZ Inc", "count": 12 },
      { "company": "DEF Ltd", "count": 10 }
    ],
    "participantsByPosition": [
      { "position": "CEO", "count": 20 },
      { "position": "CTO", "count": 15 },
      { "position": "Manager", "count": 30 }
    ],
    "registrationTimeline": [
      { "date": "2023-05-01", "count": 10 },
      { "date": "2023-05-02", "count": 15 },
      { "date": "2023-05-03", "count": 20 }
    ],
    "checkInTimeline": [
      { "hour": "08:00", "count": 20 },
      { "hour": "09:00", "count": 35 },
      { "hour": "10:00", "count": 25 }
    ]
  }
}
```

## Rate Limiting

To prevent abuse, the API implements rate limiting. By default, clients are limited to 100 requests per 15-minute window. When the rate limit is exceeded, the API will respond with a 429 Too Many Requests status code.

## Pagination

Endpoints that return multiple items (like GET /api/users or GET /api/events) support pagination. You can use the following query parameters:

- `page`: The page number (default: 1)
- `limit`: The number of items per page (default: 10, max: 100)

Example:

```
GET /api/events?page=2&limit=20
```

The response will include pagination information:

```json
{
  "success": true,
  "count": 45,
  "pagination": {
    "current": 2,
    "pages": 3,
    "next": 3,
    "prev": 1
  },
  "data": [...]
}
```

## Filtering

Some endpoints support filtering. You can use query parameters to filter the results:

Example:

```
GET /api/events?location=New%20York&startDate[gte]=2023-06-01&startDate[lte]=2023-06-30
```

## Sorting

You can sort the results using the `sort` query parameter. Prefix the field name with `-` for descending order:

Example:

```
GET /api/events?sort=-startDate,name
```

This will sort the events by start date in descending order, and then by name in ascending order.

## Field Selection

You can select which fields to include in the response using the `fields` query parameter:

Example:

```
GET /api/events?fields=name,startDate,location
```

This will only include the name, startDate, and location fields in the response.