
    import AccountSettingsLayout from '@/components/settings/AccountSettingsLayout';
    import ProfileSettingsTab from '@/components/settings/ProfileSettingsTab';
    import PasswordSettingsTab from '@/components/settings/PasswordSettingsTab';
    import NotificationsSettingsTab from '@/components/settings/NotificationsSettingsTab';
    import BillingSettingsTab from '@/components/settings/BillingSettingsTab';
    import { User, Lock, Bell, CreditCard } from 'lucide-react';

    const settingsTabsConfig = [
      { value: "profile", label: "Profile", icon: User, component: ProfileSettingsTab },
      { value: "password", label: "Password", icon: Lock, component: PasswordSettingsTab },
      { value: "notifications", label: "Notifications", icon: Bell, component: NotificationsSettingsTab },
      { value: "billing", label: "Billing", icon: CreditCard, component: BillingSettingsTab },
    ];

    const AccountSettingsPage = () => {
      return (
        <AccountSettingsLayout
          title="Account Settings"
          tabsConfig={settingsTabsConfig}
          defaultTab="profile"
        />
      );
    };

    export default AccountSettingsPage;
  