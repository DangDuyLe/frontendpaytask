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
  const { isAuthenticated } = useAuth();
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
        <main className="flex-1 bg-secondary">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <div className="text-center py-12">Loading task details...</div>
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
        <main className="flex-1 bg-secondary">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error || "Task not found"}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAcceptTask = async () => {
    if (!task?.id) return;
    
    try {
      setAccepting(true);
      
      const response = await assignmentsApi.acceptTask({
        taskId: task.id,
      });

      if (response.success) {
        toast({
          title: "Task Accepted!",
          description: `You have successfully accepted the task. Start working on it now.`,
        });
        
        // Navigate to task flow with the assignment
        router.push(`/task-flow/${task.id}`);
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
      case "completed": return "bg-accent/10 text-accent";
      case "in_review": return "bg-warning/10 text-warning";
      case "in_progress": return "bg-info/10 text-info";
      case "submitted": return "bg-purple-500/10 text-purple-500";
      default: return "bg-secondary/10 text-secondary-foreground";
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
      
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(userRole === "client" ? "/client-dashboard" : "/worker-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          {/* Task Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {task.category && <Badge className="mb-2">{task.category}</Badge>}
                  <CardTitle className="text-3xl mb-2">{task.title}</CardTitle>
                  <CardDescription className="text-base">
                    {task.qty} position{task.qty > 1 ? 's' : ''} • {task._count?.assignments || 0} assignment{task._count?.assignments !== 1 ? 's' : ''} 
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-accent">${parseFloat(task.reward).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">per task</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {task.deadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Deadline</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-sm text-muted-foreground capitalize">{task.status}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Budget</div>
                    <div className="text-sm text-muted-foreground">${task.budget || (parseFloat(task.reward) * task.qty).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Description */}
          {task.description && (
            <Card>
              <CardHeader>
                <CardTitle>Task Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{task.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Requirements - Hidden for now since not in API */}
          {/* <Card>...</Card> */}

          {/* Client Info */}
          {task.client && (
            <Card>
              <CardHeader>
                <CardTitle>Posted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{task.client.email?.[0]?.toUpperCase() || 'C'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{task.client.email}</div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Client ID: {task.client.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => router.push(`/profile/${task.client.id}`)}>
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Quantities (Client View Only) */}
          {userRole === "client" && task.assignments && task.assignments.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Assignments ({task.assignments.length})</CardTitle>
                      <CardDescription>Track progress of each worker assignment</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Worker</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>Due</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {task.assignments.map((assignment: any) => (
                          <TableRow key={assignment.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{assignment.worker?.email?.[0]?.toUpperCase() || 'W'}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">{assignment.worker?.email || 'Worker'}</div>
                                  <div className="text-xs text-muted-foreground">{assignment.workerId.slice(0, 8)}...</div>
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
                              <div className="text-xs text-muted-foreground">
                                {assignment.startedAt ? new Date(assignment.startedAt).toLocaleDateString() : 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs text-muted-foreground">
                                {assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/task-flow/${task.id}/${assignment.id}?role=client`)}
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
                </CardContent>
              </Card>
            </>
          )}

          {/* Quick Review Dialog - Removed for now since we don't have active review functionality */}

          {/* Funding Section (Draft Tasks - Client View) */}
          {userRole === "client" && isDraft && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Fund Task
                </CardTitle>
                <CardDescription>Review cost and publish your task</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cost Summary */}
                <div className="bg-secondary/50 p-6 rounded-lg space-y-3">
                  <h3 className="font-semibold mb-3">Cost Breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Task Cost ({task.qty} × ${parseFloat(task.reward).toFixed(2)})</span>
                      <span className="font-medium">${totalTaskCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee (5%)</span>
                      <span className="font-medium">${platformFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold">Total Cost</span>
                      <span className="text-3xl font-bold text-primary">${totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Fund Button */}
                <div className="flex gap-3">
                  <Button 
                    onClick={handleFundTask} 
                    className="flex-1 bg-primary hover:bg-primary/90"
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
                    disabled={accepting}
                  >
                    Cancel
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Your task will be published immediately after successful payment
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons (Worker View) */}
          {userRole === "worker" && (
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-accent hover:bg-accent/90 text-white"
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
              <Button variant="outline" size="lg" onClick={() => router.push("/discover-tasks")}>
                Back to Search
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Quick Accept Dialog */}
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
        <main className="flex-1 bg-secondary">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <div className="text-center py-12">Loading task details...</div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <TaskDetailContent />
    </Suspense>
  );
};



