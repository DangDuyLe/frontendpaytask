"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

export default function UpdateTask() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  // Mock data - in real app, fetch based on taskId
  const [title, setTitle] = useState("Data entry from receipts");
  const [description, setDescription] = useState("Enter data from receipt images into a structured format");
  const [category, setCategory] = useState("data-entry");
  const [quantity, setQuantity] = useState("2000");
  const [reward, setReward] = useState("0.30");
  const [instructions, setInstructions] = useState("1. Review the receipt image\n2. Extract all relevant information\n3. Enter data accurately");
  const [estimatedTime, setEstimatedTime] = useState("5");

  const handleUpdateTask = () => {
    console.log("Updating task:", taskId, {
      title,
      description,
      category,
      quantity,
      reward,
      instructions,
      estimatedTime
    });
    // Handle task update logic here
    router.push("/client-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
            <Link href="/client-dashboard">
              <Button variant="ghost" className="mb-4 hover:bg-gray-50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Task</h1>
            <p className="text-gray-600">Edit your task details before publishing</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-8 space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Task Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Verify restaurant menu prices"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what workers need to do..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="data-entry">Data Entry</SelectItem>
                        <SelectItem value="data-collection">Data Collection</SelectItem>
                        <SelectItem value="content-moderation">Content Moderation</SelectItem>
                        <SelectItem value="image-annotation">Image Annotation</SelectItem>
                        <SelectItem value="transcription">Transcription</SelectItem>
                        <SelectItem value="survey">Survey</SelectItem>
                        <SelectItem value="verification">Verification</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Grid for Quantity and Reward */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Number of tasks"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                      />
                      <p className="text-xs text-gray-500">
                        How many times should this task be completed?
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reward" className="text-sm font-semibold text-gray-700">Reward per Task (USD) *</Label>
                      <Input
                        id="reward"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                        className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                      />
                      <p className="text-xs text-gray-500">
                        Payment for each completion
                      </p>
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime" className="text-sm font-semibold text-gray-700">Estimated Time (minutes) *</Label>
                    <Input
                      id="estimatedTime"
                      type="number"
                      placeholder="e.g., 5"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                    <p className="text-xs text-gray-500">
                      Average time to complete one task
                    </p>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="instructions" className="text-sm font-semibold text-gray-700">Task Instructions *</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Provide detailed step-by-step instructions..."
                      rows={6}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                    <p className="text-xs text-gray-500">
                      Clear instructions help workers complete tasks correctly
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Task Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Tasks</span>
                        <span className="text-sm font-semibold text-gray-900">{quantity || 0}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Reward per Task</span>
                        <span className="text-sm font-semibold text-gray-900">${reward || "0.00"}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Estimated Time</span>
                        <span className="text-sm font-semibold text-gray-900">{estimatedTime || 0} min</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-900">Total Cost</span>
                          <span className="text-lg font-bold text-[#20A277]">
                            ${((parseFloat(quantity) || 0) * (parseFloat(reward) || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <Button 
                        onClick={handleUpdateTask} 
                        className="w-full bg-[#20A277] hover:bg-[#1a8a63] text-white"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => router.push("/client-dashboard")}
                        className="w-full border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
