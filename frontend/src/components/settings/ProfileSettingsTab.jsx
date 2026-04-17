import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { updateProfile, uploadUserAvatar, getProfile } from '@/lib/api';

const ProfileSettingsTab = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [profile, setProfile] = useState({ 
    name: '', 
    email: '',
    recipient_name: '',
    country: '',
    zipcode: '',
    state: '',
    city: '',
    address: '',
    complement: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const freshUser = await getProfile();
        updateUser(freshUser);
        setProfile({
          name: freshUser.name || '',
          email: freshUser.email || '',
          recipient_name: freshUser.recipient_name || '',
          country: freshUser.country || '',
          zipcode: freshUser.zipcode || '',
          state: freshUser.state || '',
          city: freshUser.city || '',
          address: freshUser.address || '',
          complement: freshUser.complement || '',
        });
        setAvatarPreview(freshUser.avatar_url || null);
      } catch (error) {
        // Error handling is done via toast notifications
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = await updateProfile({
        name: profile.name,
        email: profile.email,
        recipient_name: profile.recipient_name,
        country: profile.country,
        zipcode: profile.zipcode,
        state: profile.state,
        city: profile.city,
        address: profile.address,
        complement: profile.complement,
      });
      updateUser(updatedUser);

      if (avatarFile) {
        try {
          const avatarFormData = new FormData();
          avatarFormData.append('avatar', avatarFile);
          await uploadUserAvatar(avatarFormData);
          const freshUser = await getProfile();
          updateUser(freshUser);
          setAvatarPreview(freshUser.avatar_url || null);
          setAvatarFile(null);
          toast({ title: "Avatar Updated", description: "Your avatar has been successfully uploaded." });
        } catch (avatarError) {
          toast({
            title: "Avatar Upload Failed",
            description: avatarError.message || "Could not upload avatar.",
            variant: "destructive"
          });
        }
      }

      toast({ title: "Profile Updated", description: "Your profile information has been successfully saved." });
    } catch (error) {
      toast({ title: "Save Failed", description: error.message || "Could not save profile.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Card className="glassmorphism">
        <CardContent className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Manage your account and delivery information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveAll} className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview} alt="User Avatar" />
                  <AvatarFallback>{profile.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <Label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 cursor-pointer p-2 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors">
                  <Upload className="h-4 w-4" />
                  <Input id="avatar-upload" type="file" className="sr-only" onChange={handleAvatarChange} accept="image/*"/>
                </Label>
              </div>
              <div className="flex-1 w-full grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={profile.name} onChange={handleProfileChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={profile.email} onChange={handleProfileChange} required />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Delivery Information</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="recipient_name">Recipient Name</Label>
                  <Input id="recipient_name" name="recipient_name" value={profile.recipient_name} onChange={handleProfileChange} placeholder="e.g., John Doe" />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={profile.address} onChange={handleProfileChange} placeholder="e.g., 123 Main St, Apt 4B" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="complement">Complement</Label>
                  <Input id="complement" name="complement" value={profile.complement} onChange={handleProfileChange} placeholder="e.g., Apt 4B, Floor 2" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={profile.city} onChange={handleProfileChange} placeholder="e.g., New York" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State / Province</Label>
                  <Input id="state" name="state" value={profile.state} onChange={handleProfileChange} placeholder="e.g., NY" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zipcode">Zip / Postal Code</Label>
                  <Input id="zipcode" name="zipcode" value={profile.zipcode} onChange={handleProfileChange} placeholder="e.g., 10001" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" value={profile.country} onChange={handleProfileChange} placeholder="e.g., United States" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                 {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileSettingsTab;
