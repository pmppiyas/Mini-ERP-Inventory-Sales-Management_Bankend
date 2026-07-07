# Mini ERP - Inventory & Sales Management System (Backend)

A RESTful backend API for the **Mini ERP - Inventory & Sales Management System** built with **Node.js, Express.js, TypeScript, MongoDB, and Mongoose**.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Passport.js
- Cloudinary (Image Upload)
- Multer
- Zod (Validation)

---

## 📂 Project Structure

```
src/
│
├── app/
│   ├── config/
│   ├── middleware/
│   ├── module/
│   │   ├── auth/
│   │   ├── product/
│   │   ├── sales/
│   │   └── dashboard/
│   ├── routes/
│   ├── utils/
│   └── error/
│
├── app.ts
├── server.ts
└── index.ts
```

---

# Features

## Authentication

- JWT Authentication
- Login
- Protected Routes
- Role Based Authorization

### Roles

- Admin
- Manager
- Employee

---

## Product Module

- Create Product
- Update Product
- Delete Product
- Get All Products
- Get Single Product
- Product Image Upload
- Search
- Pagination

---

## Sales Module

- Create Sale
- Multiple Product Support
- Automatic Stock Update
- Prevent Insufficient Stock Sales
- Grand Total Calculation
- Sales History

---

## Dashboard

- Total Products
- Total Sales
- Low Stock Products

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/pmppiyas/Mini-ERP-Inventory-Sales-Management_Bankend
```

## Go to Project Folder

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

---

# Environment Variables

Create a **.env** file in the project root.

```env
PORT=5000

NODE_ENV=development

DATABASE_URL=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES=7d

JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=30d

BCRYPT_SALT_ROUNDS=10

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# Run the Project

Development

```bash
npm run dev
```

or

```bash
pnpm dev
```

Production

```bash
npm run build
npm start
```

---

# API Base URL

```
http://localhost:5000/api/v1
```

---

# Authentication

Protected APIs require a JWT access token.

Example

```
Authorization: Bearer <access_token>
```

---

# API Endpoints

## Authentication

| Method | Endpoint    | Description |
| ------ | ----------- | ----------- |
| POST   | /auth/login | User Login  |

---

## Products

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| GET    | /products     | Get All Products   |
| GET    | /products/:id | Get Single Product |
| POST   | /products     | Create Product     |
| PATCH  | /products/:id | Update Product     |
| DELETE | /products/:id | Delete Product     |

---

## Sales

| Method | Endpoint | Description   |
| ------ | -------- | ------------- |
| POST   | /sales   | Create Sale   |
| GET    | /sales   | Sales History |

---

## Dashboard

| Method | Endpoint   | Description          |
| ------ | ---------- | -------------------- |
| GET    | /dashboard | Dashboard Statistics |

---

# Folder Architecture

```
app
├── config
├── middleware
├── module
│   ├── auth
│   ├── dashboard
│   ├── product
│   └── sales
├── routes
├── utils
└── error
```

---

# Error Handling

- Global Error Handler
- Custom AppError
- Validation Error Handling
- Proper HTTP Status Codes
- Consistent API Response

---

# Security

- JWT Authentication
- Password Hashing (bcrypt)
- Role Based Authorization
- Protected Routes
- Input Validation

---

# Scripts

```bash
npm run dev
```

Start development server.

```bash
npm run build
```

Build the project.

```bash
npm start
```

Run production server.

---

# Author

**Developer:** Prince Mahmud Piyas

---

# License

This project is developed for the **MERN Stack Technical Assessment**.
