
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { ShoppingBag, Users, ArrowRight } from 'lucide-react';

    const HomePage = () => {
      return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
              Welcome to Sugarbay Market
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The platform where you can buy and sell unique products directly from other users around the globe.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link to="/products">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                <ShoppingBag className="mr-2 h-5 w-5" /> Explore Products
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Users className="mr-2 h-5 w-5" /> Become a Seller
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="p-6 rounded-lg border bg-card shadow-md glassmorphism"
            >
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Global Reach</h3>
              <p className="text-muted-foreground">Connect with buyers and sellers internationally.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="p-6 rounded-lg border bg-card shadow-md glassmorphism"
            >
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Secure Transactions</h3>
              <p className="text-muted-foreground">Multiple payment options including Crypto & Fiat.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="p-6 rounded-lg border bg-card shadow-md glassmorphism"
            >
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Manage Your Shop</h3>
              <p className="text-muted-foreground">Easy tools to list products and track earnings.</p>
            </motion.div>
          </div>

           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.2, duration: 0.5 }}
             className="mt-16"
           >
             <Link to="/products">
                <Button variant="link" className="text-lg text-primary hover:underline">
                  Start Shopping Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
           </motion.div>
        </div>
      );
    };

    export default HomePage;
  