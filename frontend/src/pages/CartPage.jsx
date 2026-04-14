
     import React from 'react';
     import { Link } from 'react-router-dom';
     import { Button } from "@/components/ui/button";
     import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
     import { Input } from "@/components/ui/input";
     import { Separator } from "@/components/ui/separator";
     import { Trash2, ShoppingBag, Minus, Plus, ArrowLeft } from 'lucide-react';
     import { motion } from 'framer-motion';
     import { useCart } from '@/hooks/useCart';
     import { getProductImage } from '@/lib/utils';

     const CartPage = () => {
       const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

       return (
         <div className="container mx-auto px-4 py-12">
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="mb-8"
           >
              <Link to="/products" className="inline-block mb-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                </Button>
              </Link>
             <h1 className="text-3xl font-bold">Shopping Cart</h1>
             <p className="text-muted-foreground">You have {cartCount} item(s) in your cart.</p>
           </motion.div>

           {cartItems.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
               <Card className="text-center py-12 glassmorphism">
                  <CardHeader>
                     <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                     <CardTitle>Your Cart is Empty</CardTitle>
                     <CardDescription>Looks like you haven't added anything to your cart yet.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Link to="/products">
                       <Button>Browse Products</Button>
                     </Link>
                  </CardContent>
               </Card>
             </motion.div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-4">
                 {cartItems.map((item, index) => (
                   <motion.div
                     key={item.id}
                     initial={{ opacity: 0, x: -30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 0.1 }}
                   >
                     <Card className="flex flex-col sm:flex-row items-center p-4 glassmorphism">
                       <img 
                         className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
                         alt={item.name}
                         src={getProductImage(item)} />
                       <div className="flex-1 text-center sm:text-left">
                         <h3 className="font-semibold">{item.name}</h3>
                         <p className="text-sm text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Seller: {item.seller || 'N/A'}</p>
                       </div>
                       <div className="flex items-center mt-4 sm:mt-0 sm:ml-4 space-x-2">
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                           <Minus className="h-4 w-4" />
                         </Button>
                          <Input
                           type="number"
                           min="1"
                           value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                           className="h-8 w-14 text-center"
                         />
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                           <Plus className="h-4 w-4" />
                         </Button>
                       </div>
                       <div className="font-semibold mt-4 sm:mt-0 sm:ml-6 sm:w-20 text-center">${(item.price * item.quantity).toFixed(2)}</div>
                        <Button variant="ghost" size="icon" className="mt-4 sm:mt-0 sm:ml-2 text-destructive hover:text-destructive/80" onClick={() => removeFromCart(item.id)}>
                         <Trash2 className="h-5 w-5" />
                       </Button>
                     </Card>
                   </motion.div>
                 ))}
                  <div className="flex justify-end mt-4">
                     <Button variant="outline" onClick={clearCart} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                       <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
                     </Button>
                   </div>
               </div>

               <div className="lg:col-span-1">
                 <Card className="sticky top-24 glassmorphism">
                   <CardHeader>
                     <CardTitle>Cart Summary</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-3">
                     <div className="flex justify-between">
                       <span>Subtotal ({cartCount} items)</span>
                       <span>${cartTotal.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-sm text-muted-foreground">
                       <span>Estimated Shipping</span>
                       <span>Calculated at checkout</span>
                     </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                       <span>Estimated Tax</span>
                       <span>Calculated at checkout</span>
                     </div>
                     <Separator />
                     <div className="flex justify-between font-semibold text-lg">
                       <span>Estimated Total</span>
                       <span>${cartTotal.toFixed(2)}</span>
                     </div>
                   </CardContent>
                   <CardFooter>
                     <Link to="/checkout" className="w-full">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                          Proceed to Checkout
                        </Button>
                     </Link>
                   </CardFooter>
                 </Card>
               </div>
             </div>
           )}
         </div>
       );
     };

     export default CartPage;
  