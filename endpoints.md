# Backend Endpoints Documentation

## Customers
- **GET /customers** - List all customers (index)
- **GET /customers/:id** - Show customer details
- **GET /customers/avatar/:id** - Show customer avatar
- **POST /customers** - Create new customer
- **PUT /customers/:id** - Update customer
- **DELETE /customers/:id** - Delete customer

## Products
- **GET /products** - List all products (index)
- **GET /products/:id** - Show product details
- **GET /products/customerId/:id** - Show products by customer ID
- **POST /products/myProducts** - Get current user's products (auth required)
- **POST /products** - Create new product
- **PUT /products/:id** - Update product
- **DELETE /products/:id** - Delete product
- **POST /products/photos/:id** - Upload photos to product

## Users
- **GET /users** - List all users (auth required)
- **GET /users/:id** - Show user details
- **POST /users** - Create new user
- **PUT /users/:id** - Update user
- **DELETE /users/:id** - Delete user
- **PATCH /users/avatar** - Update user avatar (file upload required)

## Sessions
- **POST /sessions** - Create new session (login)

## Password
- **POST /password** - Reset password

## Profile
- **GET /profile** - Show current user profile (auth required)

## Reviews
- **GET /reviews** - List all reviews (index)
- **GET /reviews/:id** - Show review details
- **POST /reviews** - Create new review
- **PUT /reviews/:id** - Update review
- **DELETE /reviews/:id** - Delete review

## Orders
- **GET /orders** - List all orders (auth required)
- **POST /orders** - Create new order
- **GET /orders/:id** - Show order details
- **DELETE /orders/:id** - Delete order

## Root Endpoint
- **GET /** - Health check endpoint