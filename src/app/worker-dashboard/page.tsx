"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, DollarSign, TrendingUp, Clock, Award, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { assignmentsApi, type Assignment } from "@/api";
import { useAuth } from "@/contexts/AuthContext";

export default function WorkerDashboard() {
  const router = useRouter();
  const { user, userId, isAuthenticated } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedTasks: 0,
    activeAssignments: 0,
    reputation: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (userId) {
      fetchAssignments();
    }
  }, [isAuthenticated, userId]);

  const fetchAssignments = async () => {
    if (!userId) return; // Wait for userId to be available
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch active assignments with userId
      const response = await assignmentsApi.getMyAssignments(userId);
      
      if (response.success) {
        setAssignments(response.data);
        
        // Calculate stats
        const activeCount = response.data.filter(
          a => a.status === 'in_progress' || a.status === 'pending_review'
        ).length;
        
        const completedCount = response.data.filter(
          a => a.status === 'completed'
        ).length;
        
        const totalEarnings = response.data
          .filter(a => a.status === 'completed')
          .reduce((sum, a) => sum + parseFloat(a.task?.reward || '0'), 0);
        
        setStats({
          totalEarnings,
          completedTasks: completedCount,
          activeAssignments: activeCount,
          reputation: 4.8, // TODO: Get from user profile API
        });
      }
    } catch (err: any) {
      console.error('Error fetching assignments:', err);
      setError(err?.error?.message || 'Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDeadline = (dueAt: string | null) => {
    if (!dueAt) return 'No deadline';
    
    const deadline = new Date(dueAt);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return 'Urgent';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-info/10 text-info">In Progress</Badge>;
      case 'pending_review':
        return <Badge className="bg-warning/10 text-warning">Pending Review</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-600">Completed</Badge>;
      case 'late':
        return <Badge variant="destructive">Late</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
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
              <h1 className="text-3xl font-bold mb-2">Worker Dashboard</h1>
              <p className="text-muted-foreground">Track your earnings and manage assignments</p>
            </div>
            <Link href="/discover-tasks">
              <Button size="lg">
                <Search className="mr-2 h-4 w-4" />
                Discover New Tasks
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold text-accent">
                      ${loading ? '...' : stats.totalEarnings.toFixed(2)}
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
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-primary">
                      {loading ? '...' : stats.completedTasks}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-info">
                      {loading ? '...' : stats.activeAssignments}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-info" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Reputation</p>
                    <p className="text-2xl font-bold text-warning">
                      {loading ? '...' : stats.reputation} ⭐
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Assignments */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>My Assignments</CardTitle>
              <CardDescription>All your tasks - active, completed, and more</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading assignments...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={fetchAssignments}>Retry</Button>
                </div>
              ) : assignments.length > 0 ? (
                assignments.map((assignment) => (
                    <Card 
                      key={assignment.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => router.push(`/task-flow/${assignment.taskId}`)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(assignment.status)}
                              <span className="text-sm text-muted-foreground">
                                {assignment.task?.category || 'General'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className="text-lg font-semibold">
                                {assignment.task?.title || 'Untitled Task'}
                              </h3>
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="grid md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Status</p>
                                <p className="font-medium capitalize">
                                  {assignment.status.replace('_', ' ')}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Reward</p>
                                <p className="font-medium">${assignment.task?.reward || '0.00'}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Started</p>
                                <p className="font-medium">
                                  {assignment.startedAt 
                                    ? new Date(assignment.startedAt).toLocaleDateString()
                                    : 'Not started'
                                  }
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Deadline</p>
                                <p className="font-medium">{formatDeadline(assignment.dueAt)}</p>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground">
                              Assignment ID: {assignment.id} • Task ID: {assignment.taskId}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No active assignments</p>
                  <Link href="/discover-tasks">
                    <Button>
                      <Search className="mr-2 h-4 w-4" />
                      Find Tasks
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tasks completed:</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Earned:</span>
                    <span className="font-medium text-accent">$38.25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. rating:</span>
                    <span className="font-medium">4.9 ⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion rate:</span>
                    <span className="font-medium text-accent">98.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. time:</span>
                    <span className="font-medium">2.8 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Early submissions:</span>
                    <span className="font-medium">89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-accent/10 text-accent">Fast Worker</Badge>
                  <Badge className="bg-primary/10 text-primary">Quality Pro</Badge>
                  <Badge className="bg-warning/10 text-warning">Top Rated</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


