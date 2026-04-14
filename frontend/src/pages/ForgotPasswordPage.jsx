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
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Key, Lock, Eye, EyeOff, CheckCircle2, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendForgotPasswordEmail, resetPassword } from '@/lib/api';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Token & Password
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please provide your email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await sendForgotPasswordEmail(email);
      toast({
        title: 'Email Sent!',
        description: "We've sent a recovery code to your email.",
      });
      setStep(2);
    } catch (error) {
      toast({
        title: 'Error Sending Email',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token || !password || !passwordConfirmation) {
      toast({
        title: 'Incomplete Data',
        description: 'Please fill in the code and your new password.',
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
        title: 'Password Reset!',
        description: 'Your password has been successfully changed.',
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast({
        title: 'Error Resetting',
        description: error.message || 'Invalid or expired code.',
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
        >
          <Card className="w-full max-w-md glassmorphism text-center py-8">
            <CardHeader Gall="space-y-4">
              <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />
              <CardTitle className="text-3xl font-bold">Success!</CardTitle>
              <CardDescription className="text-lg">
                Your password has been successfully reset. Redirecting to login...
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full h-12 text-lg">
                <Link to="/login">Go to Login</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md glassmorphism overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardHeader className="space-y-1 text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Mail className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
                <CardDescription>
                  Enter your email to receive a recovery code
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSendEmail}>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 h-11 border-primary/20 focus:border-primary"
                      autoComplete="email"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 mt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 group"
                  >
                    {isLoading ? 'Sending...' : (
                      <>
                        Send Code
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <Link
                    to="/login"
                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </CardFooter>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardHeader className="space-y-1 text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Key className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>
                  Enter the code sent to <span className="font-semibold text-primary">{email}</span>
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleResetPassword}>
                <CardContent className="space-y-4">
                  {/* Token Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="token" className="flex justify-between items-center">
                      Recovery Code
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[10px] text-primary hover:underline font-normal"
                      >
                        Change email?
                      </button>
                    </Label>
                    <div className="relative">
                      <Input
                        id="token"
                        type="text"
                        placeholder="Paste code from email"
                        required
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="bg-background/50 h-11 pl-10 border-primary/20 focus:border-primary"
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
                        className="bg-background/50 h-11 pl-10 pr-10 border-primary/20 focus:border-primary"
                        autoComplete="new-password"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                        className="bg-background/50 h-11 pl-10 border-primary/20 focus:border-primary"
                        autoComplete="new-password"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 mt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90"
                  >
                    {isLoading ? 'Resetting...' : 'Change Password'}
                  </Button>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setStep(1)}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Email
                  </button>
                </CardFooter>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
