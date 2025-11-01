"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required.",
        variant: "destructive",
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Validation Error",
        description: "Password is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const success = await login(email.trim(), password);

      if (success) {
        toast({
          title: "Login Successful!",
          description: `Welcome back!`,
        });

        // Redirect to dashboard (role detection will be handled by the dashboard)
        router.push('/worker-dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: 'Invalid email or password. Please try again.',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      toast({
        title: "Login Failed",
        description: err?.error?.message || 'Invalid email or password. Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 text-gray-700 hover:bg-white hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg">Welcome back! Sign in to continue</p>
        </div>

        {/* Login Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
              <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-[#20A277] hover:text-[#1a8a63]">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="h-11 border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                />
              </div>

              <Button 
                onClick={handleLogin} 
                className="w-full h-11 text-base font-semibold bg-[#20A277] hover:bg-[#1a8a63] text-white"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    New to PayTask?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link href="/signup">
                  <Button variant="outline" className="w-full h-11 font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    Create an Account
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <p className="text-center text-xs text-gray-500 mt-8">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-[#20A277] hover:text-[#1a8a63]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#20A277] hover:text-[#1a8a63]">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}