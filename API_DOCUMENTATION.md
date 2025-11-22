# Backend API Documentation

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Response Format

### Success Response
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Error description"
    }
  ]
}
\`\`\`

## Endpoints

### Authentication

#### Register User
**POST** \`/auth/register\`

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
\`\`\`

#### Login
**POST** \`/auth/login\`

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

#### Get Current User
**GET** \`/auth/me\`

**Headers:** Authorization required

#### Update Profile
**PUT** \`/auth/update-profile\`

**Headers:** Authorization required

**Request Body:**
\`\`\`json
{
  "name": "John Updated",
  "bio": "My bio text",
  "avatar": "https://example.com/avatar.jpg"
}
\`\`\`

#### Change Password
**PUT** \`/auth/change-password\`

**Headers:** Authorization required

**Request Body:**
\`\`\`json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
\`\`\`

---

### Projects

#### Get All Projects
**GET** \`/projects\`

**Headers:** Authorization required

**Query Parameters:**
- \`status\` - Filter by status (planning, active, on-hold, completed, archived)
- \`search\` - Search in project name

**Response:**
\`\`\`json
{
  "success": true,
  "count": 5,
  "data": {
    "projects": [
      {
        "_id": "project_id",
        "name": "Project Name",
        "description": "Project description",
        "owner": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "members": [
          {
            "user": {
              "_id": "user_id",
              "name": "Jane Doe"
            },
            "role": "member"
          }
        ],
        "status": "active",
        "priority": "high",
        "dueDate": "2024-12-31T00:00:00.000Z",
        "tags": ["urgent", "client-work"],
        "color": "#3B82F6",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
\`\`\`

#### Get Project by ID
**GET** \`/projects/:id\`

**Headers:** Authorization required

**Response:** Returns project details with task statistics

#### Create Project
**POST** \`/projects\`

**Headers:** Authorization required

**Request Body:**
\`\`\`json
{
  "name": "New Project",
  "description": "Project description",
  "status": "planning",
  "priority": "medium",
  "dueDate": "2024-12-31",
  "tags": ["tag1", "tag2"],
  "color": "#3B82F6"
}
\`\`\`

#### Update Project
**PUT** \`/projects/:id\`

**Headers:** Authorization required

**Request Body:** Same as Create Project (all fields optional)

#### Delete Project
**DELETE** \`/projects/:id\`

**Headers:** Authorization required

**Note:** Only project owner can delete. This also deletes all associated tasks.

#### Add Project Member
**POST** \`/projects/:id/members\`

**Headers:** Authorization required

**Request Body:**
\`\`\`json
{
  "userId": "user_id_to_add",
  "role": "member"
}
\`\`\`

**Roles:** owner, admin, member, viewer

#### Remove Project Member
**DELETE** \`/projects/:id/members/:userId\`

**Headers:** Authorization required

**Note:** Only project owner can remove members.

---

### Tasks

#### Get All Tasks
**GET** \`/tasks\`

**Headers:** Authorization required

**Query Parameters:**
- \`project\` - Filter by project ID
- \`status\` - Filter by status (todo, in-progress, review, completed)
- \`assignedTo\` - Filter by assigned user ID
- \`priority\` - Filter by priority (low, medium, high, critical)
- \`search\` - Search in title and description

#### Get Task by ID
**GET** \`/tasks/:id\`

**Headers:** Authorization required

#### Create Task
**POST** \`/tasks\`

**Headers:** Authorization required

**Request Body:**
\`\`\`json
{
  "title": "Task Title",
  "description": "Task description",
  "project": "project_id",
  "assignedTo": "user_id",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2024-12-31",
  "tags": ["tag1", "tag2"],
  "estimatedHours": 8
}
\`\`\`

#### Update Task
**PUT** \`/tasks/:id\`

**Headers:** Authorization required

**Request Body:** Same as Create Task (all fields optional)

#### Delete Task
**DELETE** \`/tasks/:id\`

**Headers:** Authorization required

#### Add Comment
**POST** \`/tasks/:id/comments\`

**Headers:** Authorization required

**Request Body:**
\`\`\`json
{
  "text": "This is a comment"
}
\`\`\`

---

### Users

#### Get All Users
**GET** \`/users\`

**Headers:** Authorization required

**Query Parameters:**
- \`search\` - Search by name or email
- \`role\` - Filter by role (user, admin)
- \`limit\` - Limit results (default: 50)

#### Get User by ID
**GET** \`/users/:id\`

**Headers:** Authorization required

#### Delete User
**DELETE** \`/users/:id\`

**Headers:** Authorization required (Admin only)

**Note:** This is a soft delete (sets isActive to false)

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Window:** 15 minutes
- **Max Requests:** 100 per window per IP

When rate limit is exceeded:
\`\`\`json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
\`\`\`

## WebSocket Events

The application uses Socket.io for real-time updates.

### Client Events
- \`join-project\` - Join a project room
- \`leave-project\` - Leave a project room

### Server Events
- \`project-created\` - New project created
- \`project-updated\` - Project updated
- \`project-deleted\` - Project deleted
- \`task-created\` - New task created
- \`task-updated\` - Task updated
- \`task-deleted\` - Task deleted
- \`comment-added\` - Comment added to task
- \`member-added\` - Member added to project
- \`member-removed\` - Member removed from project
