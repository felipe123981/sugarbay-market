
    import React from 'react';
    import { TabsContent } from "@/components/ui/tabs";
    import { Users, Settings, Bitcoin, Warehouse, BarChart3 } from 'lucide-react';
    
    import AdminPageLayout from '@/components/admin/AdminPageLayout';
    import AdminAnalyticsTab from '@/components/admin/tabs/AdminAnalyticsTab';
    import WalletManagementTab from '@/components/admin/tabs/WalletManagementTab';
    import UserManagementTab from '@/components/admin/tabs/UserManagementTab';
    import DistributionCenterManagementTab from '@/components/admin/tabs/DistributionCenterManagementTab';
    import PlatformSettingsTab from '@/components/admin/tabs/PlatformSettingsTab';

    const adminTabsConfig = [
      { value: "analytics", label: "Analytics", icon: BarChart3, component: AdminAnalyticsTab },
      { value: "wallets", label: "Commission Wallets", icon: Bitcoin, component: WalletManagementTab },
      { value: "users", label: "User Management", icon: Users, component: UserManagementTab },
      { value: "distribution", label: "Distribution Centers", icon: Warehouse, component: DistributionCenterManagementTab },
      { value: "settings", label: "Platform Settings", icon: Settings, component: PlatformSettingsTab },
    ];

    const AdminPage = () => {
      return (
        <AdminPageLayout
          title="Admin Panel"
          tabsConfig={adminTabsConfig}
          defaultTab="analytics"
        >
          {adminTabsConfig.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <tab.component />
            </TabsContent>
          ))}
        </AdminPageLayout>
      );
    };

    export default AdminPage;
  