"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, DollarSign, TrendingUp, Clock, Award, ExternalLink, ArrowRight, Star, Zap, Target } from "lucide-react";
import { useRouter } from "next/navigation";

const mockAssignments = [
  {
    id: "1",
    taskId: "1",
    qtyId: "qty-1",
    title: "Verify Restaurant Menu Prices",
    status: "in_progress",
    progress: 23,
    total: 50,
    reward: 5.00,
    deadline: "4 hours",
    client: "FoodieData Inc.",
  },
  {
    id: "2",
    taskId: "task-2",
    qtyId: "qty-4",
    title: "Product review moderation",
    status: "pending_review",
    progress: 30,
    total: 30,
    reward: 0.75,
    deadline: "Submitted 2h ago",
    client: "ShopNow Inc",
  },
];

export default function WorkerDashboard() {
  const router = useRouter();
  const totalEarnings = 284.75;
  const completedTasks = 896;
  const activeAssignments = 2;
  const reputation = 4.8;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section with Pattern Background */}
        <div className="relative border-b overflow-hidden bg-card">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          </div>

          <div className="container relative mx-auto px-6 py-12 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-semibold text-accent">2 Active Tasks</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Worker Dashboard
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Track your earnings, manage assignments, and boost your reputation
                </p>
              </div>
              <Link href="/discover-tasks">
                <Button size="lg" className="h-14 px-8 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Search className="mr-2 h-5 w-5" />
                  Discover New Tasks
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-10 max-w-7xl">
          {/* Stats Grid - Enhanced Design */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Earnings Card */}
            <Card className="relative border-2 hover:border-accent/50 transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="relative pt-8 pb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl" />
                    <div className="relative p-4 bg-accent/10 rounded-2xl ring-1 ring-accent/20 group-hover:scale-110 transition-transform">
                      <DollarSign className="h-7 w-7 text-accent" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    +15.8%
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Earnings</p>
                  <p className="text-4xl font-bold text-accent tracking-tight">${totalEarnings.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="text-accent font-semibold">+$45.25</span> this week
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Completed Tasks Card */}
            <Card className="relative border-2 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="relative pt-8 pb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                    <div className="relative p-4 bg-primary/10 rounded-2xl ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
                      <Target className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    +5.2%
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completed</p>
                  <p className="text-4xl font-bold tracking-tight">{completedTasks}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="text-primary font-semibold">+47</span> this week
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Active Tasks Card */}
            <Card className="relative border-2 hover:border-info/50 transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-info/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="relative pt-8 pb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-info/20 rounded-2xl blur-xl" />
                    <div className="relative p-4 bg-info/10 rounded-2xl ring-1 ring-info/20 group-hover:scale-110 transition-transform">
                      <Clock className="h-7 w-7 text-info" />
                    </div>
                  </div>
                  {activeAssignments > 0 && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-info rounded-full animate-ping opacity-75" />
                      <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-info text-background text-xs font-bold">
                        {activeAssignments}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Now</p>
                  <p className="text-4xl font-bold text-info tracking-tight">{activeAssignments}</p>
                  <p className="text-sm text-muted-foreground">In progress</p>
                </div>
              </CardContent>
            </Card>

            {/* Reputation Card */}
            <Card className="relative border-2 hover:border-warning/50 transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="relative pt-8 pb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-warning/20 rounded-2xl blur-xl" />
                    <div className="relative p-4 bg-warning/10 rounded-2xl ring-1 ring-warning/20 group-hover:scale-110 transition-transform">
                      <Star className="h-7 w-7 text-warning fill-warning" />
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold">
                    Top 5%
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reputation</p>
                  <p className="text-4xl font-bold text-warning tracking-tight">{reputation}</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= Math.floor(reputation) ? 'text-warning fill-warning' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Assignments - Enhanced */}
          <Card className="mb-10 border-2 shadow-lg">
            <CardHeader className="pb-6 bg-gradient-to-r from-card to-card/50">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    Active Assignments
                  </CardTitle>
                  <CardDescription className="text-base">
                    Tasks you're currently working on
                  </CardDescription>
                </div>
                {activeAssignments > 0 && (
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="px-4 py-2 text-base font-semibold">
                      {activeAssignments} Active
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5 px-6 pb-8">
              {mockAssignments.map((assignment, index) => (
                <Card 
                  key={assignment.id}
                  className="relative border-2 hover:shadow-2xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden"
                  onClick={() => router.push(`/task-flow/${assignment.taskId}/${assignment.qtyId}`)}
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    assignment.status === "in_progress" ? "bg-gradient-to-r from-info to-info/50" : "bg-gradient-to-r from-warning to-warning/50"
                  }`} />

                  <CardContent className="relative p-8">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            {assignment.status === "in_progress" && (
                              <Badge className="bg-info/10 text-info border-info/20 hover:bg-info/20 px-3 py-1.5">
                                <Clock className="mr-1.5 h-4 w-4" />
                                In Progress
                              </Badge>
                            )}
                            {assignment.status === "pending_review" && (
                              <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 px-3 py-1.5">
                                <Award className="mr-1.5 h-4 w-4" />
                                Pending Review
                              </Badge>
                            )}
                            <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                              {assignment.client}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold flex items-center gap-3 group-hover:text-primary transition-colors">
                            {assignment.title}
                            <ExternalLink className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                          </h3>
                        </div>
                      </div>

                      <Separator />

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Progress</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-secondary rounded-full h-2.5 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-accent to-accent/70 h-2.5 rounded-full transition-all duration-500 relative overflow-hidden"
                                  style={{ width: `${(assignment.progress / assignment.total) * 100}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </div>
                              </div>
                            </div>
                            <p className="text-lg font-bold">{assignment.progress}/{assignment.total}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Reward</p>
                          <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-bold text-accent">${assignment.reward.toFixed(2)}</p>
                            <span className="text-sm text-muted-foreground">/task</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Potential</p>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-primary">${(assignment.total * assignment.reward).toFixed(2)}</p>
                            <TrendingUp className="h-4 w-4 text-primary" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Deadline</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-bold">{assignment.deadline}</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer with Action */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-xs font-mono text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                          ID: {assignment.qtyId}
                        </p>
                        <Button variant="ghost" size="sm" className="group/btn font-semibold">
                          Continue Working
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockAssignments.length === 0 && (
                <div className="text-center py-20">
                  <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-20" />
                    <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-secondary/50 ring-4 ring-secondary/20">
                      <Clock className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No active assignments</h3>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                    Start earning by accepting tasks from our marketplace
                  </p>
                  <Link href="/discover-tasks">
                    <Button size="lg" className="h-12 px-8 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                      <Search className="mr-2 h-5 w-5" />
                      Browse Available Tasks
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Overview - Enhanced */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* This Week Card */}
            <Card className="border-2 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex justify-between items-center py-3 px-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                  <span className="text-sm font-semibold text-muted-foreground">Tasks completed</span>
                  <span className="text-2xl font-bold">47</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-3 px-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                  <span className="text-sm font-semibold text-muted-foreground">Earned</span>
                  <span className="text-2xl font-bold text-accent">$38.25</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-3 px-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                  <span className="text-sm font-semibold text-muted-foreground">Avg. rating</span>
                  <span className="text-2xl font-bold flex items-center gap-2">
                    4.9 
                    <Star className="h-5 w-5 fill-warning text-warning" />
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card className="border-2 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex justify-between items-center py-3 px-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                  <span className="text-sm font-semibold text-muted-foreground">Completion rate</span>
                  <span className="text-2xl font-bold text-accent">98.5%</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-3 px-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                  <span className="text-sm font-semibold text-muted-foreground">Avg. time</span>
                  <span className="text-2xl font-bold">2.8 min</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-3 px-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                  <span className="text-sm font-semibold text-muted-foreground">Early submissions</span>
                  <span className="text-2xl font-bold">89%</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="border-2 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5 text-warning" />
                  </div>
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group/badge">
                    <div className="absolute inset-0 bg-accent/20 rounded-xl blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col items-center p-4 bg-accent/5 rounded-xl border-2 border-accent/20 hover:border-accent/40 transition-all cursor-pointer">
                      <Zap className="h-8 w-8 text-accent mb-2" />
                      <span className="text-xs font-bold text-center">Fast Worker</span>
                    </div>
                  </div>
                  <div className="relative group/badge">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col items-center p-4 bg-primary/5 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all cursor-pointer">
                      <Target className="h-8 w-8 text-primary mb-2" />
                      <span className="text-xs font-bold text-center">Quality Pro</span>
                    </div>
                  </div>
                  <div className="relative group/badge">
                    <div className="absolute inset-0 bg-warning/20 rounded-xl blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col items-center p-4 bg-warning/5 rounded-xl border-2 border-warning/20 hover:border-warning/40 transition-all cursor-pointer">
                      <Star className="h-8 w-8 text-warning fill-warning mb-2" />
                      <span className="text-xs font-bold text-center">Top Rated</span>
                    </div>
                  </div>
                  <div className="relative group/badge">
                    <div className="absolute inset-0 bg-info/20 rounded-xl blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col items-center p-4 bg-info/5 rounded-xl border-2 border-info/20 hover:border-info/40 transition-all cursor-pointer">
                      <Award className="h-8 w-8 text-info mb-2" />
                      <span className="text-xs font-bold text-center">Veteran</span>
                    </div>
                  </div>
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


