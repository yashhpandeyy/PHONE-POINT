
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { account } from '@/lib/appwrite';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AppwriteException } from 'appwrite';
import { useAuth } from '@/context/auth-context';

import { Suspense } from 'react';

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (isLogin) {
        await account.createEmailPasswordSession(email, password);

        toast({
          title: 'Login Successful',
          description: 'Redirecting...',
        });

      } else {
        // This is the registration flow
        const name = formData.get('name') as string;
        await account.create('unique()', email, password, name);

        // Log the new user in immediately
        await account.createEmailPasswordSession(email, password);

        toast({
          title: 'Account Created',
          description: 'Welcome! You are now logged in.',
        });
      }

      await refetchUser();

      const redirectTo = searchParams.get('redirect_to');
      if (redirectTo) {
        router.replace(redirectTo);
        return;
      }

      // After login or registration, get user and redirect based on role
      const user = await account.get();
      const userLabels = user.labels || [];

      if (userLabels.includes('admin') || userLabels.includes('developer')) {
        router.replace('/accessories');
      } else {
        router.replace('/home');
      }

    } catch (err: any) {
      console.error("❌ Appwrite/Login Error:", err);
      let title = 'Error';
      let description = 'An unknown error occurred. Please try again.';

      if (err instanceof AppwriteException) {
        // This handles specific Appwrite errors like "Invalid credentials"
        title = 'Login Failed';
        description = err.message;
      } else if (err.message && err.message.includes('Failed to fetch')) {
        // This specifically catches the network/CORS error
        title = 'Connection Failed';
        description = 'Could not connect to Appwrite. This is a network or configuration issue. Please ensure your Appwrite server is running, the endpoint in your app is correct, and that `localhost` has been added as a platform in your Appwrite project settings.';
      }

      toast({
        title: title,
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} key={isLogin ? 'login' : 'register'}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access your account."
                : "Fill in the details below to create your new account."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <Button
                type="button"
                variant="link"
                className="pl-2"
                onClick={() => setIsLogin(!isLogin)}
                disabled={isLoading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
