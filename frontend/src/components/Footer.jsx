
    import React from 'react';
    import { motion } from 'framer-motion';

    const Footer = () => {
      const currentYear = new Date().getFullYear();

      return (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t mt-12 py-6"
        >
          <div className="container text-center text-sm text-muted-foreground">
            © {currentYear} Sugarbay Market. All rights reserved. Built with Hostinger Horizons.
          </div>
        </motion.footer>
      );
    };

    export default Footer;
  