
    import React, { useEffect } from 'react';
    import { useLocation, useNavigate, Outlet } from 'react-router-dom';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { List, BarChart2, Settings, ShoppingBag, DollarSign } from 'lucide-react';
    import { motion } from 'framer-motion';

    import SellerProductsTab from '@/components/seller/tabs/SellerProductsTab';
    import SellerOrdersTab from '@/components/seller/SellerOrdersTab';
    import SellerAnalyticsTab from '@/components/seller/tabs/SellerAnalyticsTab';
    import SellerSettingsTab from '@/components/seller/tabs/SellerSettingsTab';
    import SellerPayoutsTab from '@/components/seller/tabs/SellerPayoutsTab';

    const tabComponents = {
      products: SellerProductsTab,
      orders: SellerOrdersTab,
      analytics: SellerAnalyticsTab,
      payouts: SellerPayoutsTab,
      settings: SellerSettingsTab,
    };

    const SellerDashboardPage = () => {
      const location = useLocation();
      const navigate = useNavigate();
      const queryParams = new URLSearchParams(location.search);
      const initialTab = queryParams.get('tab') || "products";

      const [activeTab, setActiveTab] = React.useState(initialTab);

      useEffect(() => {
        const currentTabInQuery = queryParams.get('tab');
        if (currentTabInQuery && currentTabInQuery !== activeTab && tabComponents[currentTabInQuery]) {
          setActiveTab(currentTabInQuery);
        } else if (!currentTabInQuery && activeTab !== "products") {
          navigate(`/dashboard?tab=products`, { replace: true });
        } else if (currentTabInQuery && !tabComponents[currentTabInQuery]) {
           navigate(`/dashboard?tab=products`, { replace: true });
        }
      }, [location.search, activeTab, navigate]);

      const handleTabChange = (value) => {
        setActiveTab(value);
        navigate(`/dashboard?tab=${value}`, { replace: true });
      };
      
      const CurrentTabComponent = tabComponents[activeTab] || SellerProductsTab;


      return (
        <div className="container mx-auto px-4 py-12 flex-grow">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8"
          >
            Seller Dashboard
          </motion.h1>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
              <TabsTrigger value="products"><List className="mr-2 h-4 w-4 inline-block"/> Products</TabsTrigger>
              <TabsTrigger value="orders"><ShoppingBag className="mr-2 h-4 w-4 inline-block"/> Orders</TabsTrigger>
              <TabsTrigger value="analytics"><BarChart2 className="mr-2 h-4 w-4 inline-block"/> Analytics</TabsTrigger>
              <TabsTrigger value="payouts"><DollarSign className="mr-2 h-4 w-4 inline-block"/> Payouts</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4 inline-block"/> Settings</TabsTrigger>
            </TabsList>
            
            <CurrentTabComponent />

          </Tabs>
        </div>
      );
    };

    export default SellerDashboardPage;
  