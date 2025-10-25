"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, DollarSign, TrendingUp, Clock, Award } from "lucide-react";

const mockAssignments = [
  {
    id: "1",
    title: "Label images for AI training",
    status: "in_progress",
    progress: 23,
    total: 50,
    reward: 0.50,
    deadline: "4 hours",
    client: "TechCorp AI",
  },
  {
    id: "2",
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
  const totalEarnings = 284.75;
  const completedTasks = 896;
  const activeAssignments = 2;
  const reputation = 4.8;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-6 py-8">
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
                    <p className="text-2xl font-bold text-accent">${totalEarnings.toFixed(2)}</p>
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
                    <p className="text-2xl font-bold text-primary">{completedTasks}</p>
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
                    <p className="text-2xl font-bold text-info">{activeAssignments}</p>
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
                    <p className="text-2xl font-bold text-warning">{reputation} ⭐</p>
                  </div>
                  <Award className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Assignments */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Active Assignments</CardTitle>
              <CardDescription>Tasks you're currently working on</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {assignment.status === "in_progress" && (
                            <Badge className="bg-info/10 text-info">In Progress</Badge>
                          )}
                          {assignment.status === "pending_review" && (
                            <Badge className="bg-warning/10 text-warning">Pending Review</Badge>
                          )}
                          <span className="text-sm text-muted-foreground">{assignment.client}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-3">{assignment.title}</h3>
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Progress</p>
                            <p className="font-medium">{assignment.progress} / {assignment.total}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Reward</p>
                            <p className="font-medium">${assignment.reward} per task</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Potential Earnings</p>
                            <p className="font-medium text-accent">
                              ${(assignment.total * assignment.reward).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Deadline</p>
                            <p className="font-medium">{assignment.deadline}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        {assignment.status === "in_progress" ? (
                          <Button>Continue Work</Button>
                        ) : (
                          <Button variant="outline">View Status</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockAssignments.length === 0 && (
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
