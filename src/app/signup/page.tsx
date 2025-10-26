"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, Briefcase, User } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState<"client" | "worker">("worker");

  const handleEmailSignup = () => {
    if (!otpSent) {
      setOtpSent(true);
    } else {
      console.log("Signup with email:", email, "role:", role);
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
              <RadioGroup value={role} onValueChange={(value) => setRole(value as "client" | "worker")}>
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
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Check your email for the verification code
                  </p>
                </div>
              )}

              <Button onClick={handleEmailSignup} className="w-full">
                {otpSent ? "Verify & Create Account" : "Send Verification Code"}
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


