"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2, Mail, Lock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        // Mock successful login
        const userData = {
          id: `user_${Date.now()}`,
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          email: email,
          phone: "+254712345678",
          avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=random`,
          isAdmin: isAdmin,
          kycStatus: isAdmin ? ("approved" as const) : (null as const),
        };

        login(userData);
        
        // Redirect based on role
        if (isAdmin) {
          router.push("/owner/dashboard");
        } else {
          router.push("/");
        }
      } else {
        setError("Please fill in all fields");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Quick login function for demo
  const quickLogin = (role: "user" | "admin") => {
    setIsLoading(true);
    setTimeout(() => {
      const userData = {
        id: `${role}_${Date.now()}`,
        name: role === "admin" ? "Admin User" : "John Mwangi",
        email: role === "admin" ? "admin@vehiclerent.ke" : "user@example.com",
        phone: "+254712345678",
        avatar: `https://ui-avatars.com/api/?name=${role === "admin" ? "Admin" : "John"}&background=random`,
        isAdmin: role === "admin",
        kycStatus: role === "admin" ? ("approved" as const) : (null as const),
      };

      login(userData);
      
      if (role === "admin") {
        router.push("/owner/dashboard");
      } else {
        router.push("/");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-white py-12 px-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <Badge className="mb-4 mx-auto bg-primary/10 text-primary hover:bg-primary/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Mock Authentication
          </Badge>
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Login Buttons for Demo */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-center text-muted-foreground">
              Quick Demo Login
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => quickLogin("user")}
                disabled={isLoading}
                className="h-auto py-4 flex-col gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <span className="text-sm font-semibold">Login as User</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => quickLogin("admin")}
                disabled={isLoading}
                className="h-auto py-4 flex-col gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-lg">👨‍💼</span>
                </div>
                <span className="text-sm font-semibold">Login as Admin</span>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg border border-accent/20">
              <input
                type="checkbox"
                id="admin-toggle"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="admin-toggle" className="text-sm cursor-pointer mb-0 font-normal">
                Login as Admin/Owner
              </Label>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 bg-gradient-accent hover:opacity-90" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
