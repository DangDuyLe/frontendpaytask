"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Info, Calendar } from "lucide-react";

export default function CreateTask() {
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

  const handleSaveDraft = () => {
    console.log("Saving draft...");
  };

  const handlePublish = () => {
    console.log("Publishing task...");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Task</h1>
          <p className="text-gray-600">Describe your task and set the reward to get started</p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Task Details</h2>
                  <p className="text-sm text-gray-600">Provide clear instructions for workers</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-900">Task Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Label images for AI training"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={200}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277] h-9"
                    />
                    <p className="text-xs text-gray-500">{title.length}/200 characters</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-900">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed instructions on what workers need to do..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      maxLength={5000}
                      className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277] resize-none text-sm"
                    />
                    <p className="text-xs text-gray-500">{description.length}/5000 characters</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-900">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category" className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277] h-9">
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

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="reward" className="text-sm font-medium text-gray-900">Reward per Task *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="reward"
                          type="number"
                          min="0.10"
                          max="1000"
                          step="0.01"
                          placeholder="0.50"
                          value={reward}
                          onChange={(e) => setReward(e.target.value)}
                          className="pl-10 border-gray-300 focus:border-[#20A277] focus:ring-[#20A277] h-9"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Min: $0.10, Max: $1000</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="quantity" className="text-sm font-medium text-gray-900">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="10000"
                        placeholder="100"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277] h-9"
                      />
                      <p className="text-xs text-gray-500">Min: 1, Max: 10,000</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="deadline" className="text-sm font-medium text-gray-900">Deadline *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="deadline"
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-[#20A277] focus:ring-[#20A277] h-9"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Must be at least 1 hour in the future (max 90 days)
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={handleSaveDraft} 
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-9"
                    >
                      Save as Draft
                    </Button>
                    <Button 
                      onClick={handlePublish} 
                      className="flex-1 bg-[#20A277] hover:bg-[#1a8d66] text-white h-9"
                    >
                      Publish & Fund Task
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Budget Summary</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reward per task:</span>
                      <span className="font-medium text-gray-900">${rewardNum.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium text-gray-900">{quantityNum}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total reward:</span>
                      <span className="font-medium text-gray-900">${totalReward.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform fee (5%):</span>
                      <span className="font-medium text-gray-900">${platformFee.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between pt-2">
                      <span className="font-semibold text-gray-900">Total Budget:</span>
                      <span className="text-2xl font-bold text-[#20A277]">${totalBudget.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">Escrow Protection</p>
                      <p className="text-gray-600">
                        Your funds will be held in escrow and only released when workers complete and you approve their work.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <p>✓ Auto-approve after 48 hours if no review</p>
                    <p>✓ Full refund if no workers complete</p>
                    <p>✓ Instant payout to workers upon approval</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


