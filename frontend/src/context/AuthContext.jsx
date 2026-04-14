import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { createSession, getProfile, listCustomers } from '@/lib/api';

const AuthContext = createContext({});

const USER_STORAGE_KEY = '@sugarbay:user';
const TOKEN_STORAGE_KEY = '@sugarbay:token';
const CUSTOMER_STORAGE_KEY = '@sugarbay:customer';

export function AuthProvider({ children }) {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const user = localStorage.getItem(USER_STORAGE_KEY);
    const customer = localStorage.getItem(CUSTOMER_STORAGE_KEY);

    if (token && user) {
      return { token, user: JSON.parse(user), customer: customer ? JSON.parse(customer) : null };
    }

    return {};
  });
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    if (!data.token) {
      setIsValidating(false);
      return;
    }

    getProfile()
      .then((profileUser) => {
        setData((prev) => ({ ...prev, user: profileUser }));
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profileUser));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(CUSTOMER_STORAGE_KEY);
        setData({});
      })
      .finally(() => {
        setIsValidating(false);
      });
  }, []);

  const findCustomerForUser = useCallback(async (user) => {
    try {
      const customers = await listCustomers();
      const customerList = Array.isArray(customers) ? customers : (customers?.data || []);
      const found = customerList.find(c => c.email === user.email);
      return found || null;
    } catch {
      return null;
    }
  }, []);

  /**
   * signIn — Calls POST /sessions and persists token + user in localStorage.
   * Also looks up the associated customer by email.
   */
  const signIn = useCallback(async ({ email, password }) => {
    const response = await createSession({ email, password });
    const { token, user } = response;

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    const customer = await findCustomerForUser(user);
    if (customer) {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    } else {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    }

    setData({ token, user, customer });
    return user;
  }, [findCustomerForUser]);

  /**
   * signOut — Clears localStorage and resets auth state.
   */
  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    setData({});
  }, []);

  /**
   * updateUser — Updates local user state after profile changes.
   */
  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    setData((prev) => ({ ...prev, user: updatedUser }));
  }, []);

  /**
   * updateCustomer — Updates local customer state after changes.
   */
  const updateCustomer = useCallback((updatedCustomer) => {
    if (updatedCustomer) {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updatedCustomer));
    } else {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    }
    setData((prev) => ({ ...prev, customer: updatedCustomer }));
  }, []);

  /**
   * refreshCustomer — Re-fetches customer data from backend.
   */
  const refreshCustomer = useCallback(async () => {
    if (!data.user) return;
    const customer = await findCustomerForUser(data.user);
    if (customer) {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    } else {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    }
    setData((prev) => ({ ...prev, customer }));
    return customer;
  }, [data.user, findCustomerForUser]);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        customer: data.customer,
        token: data.token,
        isAuthenticated: Boolean(data.token),
        isValidating,
        signIn,
        signOut,
        updateUser,
        updateCustomer,
        refreshCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — Hook to access authentication context anywhere in the app.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
