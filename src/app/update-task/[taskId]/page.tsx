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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/client-dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Update Task</h1>
            <p className="text-muted-foreground">Edit your task details before publishing</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
              <CardDescription>Update the details of your task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Verify restaurant menu prices"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what workers need to do..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
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
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Number of tasks"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    How many times should this task be completed?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward">Reward per Task (USD) *</Label>
                  <Input
                    id="reward"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Payment for each completion
                  </p>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Time (minutes) *</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  placeholder="e.g., 5"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Average time to complete one task
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <Label htmlFor="instructions">Task Instructions *</Label>
                <Textarea
                  id="instructions"
                  placeholder="Provide detailed step-by-step instructions..."
                  rows={6}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Clear instructions help workers complete tasks correctly
                </p>
              </div>

              {/* Summary */}
              <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">Task Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Tasks:</span>
                    <span className="ml-2 font-medium">{quantity || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reward per Task:</span>
                    <span className="ml-2 font-medium">${reward || "0.00"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Cost:</span>
                    <span className="ml-2 font-medium text-primary">
                      ${((parseFloat(quantity) || 0) * (parseFloat(reward) || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Time:</span>
                    <span className="ml-2 font-medium">{estimatedTime || 0} min</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleUpdateTask} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/client-dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
