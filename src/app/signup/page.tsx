"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, Briefcase, User, Loader2 } from "lucide-react";
import { authApi } from "@/api";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "worker">("worker");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!username.trim()) {
      toast({
        title: "Validation Error",
        description: "Username is required.",
        variant: "destructive",
      });
      return;
    }

    if (username.trim().length < 3) {
      toast({
        title: "Validation Error",
        description: "Username must be at least 3 characters.",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
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

    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (response.success) {
        toast({
          title: "Account Created!",
          description: `Welcome to PayTask, ${response.data.user.username}!`,
        });

        // Auto redirect based on role
        if (role === 'client') {
          router.push('/client-dashboard');
        } else {
          router.push('/worker-dashboard');
        }
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      toast({
        title: "Signup Failed",
        description: err?.error?.message || 'Failed to create account. Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-primary mb-2">PayTask</h1>
          </Link>
          <p className="text-muted-foreground">Create your account in less than 60 seconds</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Choose how you'd like to sign up</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <Label>I want to:</Label>
              <RadioGroup value={role} onValueChange={(value: string) => setRole(value as "client" | "worker")}>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent/5">
                  <RadioGroupItem value="worker" id="worker" />
                  <Label htmlFor="worker" className="flex items-center cursor-pointer flex-1">
                    <User className="mr-2 h-4 w-4 text-accent" />
                    <div>
                      <div className="font-medium">Work on Tasks</div>
                      <div className="text-xs text-muted-foreground">Earn money by completing micro-tasks</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-primary/5">
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client" className="flex items-center cursor-pointer flex-1">
                    <Briefcase className="mr-2 h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Post Tasks</div>
                      <div className="text-xs text-muted-foreground">Get work done by skilled workers</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                />
                <p className="text-xs text-muted-foreground">At least 6 characters</p>
              </div>

              <Button 
                onClick={handleSignup} 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


