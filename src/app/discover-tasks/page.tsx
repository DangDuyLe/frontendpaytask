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
              <Select 
                value={sortBy} 
                onValueChange={(value) => setSortBy(value as 'createdAt' | 'reward' | 'deadline')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Newest First</SelectItem>
                  <SelectItem value="reward">Highest Pay</SelectItem>
                  <SelectItem value="deadline">Deadline Soon</SelectItem>
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
                    <p className="text-2xl font-bold text-primary">
                      {loading ? '...' : stats.availableTasks.toLocaleString()}
                    </p>
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
                    <p className="text-2xl font-bold text-accent">
                      ${loading ? '...' : stats.avgReward.toFixed(2)}
                    </p>
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
                    <p className="text-2xl font-bold">
                      {loading ? '...' : stats.activeWorkers.toLocaleString()}
                    </p>
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
                    <p className="text-2xl font-bold">
                      {loading ? '...' : `${stats.avgTime} min`}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading tasks...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchTasks}>Retry</Button>
              </div>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{task.category || 'General'}</Badge>
                          <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                            ${task.reward} per task
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
                        <CardDescription>
                          {task.description || 'No description provided'}
                        </CardDescription>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => router.push(`/task-detail?id=${task.id}&role=worker`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Detail
                        </Button>
                        <Button onClick={(e) => handleAcceptTask(task.id, e)}>
                          Accept Task
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{task.qty} tasks</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deadline</p>
                        <p className="font-medium">{formatDeadline(task.deadline)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Reward</p>
                        <p className="font-medium text-accent">
                          ${(parseFloat(task.reward) * task.qty).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">{task.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No tasks found matching your criteria
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setCategory('all');
                  fetchTasks();
                }}>
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


