/**
 * Centralized API client for Sugarbay backend.
 * All requests go through /api proxy (configured in vite.config.js)
 * which forwards to http://localhost:3333.
 *
 * For production/tunnel deployment, set VITE_API_BASE_URL to your backend URL
 * (e.g., https://your-tunnel.trycloudflare.com)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Core fetch wrapper that attaches JWT token and handles error responses.
 */
async function request(path, options = {}) {
  const token = localStorage.getItem('@sugarbay:token');

  const isFormData = options.body instanceof FormData;
  const headers = {
    // Don't set Content-Type for FormData - browser will set it automatically with boundary
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...((token && token !== 'null') ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };


  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Parse JSON regardless of status so we can read error messages
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message || data?.status || `HTTP error ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ─── Users ───────────────────────────────────────────────────────────────────

/**
 * POST /users — Create a new user account.
 * @param {{ name: string, email: string, password: string }} payload
 */
export async function createUser(payload) {
  const isFormData = payload instanceof FormData;
  return request('/users', {
    method: 'POST',
    body: isFormData ? payload : JSON.stringify(payload),
  });
}

/**
 * GET /users — List all users (requires auth).
 */
export async function listUsers() {
  return request('/users');
}

/**
 * GET /users/:id — Get a single user.
 */
export async function getUser(id) {
  return request(`/users/${id}`);
}

/**
 * PUT /users/:id — Update a user.
 */
export async function updateUser(id, payload) {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * DELETE /users/:id — Delete a user.
 */
export async function deleteUser(id) {
  return request(`/users/${id}`, { method: 'DELETE' });
}

// ─── Sessions (Auth) ──────────────────────────────────────────────────────────

/**
 * POST /sessions — Authenticate and get a JWT token.
 * @param {{ email: string, password: string }} credentials
 * @returns {{ user: object, token: string }}
 */
export async function createSession(credentials) {
  return request('/sessions', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

// ─── Profile ─────────────────────────────────────────────────────────────────

/**
 * GET /profile — Get the currently authenticated user's profile.
 */
export async function getProfile() {
  return request('/profile');
}

/**
 * PUT /profile — Update the authenticated user's profile.
 */
export async function updateProfile(payload) {
  const isFormData = payload instanceof FormData;
  return request('/profile', {
    method: 'PUT',
    body: isFormData ? payload : JSON.stringify(payload),
  });
}
// ─── Password Reset ──────────────────────────────────────────────────────────

/**
 * POST /password/forgot — Send a password reset email.
 * @param {string} email
 */
export async function sendForgotPasswordEmail(email) {
  return request('/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * POST /password/reset — Reset the password using a token.
 * @param {{ token: string, password: string, password_confirmation: string }} payload
 */
export async function resetPassword(payload) {
  return request('/password/reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Customers ───────────────────────────────────────────────────────────────

/**
 * GET /customers — List all customers.
 */
export async function listCustomers() {
  return request('/customers');
}

/**
 * GET /customers/:id — Get a single customer.
 */
export async function getCustomer(id) {
  return request(`/customers/${id}`);
}

/**
 * GET /customers/avatar/:id — Get customer's avatar URL (public).
 */
export async function getCustomerAvatar(id) {
  return request(`/customers/avatar/${id}`);
}

/**
 * POST /customers — Create a new customer (requires auth).
 * @param {{ name: string, email: string, shop_name?: string, location?: string, bio?: string, rating?: number, reviews_count?: number }} payload
 */
export async function createCustomer(payload) {
  return request('/customers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * PUT /customers/:id — Update a customer (requires auth).
 */
export async function updateCustomer(id, payload) {
  return request(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * DELETE /customers/:id — Delete a customer (requires auth).
 */
export async function deleteCustomer(id) {
  return request(`/customers/${id}`, { method: 'DELETE' });
}

/**
 * PATCH /users/avatar — Upload user avatar (requires auth, multipart).
 * @param {FormData} formData - FormData with 'avatar' file field
 */
export async function uploadUserAvatar(formData) {
  return request('/users/avatar', {
    method: 'PATCH',
    body: formData,
  });
}

// ─── Products ────────────────────────────────────────────────────────────────

/**
 * GET /products — List all products.
 */
export async function listProducts() {
  return request('/products');
}

/**
 * GET /products/:id — Get a single product.
 */
export async function getProduct(id) {
  return request(`/products/${id}`);
}

/**
 * POST /products/myProducts — Get current user's products.
 */
export async function getMyProducts() {
  return request('/products/myProducts', { method: 'POST' });
}

/**
 * GET /products/customerId/:id — Get products by customer ID.
 */
export async function getProductsByCustomerId(customerId) {
  return request(`/products/customerId/${customerId}`);
}

/**
 * POST /products — Create a new product.
 */
export async function createProduct(payload) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * PUT /products/:id — Update a product.
 */
export async function updateProduct(id, payload) {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * DELETE /products/:id — Delete a product.
 */
export async function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' });
}

/**
 * POST /products/photos/:id — Upload product photos.
 * @param {string} id 
 * @param {FormData} formData 
 */
export async function uploadProductPhotos(id, formData) {
  return request(`/products/photos/${id}`, {
    method: 'POST',
    body: formData,
  });
}

// ─── Orders ─────────────────────────────────────────────────────────────────────

/**
 * POST /orders — Create a new order.
 * @param {{ products: Array<{id: string, quantity: number}> }} payload
 */
export async function createOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * GET /orders/:id — Get a single order.
 */
export async function getOrder(id) {
  return request(`/orders/${id}`);
}

// ─── Platform Settings ───────────────────────────────────────────────────────

/**
 * GET /platform/settings — Get global platform settings.
 */
export async function getPlatformSettings() {
  return request('/platform/settings');
}

/**
 * PUT /platform/settings — Update global platform settings.
 * @param {{ tax_rate: number, profit_margin: number, packaging_cost: number, shipping_cost: number }} payload
 */
export async function updatePlatformSettings(payload) {
  return request('/platform/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
