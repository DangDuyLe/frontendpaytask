'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Upload,
  User,
  Calendar,
  ArrowRight,
  Download,
  Loader2
} from "lucide-react";
import { tasksApi, submissionsApi, assignmentsApi, type Task } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function TaskFlowDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { userId } = useAuth();
  
  const taskId = params.taskId as string;
  const assignmentId = params.qtyId as string; // qtyId is actually assignmentId
  const roleParam = searchParams.get("role") as "client" | "worker" | null;
  
  const [userRole, setUserRole] = useState<"client" | "worker">(roleParam || "worker");
  const [loading, setLoading] = useState(true);
  const [taskDetail, setTaskDetail] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Submission states
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Review states (for client)
  const [reviewDecision, setReviewDecision] = useState<"approve" | "revision" | "reject" | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  // Fetch task detail on mount
  useEffect(() => {
    if (taskId) {
      fetchTaskDetail();
    }
  }, [taskId]);

  const fetchTaskDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tasksApi.getTaskById(taskId);
      
      if (response.success) {
        setTaskDetail(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching task detail:', err);
      setError(err?.error?.message || 'Failed to load task details');
      toast({
        title: "Error",
        description: "Failed to load task details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (decision: "approve" | "revision" | "reject") => {
    setReviewDecision(decision);
  };

  const handleSubmitReview = () => {
    console.log("Review decision:", reviewDecision, "Note:", reviewNote);
    router.push("/client-dashboard");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSubmissionFiles(Array.from(e.target.files));
    }
  };

  const handleSubmitWork = async () => {
    if (submissionFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one file",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit work",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    try {
      setSubmitting(true);
      
      // TODO: Upload files to S3 or file storage service
      // For now, we'll create a mock payload URL
      const payloadUrl = "https://example.com/submissions/" + assignmentId;
      const payloadHash = "mock-hash-" + Date.now();
      
      const response = await submissionsApi.createSubmission({
        assignmentId: assignmentId,
        payloadUrl: payloadUrl,
        payloadHash: payloadHash,
        metadata: {
          fileSize: submissionFiles.reduce((sum, file) => sum + file.size, 0),
          fileName: submissionFiles[0].name,
          mimeType: submissionFiles[0].type,
        }
      });

      if (response.success) {
        toast({
          title: "Success!",
          description: "Your work has been submitted for review",
        });
        router.push("/worker-dashboard");
      }
    } catch (err: any) {
      console.error('Error submitting work:', err);
      toast({
        title: "Error",
        description: err?.error?.message || 'Failed to submit work. Please try again.',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "in_review": return "bg-yellow-100 text-yellow-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "submitted": return "bg-purple-100 text-purple-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "current": return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading task details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !taskDetail) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Task not found'}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const deadline = taskDetail.deadline ? new Date(taskDetail.deadline) : null;
  const timeRemaining = deadline ? deadline.getTime() - new Date().getTime() : 0;
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const reward = parseFloat(taskDetail.reward);
  const totalReward = reward * taskDetail.qty;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{taskDetail.title}</h1>
                  <Badge className={getStatusColor(taskDetail.status)}>
                    {taskDetail.status.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                </div>
                <p className="text-gray-600">
                  Task ID: {taskId} • Assignment ID: {assignmentId} • Viewing as: <strong>{userRole}</strong>
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#20A277]">${totalReward.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Reward ({taskDetail.qty} × ${reward.toFixed(2)})</div>
              </div>
            </div>
          </div>

          {/* Deadline Alert */}
          {userRole === "worker" && deadline && hoursRemaining > 0 && hoursRemaining < 24 && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-semibold text-yellow-800">Deadline approaching!</div>
                    <div className="text-sm text-yellow-700">
                      {hoursRemaining} hours remaining until {deadline.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Task Detail Section */}
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
                    <p className="text-gray-600 mt-1">Complete task information and requirements</p>
                  </div>

                  <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                      <TabsTrigger value="description" className="data-[state=active]:bg-white">Description</TabsTrigger>
                      <TabsTrigger value="submit" className="data-[state=active]:bg-white">Submit Work</TabsTrigger>
                    </TabsList>

                    {/* Description Tab */}
                    <TabsContent value="description" className="space-y-4 mt-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Task Description</h4>
                        <p className="text-sm text-gray-600">
                          {taskDetail.description || 'No description provided'}
                        </p>
                      </div>
                      <Separator className="bg-gray-200" />
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Task Info</h4>
                        <div className="text-sm space-y-2 text-gray-600">
                          <div className="flex justify-between">
                            <span>Category:</span>
                            <strong className="text-gray-900">{taskDetail.category || 'General'}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Quantity:</span>
                            <strong className="text-gray-900">{taskDetail.qty}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Reward per item:</span>
                            <strong className="text-gray-900">${reward.toFixed(2)}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Reward:</span>
                            <strong className="text-[#20A277]">${totalReward.toFixed(2)}</strong>
                          </div>
                          {deadline && (
                            <div className="flex justify-between">
                              <span>Deadline:</span>
                              <strong className="text-gray-900">{deadline.toLocaleDateString()}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Submit Work Tab */}
                    <TabsContent value="submit" className="space-y-4 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="file-upload" className="text-sm font-semibold text-gray-700">
                          Upload Files (Required)
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#20A277] transition-colors cursor-pointer">
                          <Input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*,.pdf,.json,.zip"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm font-medium text-gray-900">Click to upload files</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Images, PDF, JSON, ZIP up to 10MB each
                            </p>
                          </label>
                        </div>
                        {submissionFiles.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              Selected files ({submissionFiles.length}):
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {submissionFiles.map((file, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                          Additional Notes (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Add any relevant notes about your work..."
                          value={submissionNotes}
                          onChange={(e) => setSubmissionNotes(e.target.value)}
                          rows={5}
                          className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                        />
                      </div>

                      <Button 
                        size="lg" 
                        className="w-full bg-[#20A277] hover:bg-[#1a8a63] text-white"
                        onClick={handleSubmitWork}
                        disabled={submitting || submissionFiles.length === 0}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Work for Review
                          </>
                        )}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Info */}
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Task Information</h3>
                  
                  <div className="space-y-4">
                    {deadline && (
                      <>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Deadline</div>
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <Calendar className="h-4 w-4" />
                            {deadline.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {hoursRemaining > 0 ? `${hoursRemaining} hours remaining` : "Overdue"}
                          </div>
                        </div>
                        <Separator className="bg-gray-200" />
                      </>
                    )}

                    <div>
                      <div className="text-sm text-gray-600 mb-1">Reward</div>
                      <div className="text-xl font-bold text-[#20A277]">${totalReward.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{taskDetail.qty} items × ${reward.toFixed(2)}</div>
                    </div>

                    <Separator className="bg-gray-200" />

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Task ID:</span>
                        <span className="font-mono text-gray-900">{taskId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assignment ID:</span>
                        <span className="font-mono text-gray-900">{assignmentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(taskDetail.status)}>
                          {taskDetail.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Info */}
              {taskDetail.client && (
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Client</h3>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback>
                          {taskDetail.client.email?.[0]?.toUpperCase() || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {taskDetail.client.email}
                        </div>
                        <div className="text-sm text-gray-600">ID: {taskDetail.client.id}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-300 hover:bg-gray-50"
                      onClick={() => router.push("/worker-dashboard")}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Back to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}