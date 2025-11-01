"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Award, 
  ExternalLink, 
  ArrowRight, 
  Star, 
  Zap, 
  Target, 
  Sparkles, 
  Trophy,
  Loader2 
} from "lucide-react";
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
        return <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-100 px-2 py-0.5 text-xs">In Progress</Badge>;
      case 'pending_review':
        return <Badge className="bg-orange-100 text-orange-700 border-0 hover:bg-orange-100 px-2 py-0.5 text-xs">Pending Review</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100 px-2 py-0.5 text-xs">Completed</Badge>;
      case 'late':
        return <Badge variant="destructive" className="px-2 py-0.5 text-xs">Late</Badge>;
      case 'expired':
        return <Badge variant="outline" className="px-2 py-0.5 text-xs">Expired</Badge>;
      default:
        return <Badge variant="outline" className="px-2 py-0.5 text-xs">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section - Clean & Minimal */}
        <div className="relative border-b bg-white">
          <div className="container relative mx-auto px-8 lg:px-16 py-12 max-w-[1400px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3 max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Worker Dashboard
                </h1>
                <p className="text-gray-600 text-base leading-relaxed">
                  Track your earnings, manage assignments, and boost your reputation
                </p>
              </div>

              {/* CTA Button - Simple */}
              <Link href="/discover-tasks">
                <Button 
                  size="lg" 
                  className="bg-[#20A277] hover:bg-[#1A8260] text-white font-medium h-11 px-6 shadow-sm hover:shadow transition-all"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Discover Tasks
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 lg:px-16 py-12 max-w-[1400px]">
          {/* Stats Grid - Clean White Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Earnings Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-[#20A277]" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    ${loading ? '...' : stats.totalEarnings.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Completed Tasks Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.completedTasks}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Active Tasks Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg relative">
                      <Clock className="h-5 w-5 text-orange-600" />
                      {!loading && stats.activeAssignments > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {stats.activeAssignments}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-600">Active Now</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.activeAssignments}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reputation Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Reputation</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? '...' : stats.reputation}
                    </p>
                    {!loading && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${
                              star <= Math.floor(stats.reputation) 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Assignments - Clean List */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    My Assignments
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Tasks you're currently working on or have completed
                  </CardDescription>
                </div>
                {!loading && stats.activeAssignments > 0 && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700">
                    {stats.activeAssignments} Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-16 px-6">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20A277]" />
                  <p className="text-gray-600">Loading assignments...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16 px-6">
                  <h3 className="text-xl font-bold text-red-600 mb-2">Error</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
                  <Button onClick={fetchAssignments} className="bg-[#20A277] hover:bg-[#1A8260] text-white font-medium h-11 px-6">
                    Try Again
                  </Button>
                </div>
              ) : assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <div
                    key={assignment.id}
                    className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                      index !== assignments.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                    onClick={() => router.push(`/task-flow/${assignment.taskId}/${assignment.id}`)}
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(assignment.status)}
                            <span className="text-xs font-medium text-gray-500">
                              {assignment.task?.category || 'General'}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-[#20A277] transition-colors flex items-center gap-2">
                            {assignment.task?.title || 'Untitled Task'}
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          </h3>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                          <p className="text-sm font-semibold text-gray-900 capitalize">
                            {assignment.status.replace('_', ' ')}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase">Reward</p>
                          <div className="flex items-baseline gap-1">
                            <p className="text-lg font-bold text-[#20A277]">${parseFloat(assignment.task?.reward || '0').toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase">Started</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {assignment.startedAt 
                              ? new Date(assignment.startedAt).toLocaleDateString()
                              : 'Not started'
                            }
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase">Deadline</p>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            <p className="text-sm font-medium text-gray-900">{formatDeadline(assignment.dueAt)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <p className="text-xs font-mono text-gray-500">
                          ID: {assignment.id}
                        </p>
                        <Button variant="ghost" size="sm" className="text-[#20A277] hover:text-[#1A8260] hover:bg-green-50 font-medium h-8">
                          {assignment.status === 'in_progress' ? 'Continue Working' : 'View Task'}
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No active assignments</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start earning by accepting tasks from our marketplace
                  </p>
                  <Link href="/discover-tasks">
                    <Button className="bg-[#20A277] hover:bg-[#1A8260] text-white font-medium h-11 px-6">
                      <Search className="mr-2 h-4 w-4" />
                      Browse Available Tasks
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}