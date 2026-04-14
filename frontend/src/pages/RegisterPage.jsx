import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createUser, createCustomer, uploadUserAvatar } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Registration Failed',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Registration Failed',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create user
      const user = await createUser({ name, email, password });

      // Step 2: Upload avatar if provided
      if (avatarFile && user.id) {
        try {
          const avatarFormData = new FormData();
          avatarFormData.append('avatar', avatarFile);
          await uploadUserAvatar(avatarFormData);
        } catch (avatarError) {
          console.warn('Avatar upload failed, continuing anyway:', avatarError);
        }
      }

      // Step 3: Auto-create customer record for seller profile
      try {
        await createCustomer({
          name,
          email,
          shop_name: '',
          location: '',
          bio: '',
          rating: 0,
          reviews_count: 0,
        });
      } catch (customerError) {
        console.warn('Customer auto-creation failed, user can create later:', customerError);
      }

      toast({
        title: 'Account created successfully!',
        description: 'Log in to continue.',
      });

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAvatarFile(null);
      setAvatarPreview(null);
      navigate('/login');
    } catch (error) {
      let description = error.message || 'An error occurred. Please try again.';

      if (description.includes('already') || description.includes('already used')) {
        description = 'This email is already in use. Try another.';
      } else if (description.includes('name')) {
        description = 'This username is already in use. Try another.';
      }

      toast({
        title: 'Registration Failed',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-sm glassmorphism">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Fill in your details to register on Sugarbay Market
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="grid gap-4">
              {/* Avatar */}
              <div className="grid gap-2">
                <Label htmlFor="register-avatar">Profile Picture (Optional)</Label>
                <div className="flex flex-col items-center gap-4">
                   <div className="relative">
                     <Avatar className="h-20 w-20">
                       <AvatarImage src={avatarPreview} alt="Preview Avatar" className="object-cover" />
                       <AvatarFallback className="bg-primary/20 text-primary">
                         <UserPlus className="h-8 w-8" />
                       </AvatarFallback>
                     </Avatar>
                     <Label 
                       htmlFor="register-avatar" 
                       className="absolute -bottom-2 -right-2 cursor-pointer p-2 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors"
                     >
                       <Upload className="h-4 w-4" />
                       <input 
                         id="register-avatar" 
                         type="file" 
                         accept="image/*" 
                         onChange={handleAvatarChange} 
                         className="sr-only" 
                       />
                     </Label>
                   </div>
                   {avatarFile && <span className="text-sm text-muted-foreground">{avatarFile.name}</span>}
                </div>
              </div>

              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="register-name">Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/70"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/70"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/70 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="register-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background/70 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirm ? 'Hide confirmation' : 'Show confirmation'}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                id="register-submit"
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="underline text-primary hover:text-primary/80"
                >
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;