    import React, { useState } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { motion } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";
    import { useAuth } from '@/context/AuthContext';
    import { updateProfile } from '@/lib/api';

    const PasswordSettingsTab = () => {
      const { toast } = useToast();
      const { user } = useAuth();
      const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
      const [isLoading, setIsLoading] = useState(false);

      const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
      };

      const handlePasswordSave = async (e) => {
        e.preventDefault();

        if (password.new !== password.confirm) {
          toast({ title: "Passwords Mismatch", description: "The new password and confirmation must match.", variant: "destructive" });
          return;
        }

        if (password.new.length < 6) {
          toast({ title: "Password too short", description: "The password must be at least 6 characters long.", variant: "destructive" });
          return;
        }

        if (!password.current || !password.new) {
            toast({ title: "Required Fields", description: "Please fill in all fields.", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
          await updateProfile({
            name: user.name,
            email: user.email,
            old_password: password.current,
            password: password.new,
            password_confirmation: password.confirm
          });

          toast({ title: "Password Changed", description: "Your password has been successfully updated." });
          setPassword({ current: '', new: '', confirm: '' });
        } catch (error) {
          toast({ 
            title: "Error Changing Password", 
            description: error.message || "Incorrect current password or server error.", 
            variant: "destructive" 
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md mx-auto">
                <div className="grid gap-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" name="current" type="password" value={password.current} onChange={handlePasswordChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" name="new" type="password" value={password.new} onChange={handlePasswordChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" name="confirm" type="password" value={password.confirm} onChange={handlePasswordChange} required />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default PasswordSettingsTab;