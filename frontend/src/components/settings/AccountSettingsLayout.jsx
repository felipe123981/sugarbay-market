
    import React from 'react';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { motion } from 'framer-motion';
    import { useLocation, useNavigate } from 'react-router-dom';

    const AccountSettingsLayout = ({ title, tabsConfig, defaultTab }) => {
      const location = useLocation();
      const navigate = useNavigate();
      const queryParams = new URLSearchParams(location.search);
      const initialTab = queryParams.get('tab') || defaultTab;

      const [activeTab, setActiveTab] = React.useState(
        tabsConfig.find(tab => tab.value === initialTab) ? initialTab : defaultTab
      );

      React.useEffect(() => {
        const currentTabInQuery = queryParams.get('tab');
        if (currentTabInQuery && currentTabInQuery !== activeTab && tabsConfig.find(tab => tab.value === currentTabInQuery)) {
          setActiveTab(currentTabInQuery);
        } else if (!currentTabInQuery && activeTab !== defaultTab) {
           navigate(`${location.pathname}?tab=${defaultTab}`, { replace: true });
        } else if (currentTabInQuery && !tabsConfig.find(tab => tab.value === currentTabInQuery)) {
           navigate(`${location.pathname}?tab=${defaultTab}`, { replace: true });
        }
      }, [location.search, activeTab, navigate, location.pathname, defaultTab, tabsConfig]);

      const handleTabChange = (value) => {
        setActiveTab(value);
        navigate(`${location.pathname}?tab=${value}`, { replace: true });
      };

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

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
              {tabsConfig.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.icon && <tab.icon className="mr-2 h-4 w-4 inline-block"/>}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabsConfig.map(tab => (
              <TabsContent key={tab.value} value={tab.value}>
                <tab.component />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      );
    };

    export default AccountSettingsLayout;
  