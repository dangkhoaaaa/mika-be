# Hướng dẫn Setup và Sử dụng beMika Backend

## Yêu cầu hệ thống

- Node.js v18 trở lên
- MongoDB v5 trở lên (cài đặt local hoặc sử dụng MongoDB Atlas)
- npm hoặc yarn

## Cài đặt

### 1. Cài đặt dependencies

```bash
cd beMika
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` trong thư mục root của beMika:

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

**Lưu ý**: Thay đổi `JWT_SECRET` bằng một chuỗi bí mật mạnh trong môi trường production.

### 3. Tạo thư mục uploads

```bash
mkdir -p uploads/avatars
```

### 4. Khởi động MongoDB

Nếu bạn sử dụng MongoDB local:

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

Hoặc sử dụng MongoDB Atlas (cloud) và cập nhật `MONGODB_URI` trong file `.env`.

### 5. Chạy ứng dụng

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

API sẽ chạy tại: `http://localhost:5000/api`

## Cấu trúc API

### Authentication Endpoints

- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập

### User Endpoints (Yêu cầu Authentication)

- `GET /api/users/profile` - Lấy thông tin profile
- `PUT /api/users/profile` - Cập nhật profile
- `PUT /api/users/avatar` - Upload ảnh đại diện

### Watch History Endpoints (Yêu cầu Authentication)

- `POST /api/watch-history` - Tạo/cập nhật lịch sử xem
- `GET /api/watch-history` - Lấy danh sách lịch sử xem
- `GET /api/watch-history/:contentId` - Lấy lịch sử xem cụ thể
- `PUT /api/watch-history/:contentId` - Cập nhật lịch sử xem
- `DELETE /api/watch-history/:contentId` - Xóa lịch sử xem
- `DELETE /api/watch-history` - Xóa tất cả lịch sử

### Favorites Endpoints (Yêu cầu Authentication)

- `POST /api/favorites` - Thêm truyện yêu thích
- `GET /api/favorites` - Lấy danh sách yêu thích
- `GET /api/favorites/check/:contentId` - Kiểm tra đã yêu thích chưa
- `DELETE /api/favorites/:contentId` - Xóa khỏi yêu thích
- `DELETE /api/favorites` - Xóa tất cả yêu thích

### Comments Endpoints

- `POST /api/comments` - Tạo comment (Yêu cầu Authentication)
- `GET /api/comments?contentType=movie&contentId=xxx` - Lấy comments (Public)
- `GET /api/comments/replies/:parentId` - Lấy replies (Public)
- `PUT /api/comments/:id` - Cập nhật comment (Yêu cầu Authentication)
- `DELETE /api/comments/:id` - Xóa comment (Yêu cầu Authentication)
- `POST /api/comments/:id/like` - Like/unlike comment (Public)

### Ratings Endpoints

- `POST /api/ratings` - Tạo/cập nhật rating (Yêu cầu Authentication)
- `GET /api/ratings/content?contentType=movie&contentId=xxx` - Lấy rating thống kê (Public)
- `GET /api/ratings/user?contentType=movie&contentId=xxx` - Lấy rating của user (Yêu cầu Authentication)
- `DELETE /api/ratings?contentType=movie&contentId=xxx` - Xóa rating (Yêu cầu Authentication)

## Cấu hình Frontend

### phimMiKa

Thêm vào file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### truyenMiKa

Thêm vào file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Testing API

Bạn có thể sử dụng Postman, Insomnia, hoặc curl để test API.

### Ví dụ đăng ký:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "testuser",
    "fullName": "Test User"
  }'
```

### Ví dụ đăng nhập:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Ví dụ lấy profile (sau khi có token):

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Schema

### Users Collection
- email, password, username, fullName, avatar, bio, dateOfBirth

### Watch History Collection
- userId, contentType, contentId, contentTitle, episodeId, chapterId, watchTime

### Favorites Collection
- userId, contentType, contentId, contentTitle, contentSlug

### Comments Collection
- userId, contentType, contentId, content, parentId (for replies), likes

### Ratings Collection
- userId, contentType, contentId, stars (1-5)

## Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra MongoDB đã chạy chưa
- Kiểm tra `MONGODB_URI` trong file `.env`
- Kiểm tra firewall và network settings

### Lỗi CORS
- Cập nhật `CORS_ORIGIN` trong file `.env` với đúng URL frontend

### Lỗi upload file
- Đảm bảo thư mục `uploads/avatars` đã được tạo
- Kiểm tra quyền ghi file

## Production Deployment

1. Thay đổi `JWT_SECRET` bằng một chuỗi bí mật mạnh
2. Cập nhật `MONGODB_URI` với connection string từ MongoDB Atlas
3. Cập nhật `CORS_ORIGIN` với domain frontend
4. Set `NODE_ENV=production`
5. Sử dụng PM2 hoặc Docker để chạy ứng dụng
6. Cấu hình reverse proxy (nginx) để serve static files
7. Setup SSL/HTTPS

## Support

Nếu có vấn đề, vui lòng kiểm tra logs trong console hoặc liên hệ với team development.
