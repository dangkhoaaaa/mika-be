# beMika - Backend API for phimMika and truyenMika

Backend API service built with NestJS, MongoDB, and TypeScript. Provides authentication, user management, watch history, favorites, comments, and ratings functionality for both phimMika and truyenMika applications.

## Features

- 🔐 **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Password hashing with bcrypt

- 👤 **User Management**
  - User profile management
  - Avatar upload
  - Profile information update

- 📺 **Watch History**
  - Track viewing history for movies and comics
  - Resume watching functionality
  - Clear history

- ❤️ **Favorites**
  - Save favorite comics
  - Manage favorites list

- 💬 **Comments**
  - Comment on movies and comics
  - Reply to comments (nested comments)
  - Like comments
  - Edit and delete own comments

- ⭐ **Ratings**
  - Star ratings (1-5) for movies and comics
  - View average ratings
  - Rating statistics

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. Clone the repository and navigate to the project directory:
```bash
cd beMika
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/bemika

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

MAX_FILE_SIZE=5242880
UPLOAD_DEST=./uploads

CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

4. Create uploads directory:
```bash
mkdir -p uploads/avatars
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get current user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `PUT /api/users/avatar` - Upload avatar (Protected)

### Watch History
- `POST /api/watch-history` - Create or update watch history (Protected)
- `GET /api/watch-history` - Get user watch history (Protected)
- `GET /api/watch-history/:contentId` - Get specific watch history (Protected)
- `PUT /api/watch-history/:contentId` - Update watch history (Protected)
- `DELETE /api/watch-history/:contentId` - Delete watch history (Protected)
- `DELETE /api/watch-history` - Clear all watch history (Protected)

### Favorites
- `POST /api/favorites` - Add comic to favorites (Protected)
- `GET /api/favorites` - Get user favorites (Protected)
- `GET /api/favorites/check/:contentId` - Check if comic is favorited (Protected)
- `DELETE /api/favorites/:contentId` - Remove from favorites (Protected)
- `DELETE /api/favorites` - Clear all favorites (Protected)

### Comments
- `POST /api/comments` - Create a comment (Protected)
- `GET /api/comments?contentType=movie&contentId=xxx` - Get comments (Public)
- `GET /api/comments/replies/:parentId` - Get comment replies (Public)
- `PUT /api/comments/:id` - Update comment (Protected)
- `DELETE /api/comments/:id` - Delete comment (Protected)
- `POST /api/comments/:id/like` - Like/unlike comment (Public)

### Ratings
- `POST /api/ratings` - Create or update rating (Protected)
- `GET /api/ratings/content?contentType=movie&contentId=xxx` - Get content rating (Public)
- `GET /api/ratings/user?contentType=movie&contentId=xxx` - Get user rating (Protected)
- `DELETE /api/ratings?contentType=movie&contentId=xxx` - Delete rating (Protected)

## Request/Response Examples

### Register User
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "fullName": "Full Name"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create Watch History
```json
POST /api/watch-history
Authorization: Bearer <token>
{
  "contentType": "movie",
  "contentId": "movie-id",
  "contentTitle": "Movie Title",
  "episodeId": "episode-1",
  "watchTime": 1200,
  "totalDuration": 3600
}
```

### Add Favorite
```json
POST /api/favorites
Authorization: Bearer <token>
{
  "contentType": "comic",
  "contentId": "comic-id",
  "contentTitle": "Comic Title",
  "contentThumb": "https://example.com/thumb.jpg",
  "contentSlug": "comic-slug"
}
```

### Create Comment
```json
POST /api/comments
Authorization: Bearer <token>
{
  "contentType": "movie",
  "contentId": "movie-id",
  "content": "Great movie!",
  "parentId": null
}
```

### Create Rating
```json
POST /api/ratings
Authorization: Bearer <token>
{
  "contentType": "movie",
  "contentId": "movie-id",
  "stars": 5
}
```

## Project Structure

```
beMika/
├── src/
│   ├── auth/              # Authentication module
│   ├── users/             # User management module
│   ├── watch-history/     # Watch history module
│   ├── favorites/         # Favorites module
│   ├── comments/          # Comments module
│   ├── ratings/           # Ratings module
│   ├── app.module.ts      # Root module
│   ├── app.controller.ts  # Root controller
│   └── main.ts            # Application entry point
├── uploads/               # Uploaded files
├── package.json
├── tsconfig.json
└── README.md
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with class-validator
- CORS configuration
- File upload size limits
- User authorization checks

## Development

### Code Style
- Follow NestJS conventions
- Use TypeScript strict mode
- Write clean, commented code in English
- Follow SOLID principles

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

ISC
# mika-be
