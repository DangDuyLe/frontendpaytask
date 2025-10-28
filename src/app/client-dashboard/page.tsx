"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Clock, CheckCircle, DollarSign, Eye, ExternalLink, Edit, Wallet, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { tasksApi, type Task } from "@/api";

export default function ClientDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({
    totalSpent: 0,
    activeTasks: 0,
    totalCompletions: 0,
    pendingReviews: 0,
  });

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Filter by status based on active tab
      const statusFilter = activeTab === "all" ? undefined : activeTab;
      
      const response = await tasksApi.getMyTasks({
        status: statusFilter,
        page: 1,
        limit: 50,
        sortBy: 'createdAt',
        order: 'desc',
        clientId: "4258a1a4-0f41-46aa-93ca-6823e68ab96d",
      });

      if (response.success) {
        setTasks(response.data.data);
        
        // Calculate stats from tasks
        const totalSpent = response.data.data.reduce((sum, task) => {
          const completed = task._count?.assignments || 0;
          return sum + (completed * parseFloat(task.reward));
        }, 0);
        
        const activeTasks = response.data.data.filter(
          t => t.status === 'open' || t.status === 'active'
        ).length;
        
        const totalCompletions = response.data.data.reduce(
          (sum, task) => sum + (task._count?.assignments || 0), 
          0
        );
        
        setStats({
          totalSpent,
          activeTasks,
          totalCompletions,
          pendingReviews: 0, // TODO: Add pending reviews count from API
        });
      }
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err?.error?.message || 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Handle view task detail
  const handleViewTaskDetail = async (taskId: string, isDraft: boolean = false) => {
    try {
      // Fetch task detail from API
      const response = await tasksApi.getTaskById(taskId);
      
      if (response.success) {
        // Navigate to task detail page with query params
        const queryParams = new URLSearchParams({
          id: taskId,
          role: 'client',
          ...(isDraft && { draft: 'true' })
        });
        
        router.push(`/task-detail?${queryParams.toString()}`);
      }
    } catch (err: any) {
      console.error('Error fetching task detail:', err);
      // Still navigate even if fetch fails (page will handle loading)
      const queryParams = new URLSearchParams({
        id: taskId,
        role: 'client',
        ...(isDraft && { draft: 'true' })
      });
      router.push(`/task-detail?${queryParams.toString()}`);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-accent/10 text-accent">Open</Badge>;
      case 'active':
        return <Badge className="bg-blue-500/10 text-blue-600">Active</Badge>;
      case 'in_progress':
        return <Badge className="bg-info/10 text-info">In Progress</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-600">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
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
                    <p className="text-2xl font-bold text-primary">
                      ${loading ? '...' : stats.totalSpent.toFixed(2)}
                    </p>
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
                    <p className="text-2xl font-bold text-info">
                      {loading ? '...' : stats.activeTasks}
                    </p>
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
                    <p className="text-2xl font-bold text-accent">
                      {loading ? '...' : stats.totalCompletions}
                    </p>
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
                    <p className="text-2xl font-bold text-warning">
                      {loading ? '...' : stats.pendingReviews}
                    </p>
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4 mt-6">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-3 text-muted-foreground">Loading tasks...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-red-500 mb-4">{error}</p>
                      <Button onClick={fetchTasks} variant="outline">
                        Try Again
                      </Button>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        {activeTab === "all" 
                          ? "You haven't created any tasks yet"
                          : `No ${activeTab} tasks found`
                        }
                      </p>
                      <Link href="/create-task">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Task
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    tasks.map((task) => {
                      const completed = task._count?.assignments || 0;
                      const total = task.qty;
                      const reward = parseFloat(task.reward);
                      
                      return (
                        <Card key={task.id}>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              {/* Task Header */}
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getStatusBadge(task.status)}
                                    <span className="text-sm text-muted-foreground">
                                      {formatDate(task.createdAt)}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">Progress</p>
                                      <p className="font-medium">{completed} / {total}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Reward</p>
                                      <p className="font-medium">${reward.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Category</p>
                                      <p className="font-medium">{task.category || 'Uncategorized'}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Total Cost</p>
                                      <p className="font-medium">${(completed * reward).toFixed(2)}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-4 flex gap-2">
                                  {task.status === "draft" ? (
                                    <>
                                      <Button 
                                        variant="outline"
                                        onClick={() => router.push(`/update-task/${task.id}`)}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Update
                                      </Button>
                                      <Button 
                                        onClick={() => handleViewTaskDetail(task.id, true)}
                                      >
                                        <Wallet className="mr-2 h-4 w-4" />
                                        Fund Task
                                      </Button>
                                    </>
                                  ) : (
                                    <Button 
                                      variant="outline"
                                      onClick={() => handleViewTaskDetail(task.id, false)}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* Show deadline if exists */}
                              {task.deadline && (
                                <div className="text-sm text-muted-foreground">
                                  <Clock className="inline h-4 w-4 mr-1" />
                                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
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


