"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, DollarSign, Clock, Users, Filter, Eye } from "lucide-react";

const mockTasks = [
  {
    id: "1",
    title: "Verify Restaurant Menu Prices",
    description: "Visit the restaurant and verify that all menu prices match our database. Take photos of the menu items and confirm pricing accuracy. Must be completed during business hours (11am-9pm).",
    category: "Data Verification",
    reward: 5.00,
    qty: 50,
    available: 23,
    deadline: "2 days",
    client: "FoodieData Inc.",
    requirements: ["Must have a smartphone with camera", "Must be located within 5km of restaurant", "Must complete during restaurant operating hours"],
  },
  {
    id: "2",
    title: "Product review moderation",
    description: "Review and moderate user-submitted product reviews for quality and appropriateness",
    category: "Content Review",
    reward: 0.75,
    qty: 500,
    available: 423,
    deadline: "5 days",
    client: "ShopNow Inc",
    requirements: ["Fluent English", "Good judgment"],
  },
  {
    id: "3",
    title: "Data entry from receipts",
    description: "Extract key information from receipt images and input into structured format",
    category: "Data Entry",
    reward: 0.30,
    qty: 2000,
    available: 1876,
    deadline: "1 week",
    client: "FinanceApp",
    requirements: ["Attention to detail", "Fast typing"],
  },
  {
    id: "4",
    title: "Video thumbnail testing",
    description: "Rate video thumbnails for appeal and click-worthiness",
    category: "Media Tasks",
    reward: 0.25,
    qty: 800,
    available: 654,
    deadline: "3 days",
    client: "StreamHub",
    requirements: ["Visual judgment"],
  },
];

export default function DiscoverTasks() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1">
        {/* Header Section - Clean & Minimal */}
        <div className="relative border-b bg-white">
          <div className="container relative mx-auto px-8 lg:px-16 py-12 max-w-[1400px]">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Discover Tasks
              </h1>
              <p className="text-gray-600 text-base leading-relaxed">
                Find and complete micro-tasks to earn instantly
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 lg:px-16 py-12 max-w-[1400px]">
          {/* Filters - Clean */}
          <Card className="border border-gray-200 shadow-sm bg-white mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                    />
                  </div>
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="ai-data">AI & Data</SelectItem>
                    <SelectItem value="content">Content Review</SelectItem>
                    <SelectItem value="data-entry">Data Entry</SelectItem>
                    <SelectItem value="media">Media Tasks</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="highest-pay">Highest Pay</SelectItem>
                    <SelectItem value="deadline">Deadline Soon</SelectItem>
                    <SelectItem value="most-available">Most Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid - Clean */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Filter className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Available Tasks</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">2,847</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-[#20A277]" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Avg. Reward</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">$0.45</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Active Workers</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">12,450</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">3 min</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task List - Clean */}
          <div className="space-y-4">
            {mockTasks.map((task) => (
              <Card key={task.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-gray-100 text-gray-700 border-0 hover:bg-gray-100 px-2 py-0.5 text-xs">
                          {task.category}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100 px-2 py-0.5 text-xs font-semibold">
                          ${task.reward.toFixed(2)} per task
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2 text-gray-900 font-semibold">{task.title}</CardTitle>
                      <CardDescription className="text-gray-600">{task.description}</CardDescription>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <Button 
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                        onClick={() => router.push(`/task-detail?id=${task.id}&role=worker`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Detail
                      </Button>
                      <Button className="bg-[#20A277] hover:bg-[#1A8260] text-white">
                        Accept Task
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">Available</p>
                      <p className="text-sm font-semibold text-gray-900">{task.available} / {task.qty}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-[#20A277] h-1.5 rounded-full transition-all"
                          style={{ width: `${(task.available / task.qty) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">Deadline</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-900">{task.deadline}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">Client</p>
                      <p className="text-sm font-semibold text-gray-900">{task.client}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">Requirements</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{task.requirements.join(", ")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


