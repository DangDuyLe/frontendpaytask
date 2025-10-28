"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Clock, CheckCircle, DollarSign, Eye, ExternalLink, Edit, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

const mockTasks = [
  {
    id: "1",
    title: "Verify Restaurant Menu Prices",
    status: "open",
    created: "2 hours ago",
    completed: 27,
    total: 50,
    reward: 5.00,
    pendingReview: 2,
    quantities: [
      { qtyId: "qty-review-1", workerId: "worker-123", workerName: "John Doe", status: "in_review" },
      { qtyId: "qty-2", workerId: "worker-124", workerName: "Jane Smith", status: "completed" },
      { qtyId: "qty-3", workerId: "worker-125", workerName: "Bob Wilson", status: "in_progress" },
    ]
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
    quantities: [
      { qtyId: "qty-review-4", workerId: "worker-126", workerName: "Alice Johnson", status: "in_review" },
    ]
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
    quantities: []
  },
];

export default function ClientDashboard() {
  const router = useRouter();
  const totalSpent = 486.50;
  const activeTasks = 2;
  const totalCompletions = 942;
  const pendingReviews = 20;

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
                    ${totalSpent.toFixed(2)}
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
                    {activeTasks}
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
                    {totalCompletions}
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
                      {pendingReviews > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {pendingReviews}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {pendingReviews}
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
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                  {mockTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`p-6 hover:bg-gray-50 transition-colors rounded-lg border border-gray-100 ${
                        index !== mockTasks.length - 1 ? 'mb-4' : ''
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Task Header */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {task.status === "open" && (
                                <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100 px-2 py-0.5 text-xs">
                                  Open
                                </Badge>
                              )}
                              {task.status === "in_progress" && (
                                <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-100 px-2 py-0.5 text-xs">
                                  In Progress
                                </Badge>
                              )}
                              {task.status === "draft" && (
                                <Badge className="bg-gray-100 text-gray-700 border-0 hover:bg-gray-100 px-2 py-0.5 text-xs">
                                  Draft
                                </Badge>
                              )}
                              <span className="text-xs font-medium text-gray-500">{task.created}</span>
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
                                        style={{ width: `${(task.completed / task.total) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900">{task.completed} / {task.total}</p>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase">Reward</p>
                                <p className="text-lg font-bold text-[#20A277]">${task.reward.toFixed(2)}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase">Pending Review</p>
                                <p className="text-lg font-bold text-orange-600">{task.pendingReview}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase">Total Cost</p>
                                <p className="text-lg font-bold text-gray-900">${(task.completed * task.reward).toFixed(2)}</p>
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
                                  onClick={() => router.push(`/task-detail?id=${task.id}&role=client&draft=true`)}
                                >
                                  <Wallet className="mr-2 h-4 w-4" />
                                  Fund Task
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="outline"
                                className="border-gray-300 hover:bg-gray-50"
                                onClick={() => router.push(`/task-detail?id=${task.id}&role=client`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Active Workers */}
                        {task.quantities && task.quantities.length > 0 && (
                          <div className="border-t border-gray-100 pt-4 mt-4">
                            <h4 className="text-sm font-semibold mb-3 text-gray-700">
                              Active Workers ({task.quantities.length})
                            </h4>
                            <div className="space-y-2">
                              {task.quantities.slice(0, 3).map((qty) => (
                                <div 
                                  key={qty.qtyId}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{qty.workerName}</p>
                                      <p className="text-xs text-gray-500">Qty ID: {qty.qtyId}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      className={
                                        qty.status === "completed" ? "bg-green-100 text-green-700 border-0" :
                                        qty.status === "in_review" ? "bg-orange-100 text-orange-700 border-0" :
                                        "bg-blue-100 text-blue-700 border-0"
                                      }
                                    >
                                      {qty.status.replace(/_/g, " ")}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-[#20A277] hover:text-[#1A8260] hover:bg-green-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/task-flow/${task.id}/${qty.qtyId}?role=client`);
                                      }}
                                    >
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}
                              {task.quantities.length > 3 && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="w-full text-[#20A277] hover:text-[#1A8260] hover:bg-green-50"
                                  onClick={() => router.push(`/task-detail?id=${task.id}&role=client`)}
                                >
                                  View all {task.quantities.length} workers
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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


