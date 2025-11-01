"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, DollarSign, Clock, Users, Filter, Eye, Loader2 } from "lucide-react";
import { tasksApi, assignmentsApi, type Task } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function DiscoverTasks() {
  const router = useRouter();
  const { toast } = useToast();
  const { userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<'createdAt' | 'reward' | 'deadline'>('createdAt');
  const [stats, setStats] = useState({
    availableTasks: 0,
    avgReward: 0,
    activeWorkers: 0,
    avgTime: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, [category, sortBy]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tasksApi.getAllTasks({
        category: category === 'all' ? undefined : category,
        sortBy,
        order: 'desc',
        page: 1,
        limit: 50,
        status: 'open', // Only show open tasks
      });

      if (response.success) {
        setTasks(response.data.data);
        
        // Calculate stats
        const avgReward = response.data.data.reduce(
          (sum: number, task: Task) => sum + parseFloat(task.reward), 
          0
        ) / (response.data.data.length || 1);
        
        setStats({
          availableTasks: response.data.pagination.total,
          avgReward,
          activeWorkers: 12450, // TODO: Get from API
          avgTime: 3, // TODO: Get from API
        });
      }
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err?.error?.message || 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please login to accept tasks.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    
    try {
      const response = await assignmentsApi.acceptTask({ 
        taskId,
        workerId: userId 
      });
      
      if (response.success) {
        toast({
          title: "Task Accepted!",
          description: `You have successfully accepted the task. Start working on it now.`,
        });
        
        // Navigate to task flow
        router.push(`/task-flow/${taskId}`);
      }
    } catch (err: any) {
      console.error('Error accepting task:', err);
      toast({
        title: "Error",
        description: err?.error?.message || 'Failed to accept task. Please try again.',
        variant: "destructive",
      });
    }
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'No deadline';
    
    const date = new Date(deadline);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return 'Urgent';
  };

  // Filter tasks by search query
  const filteredTasks = tasks.filter(task => 
    searchQuery === '' || 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1">
        {/* Header Section - Clean & Minimal (from HEAD) */}
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
          {/* Filters - Styling from HEAD, Logic from Master */}
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
                <Select 
                  value={sortBy} 
                  onValueChange={(value) => setSortBy(value as 'createdAt' | 'reward' | 'deadline')}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Newest First</SelectItem>
                    <SelectItem value="reward">Highest Pay</SelectItem>
                    <SelectItem value="deadline">Deadline Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid - Styling from HEAD, Logic from Master */}
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
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.availableTasks.toLocaleString()}
                  </p>
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
                  <p className="text-3xl font-bold text-gray-900">
                    ${loading ? '...' : stats.avgReward.toFixed(2)}
                  </p>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.activeWorkers.toLocaleString()}
                  </p>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : `${stats.avgTime} min`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task List - Logic from Master, Styling from HEAD */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20A277]" />
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchTasks} className="bg-[#20A277] hover:bg-[#1A8260] text-white">
                  Retry
                </Button>
              </div>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white"
                  // onClick={() => router.push(`/task-detail?id=${task.id}&role=worker`)} // Optionally add card-level click
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-gray-100 text-gray-700 border-0 hover:bg-gray-100 px-2 py-0.5 text-xs">
                            {task.category || 'General'}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100 px-2 py-0.5 text-xs font-semibold">
                            ${task.reward} per task
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2 text-gray-900 font-semibold">{task.title}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {task.description || 'No description provided'}
                        </CardDescription>
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
                        <Button 
                          className="bg-[#20A277] hover:bg-[#1A8260] text-white"
                          onClick={(e) => handleAcceptTask(task.id, e)}
                        >
                          Accept Task
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Quantity</p>
                        <p className="text-sm font-semibold text-gray-900">{task.qty} tasks</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Deadline</p>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-sm font-semibold text-gray-900">{formatDeadline(task.deadline)}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Total Reward</p>
                        <p className="text-sm font-semibold text-[#20A277]">
                          ${(parseFloat(task.reward) * task.qty).toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{task.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  No tasks found matching your criteria
                </p>
                <Button 
                  className="bg-[#20A277] hover:bg-[#1A8260] text-white"
                  onClick={() => {
                    setSearchQuery('');
                    setCategory('all');
                    fetchTasks();
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}