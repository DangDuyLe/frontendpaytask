"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase, User, ArrowLeft, UserPlus } from "lucide-react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "worker">("worker");

  const handleSignup = () => {
    console.log("Signup with username:", username, "email:", email, "role:", role);
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg">
        {/* Back to Home */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">PayTask</h1>
          </Link>
          <p className="text-muted-foreground text-lg">Start your journey in 60 seconds</p>
        </div>

        {/* Signup Card */}
        <Card className="shadow-xl border-2">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-base">
              Choose your role and fill in your details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">I want to:</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as "client" | "worker")}>
                  <div className={`flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    role === "worker" 
                      ? "border-accent bg-accent/5 shadow-sm" 
                      : "border-border hover:border-accent/50 hover:bg-accent/5"
                  }`}>
                    <RadioGroupItem value="worker" id="worker" className="mt-0" />
                    <Label htmlFor="worker" className="flex items-start cursor-pointer flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 mr-3">
                        <User className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-base mb-1">Work on Tasks</div>
                        <div className="text-sm text-muted-foreground">Earn money by completing micro-tasks</div>
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    role === "client" 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}>
                    <RadioGroupItem value="client" id="client" className="mt-0" />
                    <Label htmlFor="client" className="flex items-start cursor-pointer flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mr-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-base mb-1">Post Tasks</div>
                        <div className="text-sm text-muted-foreground">Get work done by skilled workers</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleSignup} 
                className="w-full h-11 text-base font-semibold"
                size="lg"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link href="/login">
                  <Button variant="outline" className="w-full h-11 font-semibold">
                    Sign In Instead
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}


