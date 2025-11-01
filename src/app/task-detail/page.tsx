'use client';
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { tasksApi, assignmentsApi } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useRouter, useSearchParams } from "next/navigation";
import { 
  Clock, 
  DollarSign, 
  User, 
  Star, 
  MapPin, 
  Award, 
  ExternalLink, 
  CheckCircle2,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Users,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ArrowLeft,
  FileText,
  Calendar,
  Wallet,
  Loader2
} from "lucide-react";

function TaskDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isAuthenticated, userId } = useAuth(); // Lấy userId từ auth
  const id = searchParams.get("id");
  const userRole = searchParams.get("role") || "worker"; // client or worker
  const isDraft = searchParams.get("draft") === "true";
  
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<any>(null);
  const [reviewingQty, setReviewingQty] = useState<string | null>(null);
  const [quickReviewDecision, setQuickReviewDecision] = useState<"approve" | "reject" | "revision" | null>(null);
  const [quickReviewNote, setQuickReviewNote] = useState("");

  // Fetch task detail from API
  useEffect(() => {
    if (!id) {
      setError("Task ID is required");
      setLoading(false);
      return;
    }

    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tasksApi.getTaskById(id);
        
        if (response.success) {
          setTask(response.data);
        } else {
          setError("Failed to load task details");
        }
      } catch (err: any) {
        console.error("Error fetching task detail:", err);
        setError(err?.error?.message || "Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
            <div className="text-center py-12 text-gray-600">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20A277]" />
              Loading task details...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error || !task) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error || "Task not found"}</p>
              <Button onClick={() => router.back()} className="border-gray-300 text-gray-700 hover:bg-gray-50">Go Back</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAcceptTask = async () => {
    if (!task?.id) return;
    if (!userId) { // Check for userId
      toast({
        title: "Authentication Required",
        description: "Please login to accept tasks.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    
    try {
      setAccepting(true);
      
      const response = await assignmentsApi.acceptTask({
        taskId: task.id,
        workerId: userId // Pass workerId
      });

      if (response.success) {
        toast({
          title: "Task Accepted!",
          description: `You have successfully accepted the task. Start working on it now.`,
        });
        
        // Navigate to task flow with the assignment
        router.push(`/task-flow/${task.id}/${response.data.id}`); // Use the returned assignment ID
      }
    } catch (err: any) {
      console.error('Error accepting task:', err);
      toast({
        title: "Error",
        description: err?.error?.message || 'Failed to accept task. Please try again.',
        variant: "destructive",
      });
    } finally {
      setAccepting(false);
    }
  };

  const handleQuickAccept = (quantity: any) => {
    setSelectedQuantity(quantity);
    setShowAcceptDialog(true);
  };

  const handleQuickReview = (qtyId: string) => {
    setReviewingQty(qtyId);
    setQuickReviewDecision(null);
    setQuickReviewNote("");
  };

  const handleSubmitQuickReview = () => {
    console.log("Quick review submitted:", {
      qtyId: reviewingQty,
      decision: quickReviewDecision,
      note: quickReviewNote
    });
    setReviewingQty(null);
    setQuickReviewDecision(null);
    setQuickReviewNote("");
    // In real app: API call to submit review
  };

  const handleFundTask = async () => {
    if (!id) return;
    
    // Check authentication
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to publish a task.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    
    try {
      setAccepting(true); // Use accepting state for loading
      
      console.log('🚀 Publishing task:', id);
      
      // publishTask will automatically include accessToken via getHeaders(true)
      const response = await tasksApi.publishTask(id);
      
      console.log('✅ Publish response:', response);
      
      if (response.success) {
        toast({
          title: "Task Published!",
          description: `Your task has been published successfully and is now available for workers.`,
        });
        
        // Navigate back to client dashboard
        router.push("/client-dashboard");
      }
    } catch (err: any) {
      console.error('❌ Error publishing task:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      
      // Get detailed error message
      const errorMessage = err?.error?.message 
        || err?.error 
        || err?.message 
        || 'Failed to publish task. Please try again.';
      
      const errorDetails = err?.error?.details 
        || err?.details 
        || err?.currentStatus 
        || '';
      
      toast({
        title: "Error Publishing Task",
        description: `${errorMessage}${errorDetails ? ` - ${JSON.stringify(errorDetails)}` : ''}`,
        variant: "destructive",
      });
    } finally {
      setAccepting(false);
    }
  };

  // Calculate costs
  const totalTaskCost = task ? parseFloat(task.reward) * task.qty : 0;
  const platformFee = totalTaskCost * 0.05;
  const totalCost = totalTaskCost + platformFee;

  const confirmQuickAccept = () => {
    // API call to accept
    console.log("Quick accepting:", selectedQuantity);
    setShowAcceptDialog(false);
    router.push(`/task-flow/${task.id}/${selectedQuantity.qtyId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "in_review": return "bg-orange-100 text-orange-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "submitted": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "in_review": return <Clock className="h-4 w-4" />;
      case "in_progress": return <TrendingUp className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(userRole === "client" ? "/client-dashboard" : "/discover-tasks")}
            className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {userRole === "client" ? "Dashboard" : "Discover"}
          </Button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {task.category && <Badge className="mb-3 bg-blue-100 text-blue-700">{task.category}</Badge>}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <p className="text-gray-600">
                {task.qty} position{task.qty > 1 ? 's' : ''} • {task._count?.assignments || 0} assignment{task._count?.assignments !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#20A277]">${parseFloat(task.reward).toFixed(2)}</div>
              <div className="text-sm text-gray-600">per task</div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {task.deadline && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Deadline</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="font-semibold text-gray-900 capitalize">{task.status}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-[#20A277]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Budget</div>
                    <div className="font-semibold text-gray-900">${task.budget || (parseFloat(task.reward) * task.qty).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Description */}
            {task.description && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Task Description</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                </div>
              </div>
            )}

            {/* Client Info */}
            {task.client && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Posted By</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-gray-200">
                        {/* <AvatarImage src={task.client.avatar} /> */}
                        <AvatarFallback className="bg-[#20A277] text-white text-lg">
                          {task.client.email?.[0]?.toUpperCase() || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">{task.client.email}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            Client ID: {task.client.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push(`/profile/${task.client.id}`)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Active Quantities (Client View Only) */}
            {userRole === "client" && task.assignments && task.assignments.length > 0 && (
              <>
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Assignments ({task.assignments.length})</h2>
                        <p className="text-sm text-gray-600 mt-1">Track progress of each worker assignment</p>
                      </div>
                      {/* <Badge className="bg-orange-100 text-orange-700">
                        {task.assignments.filter((a: any) => a.status === "in_review").length} Pending Review
                      </Badge> */}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="text-gray-900 font-semibold">Worker</TableHead>
                            <TableHead className="text-gray-900 font-semibold">Status</TableHead>
                            <TableHead className="text-gray-900 font-semibold">Started</TableHead>
                            <TableHead className="text-gray-900 font-semibold">Due</TableHead>
                            <TableHead className="text-gray-900 font-semibold text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {task.assignments.map((assignment: any) => (
                            <TableRow key={assignment.id} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8 border border-gray-200">
                                    <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">{assignment.worker?.email?.[0]?.toUpperCase() || 'W'}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-sm text-gray-900">{assignment.worker?.email || 'Worker'}</div>
                                    <div className="text-xs text-gray-600">{assignment.workerId.slice(0, 8)}...</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${getStatusColor(assignment.status)} flex items-center gap-1 w-fit`}>
                                  {getStatusIcon(assignment.status)}
                                  {assignment.status.replace(/_/g, " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-xs text-gray-600">
                                  {assignment.startedAt ? new Date(assignment.startedAt).toLocaleDateString() : 'N/A'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-xs text-gray-600">
                                  {assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : 'N/A'}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/task-flow/${task.id}/${assignment.id}?role=client`)}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Funding Section (Draft Tasks - Client View) */}
            {userRole === "client" && isDraft && (
              <div className="bg-white rounded-lg border-2 border-blue-600 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-600" />
                    Fund Task
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Review cost and publish your task</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Cost Summary */}
                  <div className="bg-gray-50 p-6 rounded-lg space-y-3 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Task Cost ({task.qty} × ${parseFloat(task.reward).toFixed(2)})</span>
                        <span className="font-medium text-gray-900">${totalTaskCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Fee (5%)</span>
                        <span className="font-medium text-gray-900">${platformFee.toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-gray-200" />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-semibold text-gray-900">Total Cost</span>
                        <span className="text-3xl font-bold text-blue-600">${totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fund Button */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleFundTask} 
                      className="flex-1 bg-[#20A277] hover:bg-[#1a8d66] text-white"
                      size="lg"
                      disabled={accepting}
                    >
                      {accepting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Wallet className="mr-2 h-4 w-4" />
                          Fund & Publish Task
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg"
                      onClick={() => router.push("/client-dashboard")}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={accepting}
                    >
                      Cancel
                    </Button>
                  </div>

                  <p className="text-xs text-gray-600 text-center">
                    Your task will be published immediately after successful payment
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons (Worker View) */}
            {userRole === "worker" && !isDraft && (
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-[#20A277] hover:bg-[#1a8d66] text-white"
                  onClick={handleAcceptTask}
                  disabled={accepting}
                >
                  {accepting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    'Accept Task'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => router.push("/discover-tasks")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Back to Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Quick Accept Dialog (Logic from Master) */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Review Submission</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to review the submission from <strong>{selectedQuantity?.workerName}</strong> for quantity <strong>{selectedQuantity?.qtyId}</strong>.
              <br /><br />
              This will take you to the task flow page where you can review the submitted work and provide feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmQuickAccept}>
              Continue to Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function TaskDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
            <div className="text-center py-12 text-gray-600">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20A277]" />
              Loading task details...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <TaskDetailContent />
    </Suspense>
  );
};