"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Clock, CheckCircle, DollarSign } from "lucide-react";

const mockTasks = [
  {
    id: "1",
    title: "Label images for AI training",
    status: "open",
    created: "2 hours ago",
    completed: 653,
    total: 1000,
    reward: 0.50,
    pendingReview: 12,
  },
  {
    id: "2",
    title: "Product review moderation",
    status: "in_progress",
    created: "1 day ago",
    completed: 289,
    total: 500,
    reward: 0.75,
    pendingReview: 8,
  },
  {
    id: "3",
    title: "Data entry from receipts",
    status: "draft",
    created: "3 days ago",
    completed: 0,
    total: 2000,
    reward: 0.30,
    pendingReview: 0,
  },
];

export default function ClientDashboard() {
  const totalSpent = 486.50;
  const activeTasks = 2;
  const totalCompletions = 942;
  const pendingReviews = 20;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
              <p className="text-muted-foreground">Manage your tasks and track progress</p>
            </div>
            <Link href="/create-task">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create New Task
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold text-primary">${totalSpent.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Tasks</p>
                    <p className="text-2xl font-bold text-info">{activeTasks}</p>
                  </div>
                  <FileText className="h-8 w-8 text-info" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completions</p>
                    <p className="text-2xl font-bold text-accent">{totalCompletions}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    <p className="text-2xl font-bold text-warning">{pendingReviews}</p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>View and manage all your posted tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                  {mockTasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {task.status === "open" && (
                                <Badge className="bg-accent/10 text-accent">Open</Badge>
                              )}
                              {task.status === "in_progress" && (
                                <Badge className="bg-info/10 text-info">In Progress</Badge>
                              )}
                              {task.status === "draft" && (
                                <Badge variant="outline">Draft</Badge>
                              )}
                              <span className="text-sm text-muted-foreground">{task.created}</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                            <div className="grid md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Progress</p>
                                <p className="font-medium">{task.completed} / {task.total}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Reward</p>
                                <p className="font-medium">${task.reward}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Pending Review</p>
                                <p className="font-medium">{task.pendingReview}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total Cost</p>
                                <p className="font-medium">${(task.completed * task.reward).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex gap-2">
                            {task.pendingReview > 0 && (
                              <Button variant="outline">Review Submissions</Button>
                            )}
                            <Button variant="ghost">View Details</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
