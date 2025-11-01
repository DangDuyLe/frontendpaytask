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
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
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
          // Format deadline for datetime-local input
          setDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "");
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
      
      const deadlineISO = deadline ? new Date(deadline).toISOString() : undefined;

      const response = await tasksApi.updateTaskDraft(taskId, {
        title: title.trim(),
        description: description.trim(),
        category,
        reward: rewardNum,
        qty: quantityNum,
        deadline: deadlineISO,
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
            <Link href="/client-dashboard">
              <Button variant="ghost" className="mb-4 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Task</h1>
            <p className="text-gray-600">Edit your task details before publishing</p>
          </div>

          {loading ? (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-12 text-center text-gray-600">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20A277]" />
                Loading task data...
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-gray-200 shadow-sm bg-red-50 border-red-200">
              <CardContent className="p-12 text-center text-red-700">
                <AlertCircle className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Failed to load task</h3>
                <p>{error}</p>
              </CardContent>
            </Card>
          ) : (
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

                    {/* Deadline */}
                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-sm font-semibold text-gray-700">Deadline</Label>
                      <Input
                        id="deadline"
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                      />
                      <p className="text-xs text-gray-500">
                        Optional deadline for task completion
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
                          <span className="text-sm font-semibold text-gray-900">${parseFloat(reward || "0").toFixed(2)}</span>
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
                          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}