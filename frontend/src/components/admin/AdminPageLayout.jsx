
    import React from 'react';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { motion } from 'framer-motion';

    const AdminPageLayout = ({ title, tabsConfig, defaultTab, children }) => {
      const [activeTab, setActiveTab] = React.useState(defaultTab);

      return (
        <div className="container mx-auto px-4 py-12 flex-grow">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8"
          >
            {title}
          </motion.h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-${tabsConfig.length} mb-6`}>
              {tabsConfig.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.icon && <tab.icon className="mr-2 h-4 w-4 inline-block"/>}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {children}
          </Tabs>
        </div>
      );
    };

    export default AdminPageLayout;
  