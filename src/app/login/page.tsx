"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Wallet } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailLogin = () => {
    if (!otpSent) {
      // Send OTP
      setOtpSent(true);
    } else {
      // Verify OTP and login
      console.log("Login with email:", email, "OTP:", otp);
    }
  };

  const handleWalletConnect = () => {
    console.log("Connect wallet");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-primary mb-2">PayTask</h1>
          </Link>
          <p className="text-muted-foreground">Sign in to start earning or posting tasks</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Choose your preferred sign-in method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="wallet">
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
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
                      We sent a code to {email}
                    </p>
                  </div>
                )}

                <Button onClick={handleEmailLogin} className="w-full">
                  {otpSent ? "Verify & Sign In" : "Send Code"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Web3 wallet to sign in instantly
                  </p>
                  <Button onClick={handleWalletConnect} className="w-full">
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Supports MetaMask, Phantom, and other Web3 wallets
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
