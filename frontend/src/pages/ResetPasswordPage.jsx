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
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, Key, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { resetPassword } from '@/lib/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extract token from query params and set as state
  const query = new URLSearchParams(location.search);
  const [token, setToken] = useState(query.get('token') || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: 'Token Required',
        description: 'Please provide the recovery token sent to your email.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== passwordConfirmation) {
      toast({
        title: 'Passwords do not match',
        description: 'The new password and confirmation must match.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
        toast({
            title: 'Password too short',
            description: 'The password must be at least 6 characters long.',
            variant: 'destructive',
        });
        return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setIsSuccess(true);
      toast({
        title: 'Password Changed!',
        description: 'Your password has been successfully reset.',
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast({
        title: 'Error Resetting Password',
        description: error.message || 'An error occurred. The token may be incorrect or expired.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-sm glassmorphism text-center">
            <CardHeader Gall="space-y-4">
              <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 mb-4" />
              <CardTitle className="text-2xl font-bold">Success!</CardTitle>
              <CardDescription>
                Your password has been successfully changed. You will be redirected to login shortly.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              <Lock className="mx-auto h-12 w-12 text-primary mb-4" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter the recovery token and your new password
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              {/* Token Field */}
              <div className="grid gap-2">
                <Label htmlFor="token">Recovery Token</Label>
                <div className="relative">
                  <Input
                    id="token"
                    type="text"
                    placeholder="Paste token from email"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="bg-background/70 pl-10"
                    autoComplete="off"
                  />
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/70 pr-10 pl-10"
                    autoComplete="new-password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="bg-background/70 pl-10"
                    autoComplete="new-password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                {isLoading ? 'Resetting...' : 'Change Password'}
              </Button>

              <Link
                to="/forgot-password"
                className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Need another token?
              </Link>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
