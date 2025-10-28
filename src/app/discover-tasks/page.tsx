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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover Tasks</h1>
            <p className="text-muted-foreground">Find and complete micro-tasks to earn instantly</p>
          </div>

          {/* Filters */}
          <div className="bg-background rounded-lg border p-6 mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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
                <SelectTrigger>
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
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Tasks</p>
                    <p className="text-2xl font-bold text-primary">2,847</p>
                  </div>
                  <Filter className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Reward</p>
                    <p className="text-2xl font-bold text-accent">$0.45</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Workers</p>
                    <p className="text-2xl font-bold">12,450</p>
                  </div>
                  <Users className="h-8 w-8 text-info" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Time</p>
                    <p className="text-2xl font-bold">3 min</p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {mockTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{task.category}</Badge>
                        <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                          ${task.reward} per task
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => router.push(`/task-detail?id=${task.id}&role=worker`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Detail
                      </Button>
                      <Button>Accept Task</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-medium">{task.available} / {task.qty}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-medium">{task.deadline}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium">{task.client}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Requirements</p>
                      <p className="font-medium text-xs">{task.requirements.join(", ")}</p>
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


