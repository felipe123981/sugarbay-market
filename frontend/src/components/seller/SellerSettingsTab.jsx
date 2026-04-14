import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateCustomer, createCustomer, uploadUserAvatar, listCustomers, getProfile } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const SellerSettingsTab = () => {
  const { user, updateUser, updateCustomer: updateCustomerCtx } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [shopData, setShopData] = useState({
    shopName: '',
    location: '',
    bio: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [localCustomer, setLocalCustomer] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchCustomer = async () => {
      setIsFetching(true);
      try {
        const response = await listCustomers();
        const customerList = response?.data || response || [];
        const found = customerList.find(c => c.email === user.email);

        if (found) {
          setLocalCustomer(found);
          setShopData({
            shopName: found.shop_name || '',
            location: found.location || '',
            bio: found.bio || '',
          });
          updateCustomerCtx(found);
        } else {
          const newCustomer = await createCustomer({
            name: user.name,
            email: user.email,
            shop_name: '',
            location: '',
            bio: '',
            rating: 0,
            reviews_count: 0,
          });
          setLocalCustomer(newCustomer);
          updateCustomerCtx(newCustomer);
        }
      } catch (error) {
        console.error('Failed to fetch/create customer:', error);
        toast({
          title: "Error",
          description: "Could not load seller profile.",
          variant: "destructive"
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchCustomer();
  }, [user]);

  useEffect(() => {
    if (user?.avatar_url) {
      setAvatarPreview(user.avatar_url);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShopData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let currentCustomer = localCustomer;

      if (!currentCustomer) {
        const response = await listCustomers();
        const customerList = response?.data || response || [];
        currentCustomer = customerList.find(c => c.email === user.email);

        if (!currentCustomer) {
          currentCustomer = await createCustomer({
            name: user.name,
            email: user.email,
            shop_name: shopData.shopName,
            location: shopData.location,
            bio: shopData.bio,
            rating: 0,
            reviews_count: 0,
          });
        }
        setLocalCustomer(currentCustomer);
      }

      const updatedCustomer = await updateCustomer(currentCustomer.id, {
        name: user.name,
        email: user.email,
        shop_name: shopData.shopName,
        location: shopData.location,
        bio: shopData.bio,
      });
      setLocalCustomer(updatedCustomer);
      updateCustomerCtx(updatedCustomer);

      if (avatarFile) {
        try {
          const avatarFormData = new FormData();
          avatarFormData.append('avatar', avatarFile);
          await uploadUserAvatar(avatarFormData);
          const freshUser = await getProfile();
          updateUser(freshUser);
          setAvatarPreview(freshUser.avatar_url || null);
          setAvatarFile(null);
        } catch (avatarError) {
          console.warn('Avatar upload failed:', avatarError);
        }
      }

      toast({
        title: "Settings Saved",
        description: "Your shop settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings.",
        variant: "destructive"
      });
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
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Seller Settings</CardTitle>
          <CardDescription>Manage your public shop profile, location and other preferences.</CardDescription>
        </div>
        {localCustomer && (
          <Link to={`/seller/${localCustomer.id}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Profile
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} alt="Seller Avatar" />
                <AvatarFallback>{shopData.shopName?.substring(0, 2).toUpperCase() || user?.name?.substring(0, 2).toUpperCase() || 'S'}</AvatarFallback>
              </Avatar>
              <Label htmlFor="seller-avatar-upload" className="absolute -bottom-2 -right-2 cursor-pointer p-2 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors">
                <Upload className="h-4 w-4" />
                <Input id="seller-avatar-upload" type="file" className="sr-only" onChange={handleAvatarChange} accept="image/*" />
              </Label>
            </div>
            <div>
              <p className="text-sm font-medium">Shop Avatar</p>
              <p className="text-xs text-muted-foreground">This will be displayed on your public seller profile.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input
              id="shopName"
              name="shopName"
              value={shopData.shopName}
              onChange={handleInputChange}
              placeholder="e.g., My Awesome Shop"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Shop Description / Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell customers about your shop..."
              value={shopData.bio}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Public Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., New York, USA"
              value={shopData.location}
              onChange={handleInputChange}
            />
          </div>
          <div className="border-t pt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SellerSettingsTab;
