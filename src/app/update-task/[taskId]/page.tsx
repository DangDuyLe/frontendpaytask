"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { tasksApi } from "@/api";
import { useToast } from "@/hooks/use-toast";

export default function UpdateTask() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const taskId = params.taskId as string;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reward, setReward] = useState("");
  const [deadline, setDeadline] = useState("");

  // Fetch task data
  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tasksApi.getTaskById(taskId);
        
        if (response.success) {
          const task = response.data;
          setTitle(task.title || "");
          setDescription(task.description || "");
          setCategory(task.category || "");
          setQuantity(task.qty?.toString() || "");
          setReward(task.reward || "");
          setDeadline(task.deadline || "");
        }
      } catch (err: any) {
        console.error('Error fetching task:', err);
        setError(err?.error?.message || 'Failed to load task. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleUpdateTask = async () => {
    // Validation
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Task description is required.",
        variant: "destructive",
      });
      return;
    }

    const rewardNum = parseFloat(reward);
    const quantityNum = parseInt(quantity);

    if (isNaN(rewardNum) || rewardNum < 0.10) {
      toast({
        title: "Validation Error",
        description: "Reward must be at least $0.10.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(quantityNum) || quantityNum < 1) {
      toast({
        title: "Validation Error",
        description: "Quantity must be at least 1.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(true);
      
      const response = await tasksApi.updateTaskDraft(taskId, {
        title: title.trim(),
        description: description.trim(),
        category,
        reward: rewardNum,
        qty: quantityNum,
        deadline: deadline || undefined,
      });

      if (response.success) {
        toast({
          title: "Task Updated!",
          description: "Your task has been updated successfully.",
        });
        
        router.push('/client-dashboard');
      }
    } catch (err: any) {
      console.error('Error updating task:', err);
      toast({
        title: "Update Failed",
        description: err?.error?.message || 'Failed to update task. Please try again.',
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
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

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Optional deadline for task completion
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
                    <span className="text-muted-foreground">Total Budget:</span>
                    <span className="ml-2 font-medium text-accent">
                      ${((parseFloat(reward) || 0) * (parseInt(quantity) || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleUpdateTask} 
                  className="flex-1"
                  disabled={updating || loading}
                >
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
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
