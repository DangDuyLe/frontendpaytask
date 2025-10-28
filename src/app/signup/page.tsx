"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Back to Home */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 text-gray-700 hover:bg-white hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg">Start your journey in 60 seconds</p>
        </div>

        {/* Signup Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600 mt-2">Choose your role and fill in your details</p>
            </div>

            <div className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">I want to:</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as "client" | "worker")}>
                  <div className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    role === "worker" 
                      ? "border-[#20A277] bg-green-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <RadioGroupItem value="worker" id="worker" className="mt-0" />
                    <Label htmlFor="worker" className="flex items-start cursor-pointer flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 mr-3">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-base text-gray-900">Work on Tasks</div>
                        <div className="text-sm text-gray-600">Earn money by completing micro-tasks</div>
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    role === "client" 
                      ? "border-[#20A277] bg-green-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <RadioGroupItem value="client" id="client" className="mt-0" />
                    <Label htmlFor="client" className="flex items-start cursor-pointer flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 mr-3">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-base text-gray-900">Post Tasks</div>
                        <div className="text-sm text-gray-600">Get work done by skilled workers</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                  />
                </div>

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
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                  />
                  <p className="text-xs text-gray-500">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleSignup} 
                className="w-full h-11 text-base font-semibold bg-[#20A277] hover:bg-[#1a8a63] text-white"
                size="lg"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link href="/login">
                  <Button variant="outline" className="w-full h-11 font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    Sign In Instead
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <p className="text-center text-xs text-gray-500 mt-8">
          By creating an account, you agree to our{" "}
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
