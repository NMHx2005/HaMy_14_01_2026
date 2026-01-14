# Library Management System

Hệ thống quản lý thư viện với Node.js, React, MySQL.

## Cấu trúc dự án

```
HaMy_14_01_2026/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config/       # Cấu hình database, JWT
│   │   ├── controllers/  # Xử lý logic API
│   │   ├── middlewares/  # Auth, validation, error handling
│   │   ├── models/       # Sequelize models (18 models)
│   │   ├── routes/       # API routes
│   │   └── validators/   # Input validation
│   ├── seeders/          # Dữ liệu mẫu
│   ├── scripts/          # Scripts tiện ích
│   ├── .env              # Cấu hình môi trường
│   ├── package.json
│   └── server.js
│
└── frontend/         # React + Vite + Tailwind (chờ design)
```

## Yêu cầu hệ thống

- Node.js >= 18.x
- MySQL >= 8.0
- npm hoặc yarn

## Cài đặt Backend

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```
(tạo connection mới, nhập mật khẩu và lưu vào env)
### 2. Cấu hình database

Tạo database MySQL:
```sql
CREATE DATABASE library_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Chỉnh sửa file `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=library_management
DB_USER=root
DB_PASSWORD=your_password
```

### 3. Khởi tạo database và dữ liệu mẫu

```bash
node scripts/initDb.js
```

### 4. Chạy server

```bash
# Development mode (với hot reload)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: http://localhost:5000

## Tài khoản mặc định

| Username   | Password   | Role       |
|------------|------------|------------|
| admin      | admin123   | Admin      |
| librarian  | admin123   | Thủ thư    |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký độc giả
- `GET /api/auth/me` - Thông tin user hiện tại
- `PUT /api/auth/change-password` - Đổi mật khẩu

### Danh mục
- `GET/POST /api/fields` - Lĩnh vực
- `GET/POST /api/genres` - Thể loại
- `GET/POST /api/authors` - Tác giả
- `GET/POST /api/publishers` - Nhà xuất bản

### Sách
- `GET/POST /api/books` - Đầu sách
- `GET/POST /api/books/:id/editions` - Phiên bản
- `GET/POST /api/editions/:id/copies` - Bản sách

### Độc giả
- `GET/POST /api/readers` - Độc giả
- `POST /api/library-cards` - Cấp thẻ thư viện

### Mượn trả
- `GET/POST /api/borrow-requests` - Phiếu mượn
- `PUT /api/borrow-requests/:id/approve` - Duyệt
- `PUT /api/borrow-requests/:id/return` - Trả sách

### Tài chính
- `GET /api/fines` - Tiền phạt
- `GET /api/deposits` - Tiền cọc

### Thống kê
- `GET /api/statistics/dashboard` - Tổng quan
- `GET /api/statistics/overdue` - Sách quá hạn
- `GET /api/reports/semi-annual` - Báo cáo 6 tháng

## Phân quyền

| Chức năng | Admin | Thủ thư | Độc giả |
|-----------|-------|---------|---------|
| Quản lý nhân viên | ✅ | ❌ | ❌ |
| Cấu hình hệ thống | ✅ | ❌ | ❌ |
| Thêm/Sửa danh mục | ✅ | ✅ | ❌ |
| Xóa danh mục | ✅ | ❌ | ❌ |
| Quản lý sách | ✅ | ✅ | ❌ |
| Thanh lý sách | ✅ | ❌ | ❌ |
| Quản lý độc giả | ✅ | ✅ | ❌ |
| Xóa độc giả | ✅ | ❌ | ❌ |
| Duyệt phiếu mượn | ✅ | ✅ | ❌ |
| Tạo phiếu mượn | ✅ | ✅ | ⚠️ (chờ duyệt) |
| Thu tiền phạt/cọc | ✅ | ✅ | ❌ |
| Xem thống kê | ✅ | ✅ | ❌ |

## Công thức tính tiền phạt

```
Tiền phạt = Giá sách × 10% × Số ngày quá hạn
```

## License

MIT
