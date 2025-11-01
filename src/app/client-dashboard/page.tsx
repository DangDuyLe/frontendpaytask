"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Eye, 
  ExternalLink, 
  Edit, 
  Wallet, 
  Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { tasksApi, type Task } from "@/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ClientDashboard() {
  const router = useRouter();
  const { userId, isAuthenticated } = useAuth();
  const [allTasks, setAllTasks] = useState<Task[]>([]); // Store all tasks
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Filtered tasks for display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [displayLimit, setDisplayLimit] = useState(5); // Initially show 5 tasks
  const [stats, setStats] = useState({
    totalSpent: 0,
    activeTasks: 0,
    totalCompletions: 0,
    pendingReviews: 0,
  });

  // Fetch all tasks from API (once on mount and every 5 seconds)
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!userId) return;
    
    // Initial fetch
    fetchAllTasks();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing tasks...');
      fetchAllTasks();
    }, 5000); // Changed from 1000 to 5000 (5 seconds)
    
    return () => clearInterval(interval);
  }, [userId, isAuthenticated]);

  // Filter tasks whenever activeTab changes
  useEffect(() => {
    setDisplayLimit(5); // Reset display limit when tab changes
    filterTasks();
  }, [activeTab, allTasks]);

  const fetchAllTasks = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📤 Fetching tasks with params:', {
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        order: 'desc',
        clientId: userId,
      });
      
      // Fetch ALL tasks with default params (no filtering)
      const response = await tasksApi.getMyTasks({
        page: 1,
        limit: 100, // Get more tasks
        sortBy: 'createdAt' as const,
        order: 'desc' as const,
        clientId: userId,
        // No status filter - get all tasks
      });

      console.log('📥 Raw API Response:', response);
      console.log('📊 Response data structure:', {
        success: response.success,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        tasksArray: response.data?.data,
        tasksCount: response.data?.data?.length,
        pagination: response.data?.pagination,
      });

      if (response.success) {
        console.log('✅ Fetched all tasks:', response.data.data.length, 'tasks');
        console.log('📋 First task (sample):', response.data.data[0]);
        setAllTasks(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (err: any) {
      console.error('❌ Error fetching tasks:', err);
      console.error('Error details:', {
        message: err?.message,
        error: err?.error,
        response: err?.response,
      });
      setError(err?.error?.message || 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on active tab (frontend filtering)
  const filterTasks = () => {
    if (activeTab === "all") {
      setFilteredTasks(allTasks);
    } else {
      const filtered = allTasks.filter(task => task.status === activeTab);
      setFilteredTasks(filtered);
    }
  };

  // Calculate statistics from all tasks
  const calculateStats = (tasks: Task[]) => {
    const totalSpent = tasks.reduce((sum, task) => {
      if (task.budget) {
        return sum + parseFloat(task.budget);
      }
      const completed = task._count?.assignments || 0;
      return sum + (completed * parseFloat(task.reward));
    }, 0);
    
    const activeTasks = tasks.filter(
      t => t.status === 'open' || t.status === 'active'
    ).length;
    
    const totalCompletions = tasks.reduce(
      (sum, task) => sum + (task._count?.assignments || 0), 
      0
    );
    
    setStats({
      totalSpent,
      activeTasks,
      totalCompletions,
      pendingReviews: 0, // TODO: Add pending reviews count
    });
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
        return <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100 px-2 py-0.5 text-xs">Open</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-100 px-2 py-0.5 text-xs">Active</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-100 px-2 py-0.5 text-xs">In Progress</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 border-0 hover:bg-gray-100 px-2 py-0.5 text-xs">Draft</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100 px-2 py-0.5 text-xs">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1">
        {/* Header Section - Clean & Minimal */}
        <div className="relative border-b bg-white">
          <div className="container relative mx-auto px-8 lg:px-16 py-12 max-w-[1400px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3 max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Client Dashboard
                </h1>
                <p className="text-gray-600 text-base leading-relaxed">
                  Manage your tasks and track progress
                </p>
              </div>

              {/* Create Task Button */}
              <Link href="/create-task">
                <Button 
                  size="lg" 
                  className="bg-[#20A277] hover:bg-[#1A8260] text-white font-medium h-11 px-6 shadow-sm hover:shadow transition-all"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Task
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 lg:px-16 py-12 max-w-[1400px]">
          {/* Stats Grid - Clean White Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Spent Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-[#20A277]" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    ${loading ? '...' : stats.totalSpent.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Active Tasks Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.activeTasks}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Total Completions Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-[#20A277]" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Completions</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalCompletions}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg relative">
                      <Clock className="h-5 w-5 text-orange-600" />
                      {!loading && stats.pendingReviews > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {stats.pendingReviews}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.pendingReviews}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List - Clean */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Your Tasks
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  View and manage all your posted tasks
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4 mt-6">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-[#20A277]" />
                      <span className="ml-3 text-gray-600">Loading tasks...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button onClick={fetchAllTasks} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        Try Again
                      </Button>
                    </div>
                  ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        {activeTab === "all" 
                          ? "You haven't created any tasks yet"
                          : `No ${activeTab} tasks found`
                        }
                      </p>
                      <Link href="/create-task">
                        <Button className="bg-[#20A277] hover:bg-[#1A8260] text-white">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Task
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Display info about total tasks */}
                      {filteredTasks.length > 0 && (
                        <div className="text-sm text-gray-600 mb-4">
                          Showing {Math.min(displayLimit, filteredTasks.length)} of {filteredTasks.length} tasks
                        </div>
                      )}
                      
                      {/* Task list - only show up to displayLimit */}
                      {filteredTasks.slice(0, displayLimit).map((task, index) => {
                        const completed = task._count?.assignments || 0;
                        const total = task.qty;
                        const reward = parseFloat(task.reward);
                        
                        return (
                          <div
                            key={task.id}
                            className={`p-6 hover:bg-gray-50 transition-colors rounded-lg border border-gray-100 ${
                              index !== filteredTasks.slice(0, displayLimit).length - 1 ? 'mb-4' : ''
                            }`}
                          >
                            <div className="space-y-4">
                              {/* Task Header */}
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getStatusBadge(task.status)}
                                    <span className="text-xs font-medium text-gray-500">{formatDate(task.createdAt)}</span>
                                  </div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{task.title}</h3>
                                  <div className="grid md:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-500 uppercase">Progress</p>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                              className="bg-[#20A277] h-1.5 rounded-full transition-all"
                                              style={{ width: `${(completed / total) * 100}%` }}
                                            />
                                          </div>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">{completed} / {total}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-500 uppercase">Reward</p>
                                      <p className="text-lg font-bold text-[#20A277]">${reward.toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-500 uppercase">Pending Review</p>
                                      <p className="text-lg font-bold text-orange-600">0</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-500 uppercase">Total Cost</p>
                                      <p className="text-lg font-bold text-gray-900">
                                        ${task.budget ? parseFloat(task.budget).toFixed(2) : (completed * reward).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-4 flex gap-2">
                                  {task.status === "draft" ? (
                                    <>
                                      <Button 
                                        variant="outline"
                                        className="border-gray-300 hover:bg-gray-50"
                                        onClick={() => router.push(`/update-task/${task.id}`)}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Update
                                      </Button>
                                      <Button 
                                        className="bg-[#20A277] hover:bg-[#1A8260] text-white"
                                        onClick={() => handleViewTaskDetail(task.id, true)}
                                      >
                                        <Wallet className="mr-2 h-4 w-4" />
                                        Fund Task
                                      </Button>
                                    </>
                                  ) : (
                                    <Button 
                                      variant="outline"
                                      className="border-gray-300 hover:bg-gray-50"
                                      onClick={() => handleViewTaskDetail(task.id, false)}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* See More button - only show if there are more tasks to display */}
                      {displayLimit < filteredTasks.length && (
                        <div className="flex justify-center pt-6">
                          <Button 
                            variant="outline" 
                            onClick={() => setDisplayLimit(prev => prev + 5)}
                            className="w-full md:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            See More ({filteredTasks.length - displayLimit} remaining)
                          </Button>
                        </div>
                      )}
                      
                      {/* Show Less button - only show if we're displaying more than 5 */}
                      {displayLimit > 5 && displayLimit >= filteredTasks.length && (
                        <div className="flex justify-center pt-4">
                          <Button 
                            variant="ghost" 
                            onClick={() => setDisplayLimit(5)}
                            className="w-full md:w-auto text-gray-700 hover:bg-gray-50"
                          >
                            Show Less
                          </Button>
                        </div>
                      )}
                    </>
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