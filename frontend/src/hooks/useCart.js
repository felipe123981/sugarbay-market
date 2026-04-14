
    import { useState, useEffect, useCallback, useMemo } from 'react'; // Import useMemo

    const CART_STORAGE_KEY = 'sb-cart';

    const getInitialCart = () => {
      try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        return storedCart ? JSON.parse(storedCart) : [];
      } catch (error) {
        console.error("Error reading cart from localStorage:", error);
        return [];
      }
    };

    export const useCart = () => {
      const [cartItems, setCartItems] = useState(getInitialCart);

      useEffect(() => {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
          console.error("Error saving cart to localStorage:", error);
        }
      }, [cartItems]);

      const addToCart = useCallback((product, quantity = 1) => {
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id);
          if (existingItem) {
            // Update quantity if item already exists
            return prevItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item
            return [...prevItems, { ...product, quantity }];
          }
        });
      }, []);

      const removeFromCart = useCallback((productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      }, []);

      const updateQuantity = useCallback((productId, newQuantity) => {
         const quantity = Math.max(0, newQuantity); // Ensure quantity is not negative
         setCartItems(prevItems => {
            if (quantity === 0) {
              return prevItems.filter(item => item.id !== productId);
            }
            return prevItems.map(item =>
              item.id === productId ? { ...item, quantity } : item
            );
         });
      }, []);

      const clearCart = useCallback(() => {
        setCartItems([]);
      }, []);

      const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      }, [cartItems]);

       const cartCount = useMemo(() => {
         return cartItems.reduce((count, item) => count + item.quantity, 0);
       }, [cartItems]);


      return {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      };
    };
  