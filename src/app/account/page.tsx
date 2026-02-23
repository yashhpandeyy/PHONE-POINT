
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, LogOut, Loader2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";

export default function AccountPage() {
  const { user, isLoading, refetchUser } = useAuth();
  const [createdDate, setCreatedDate] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setCreatedDate(new Date(user.$createdAt).toLocaleDateString());
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      await refetchUser();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to log out.",
        variant: "destructive",
      });
    }
  };
  
  // Get user role from labels array
  const getUserRole = (labels: string[]): string => {
    if (labels.includes('developer')) return 'developer';
    if (labels.includes('admin')) return 'admin';
    return 'user';
  }
  const userRole = user ? getUserRole(user.labels) : 'user';

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center">My Account</h1>
      {user ? (
        <div className="mt-12 max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.name || 'User'}</CardTitle>
              <CardDescription>View your account details below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Account Created</span>
                <span className="font-medium">{createdDate}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Role</span>
                <Badge variant={userRole === 'admin' || userRole === 'developer' ? 'destructive' : 'secondary'} className="capitalize">
                  <Shield className="mr-1 h-3 w-3"/>
                  {userRole}
                </Badge>
              </div>
              <Button onClick={handleLogout} variant="destructive" className="w-full mt-4">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed rounded-lg">
          <User className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground mt-4">Please log in to see your account details.</p>
          <Button asChild className="mt-6">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
