"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Info, Calendar, Loader2 } from "lucide-react";
import { tasksApi } from "@/api";
import { useToast } from "@/hooks/use-toast";

export default function CreateTask() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [reward, setReward] = useState("");
  const [qty, setQty] = useState("");
  const [deadline, setDeadline] = useState("");

  const platformFeeRate = 0.05; // 5%
  const rewardNum = parseFloat(reward) || 0;
  const quantityNum = parseInt(qty) || 0;
  const totalReward = rewardNum * quantityNum;
  const platformFee = totalReward * platformFeeRate;
  const totalBudget = totalReward + platformFee;

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Task description is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!category) {
      toast({
        title: "Validation Error",
        description: "Please select a category.",
        variant: "destructive",
      });
      return false;
    }

    if (rewardNum < 0.10 || rewardNum > 1000) {
      toast({
        title: "Validation Error",
        description: "Reward must be between $0.10 and $1000.",
        variant: "destructive",
      });
      return false;
    }

    if (quantityNum < 1 || quantityNum > 10000) {
      toast({
        title: "Validation Error",
        description: "Quantity must be between 1 and 10,000.",
        variant: "destructive",
      });
      return false;
    }

    if (!deadline) {
      toast({
        title: "Validation Error",
        description: "Deadline is required.",
        variant: "destructive",
      });
      return false;
    }

    const deadlineDate = new Date(deadline);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    if (deadlineDate < oneHourFromNow) {
      toast({
        title: "Validation Error",
        description: "Deadline must be at least 1 hour in the future.",
        variant: "destructive",
      });
      return false;
    }

    if (deadlineDate > ninetyDaysFromNow) {
      toast({
        title: "Validation Error",
        description: "Deadline cannot be more than 90 days in the future.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Convert datetime-local to ISO 8601 format
      const deadlineISO = deadline ? new Date(deadline).toISOString() : undefined;
      
      const response = await tasksApi.createTask({
        title,
        description,
        category,
        reward: rewardNum,
        qty: quantityNum,
        deadline: deadlineISO,
      });

      if (response.success) {
        toast({
          title: "Draft Saved!",
          description: "Your task has been saved as a draft.",
        });
        
        // Navigate to client dashboard
        router.push('/client-dashboard');
      }
    } catch (err: any) {
      console.error('Error saving draft:', err);
      toast({
        title: "Error",
        description: err?.error?.message || 'Failed to save draft. Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Convert datetime-local to ISO 8601 format
      const deadlineISO = deadline ? new Date(deadline).toISOString() : undefined;
      
      // First create the task
      const createResponse = await tasksApi.createTask({
        title,
        description,
        category,
        reward: rewardNum,
        qty: quantityNum,
        deadline: deadlineISO,
      });

      if (createResponse.success) {
        // Then publish it
        const publishResponse = await tasksApi.publishTask(createResponse.data.id);

        if (publishResponse.success) {
          toast({
            title: "Task Published!",
            description: `Your task has been published successfully. ${publishResponse.escrow ? `Escrowed: $${publishResponse.escrow.amount}` : ''}`,
          });
          
          // Navigate to client dashboard
          router.push('/client-dashboard');
        }
      }
    } catch (err: any) {
      console.error('Error publishing task:', err);
      toast({
        title: "Error",
        description: err?.error?.message || 'Failed to publish task. Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create New Task</h1>
              <p className="text-muted-foreground">Describe your task and set the reward to get started</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Details</CardTitle>
                    <CardDescription>Provide clear instructions for workers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Label images for AI training"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={200}
                      />
                      <p className="text-xs text-muted-foreground">{title.length}/200 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide detailed instructions on what workers need to do..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        maxLength={5000}
                      />
                      <p className="text-xs text-muted-foreground">{description.length}/5000 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ai-data">AI & Data</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="content-review">Content Review</SelectItem>
                          <SelectItem value="data-entry">Data Entry</SelectItem>
                          <SelectItem value="media">Media Tasks</SelectItem>
                          <SelectItem value="testing">Testing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reward">Reward per Task *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reward"
                            type="number"
                            min="0.10"
                            max="1000"
                            step="0.01"
                            placeholder="0.50"
                            value={reward}
                            onChange={(e) => setReward(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Min: $0.10, Max: $1000</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          max="10000"
                          placeholder="100"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Min: 1, Max: 10,000</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="deadline"
                          type="datetime-local"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be at least 1 hour in the future (max 90 days)
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={handleSaveDraft} 
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save as Draft'
                        )}
                      </Button>
                      <Button 
                        onClick={handlePublish} 
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          'Publish & Fund Task'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Budget Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Budget Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reward per task:</span>
                        <span className="font-medium">${rewardNum.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{quantityNum}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total reward:</span>
                        <span className="font-medium">${totalReward.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform fee (5%):</span>
                        <span className="font-medium">${platformFee.toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between">
                        <span className="font-medium">Total Budget:</span>
                        <span className="text-2xl font-bold text-primary">${totalBudget.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="bg-info/10 rounded-lg p-4 flex gap-3">
                      <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-info mb-1">Escrow Protection</p>
                        <p className="text-muted-foreground">
                          Your funds will be held in escrow and only released when workers complete and you approve their work.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>✓ Auto-approve after 48 hours if no review</p>
                      <p>✓ Full refund if no workers complete</p>
                      <p>✓ Instant payout to workers upon approval</p>
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


