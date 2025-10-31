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
import { tasksApi, submissionsApi, assignmentsApi, uploadApi, reviewsApi, ratingsApi, type Task } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Add type imports
type Assignment = {
  id: string;
  taskId: string;
  workerId: string;
  status: string;
  startedAt: string | null;
  dueAt: string | null;
  createdAt: string;
  submission?: {
    id: string;
    status: string;
    submittedAt: string;
    payloadUrl?: string;
    payloadHash?: string;
  } | null;
};

type Submission = {
  id: string;
  assignmentId: string;
  payloadUrl: string;
  payloadHash: string;
  status: string;
  submittedAt: string;
  qaFlags?: any;
};

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
  const [assignmentDetail, setAssignmentDetail] = useState<Assignment | null>(null);
  const [submissionDetail, setSubmissionDetail] = useState<Submission | null>(null);
  const [workerRating, setWorkerRating] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Submission states
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Review states (for client)
  const [reviewDecision, setReviewDecision] = useState<"approve" | "revision" | "reject" | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewing, setReviewing] = useState(false);

  // Fetch task detail on mount
  useEffect(() => {
    if (taskId && assignmentId) {
      fetchAllData();
    }
  }, [taskId, assignmentId]);

  // Debug: Log state changes
  useEffect(() => {
    console.log('🔄 STATE UPDATE:', {
      taskDetail: !!taskDetail,
      assignmentDetail: !!assignmentDetail,
      submissionDetail: !!submissionDetail,
      submissionId: submissionDetail?.id,
      submissionStatus: submissionDetail?.status,
    });
  }, [taskDetail, assignmentDetail, submissionDetail]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 START FETCH - Params:', { taskId, assignmentId, userRole });
      
      // Fetch task detail (includes assignments)
      const taskResponse = await tasksApi.getTaskById(taskId);
      
      console.log('📦 Task Response:', taskResponse);
      
      if (taskResponse.success) {
        setTaskDetail(taskResponse.data);
        
        console.log('✅ Task data loaded');
        
        // Find the specific assignment from task's assignments (if available)
        const taskData = taskResponse.data as any;
        
        console.log('📋 Task has assignments?', !!taskData.assignments);
        console.log('📋 Assignments array:', taskData.assignments);
        
        if (taskData.assignments && taskData.assignments.length > 0) {
          console.log('✅ Found assignments:', taskData.assignments.length);
          
          // Log each assignment
          taskData.assignments.forEach((a: any, index: number) => {
            console.log(`Assignment ${index + 1}:`, {
              id: a.id,
              status: a.status,
              hasSubmission: !!a.submission,
              submissionId: a.submission?.id,
            });
          });
          
          // For CLIENT: Find ANY submission related to this task
          if (userRole === "client") {
            console.log('👔 CLIENT MODE - Finding any submission...');
            
            // First try to find the specific assignment if assignmentId provided
            let targetAssignment = taskData.assignments.find((a: any) => a.id === assignmentId);
            
            console.log('🔍 Specific assignment found?', !!targetAssignment);
            console.log('🔍 Assignment has submission?', !!targetAssignment?.submission);
            
            // If not found or no assignmentId, find first assignment with submission
            if (!targetAssignment || !targetAssignment.submission) {
              console.log('🔍 Searching for ANY assignment with submission...');
              targetAssignment = taskData.assignments.find((a: any) => a.submission);
              console.log('🔍 Found assignment with submission?', !!targetAssignment);
            }
            
            if (targetAssignment) {
              setAssignmentDetail(targetAssignment);
              console.log('✅ Assignment set:', targetAssignment.id);
              
              // If assignment has submission, fetch full details
              if (targetAssignment.submission?.id) {
                console.log('📄 Fetching submission ID:', targetAssignment.submission.id);
                try {
                  const submissionResponse = await submissionsApi.getSubmissionById(
                    targetAssignment.submission.id
                  );
                  console.log('📦 Submission Response:', submissionResponse);
                  
                  if (submissionResponse.success) {
                    console.log('✅✅✅ SUBMISSION DATA FETCHED:', submissionResponse.data);
                    setSubmissionDetail(submissionResponse.data);
                    console.log('✅✅✅ setSubmissionDetail() CALLED');
                  } else {
                    console.error('⚠️ Submission fetch failed:', submissionResponse);
                  }
                } catch (err) {
                  console.error('❌ ERROR fetching submission:', err);
                }
              } else {
                console.warn('⚠️ Assignment exists but has NO submission object');
              }
            } else {
              console.error('❌ NO assignment found (neither specific nor with submission)');
            }
          } else {
            console.log('👷 WORKER MODE - Using specific assignmentId...');
            
            // For WORKER: Use the specific assignmentId
            const assignment = taskData.assignments.find(
              (a: any) => a.id === assignmentId
            );
            
            console.log('🔍 Assignment found?', !!assignment);
            
            if (assignment) {
              setAssignmentDetail(assignment);
              console.log('✅ Assignment set:', assignment.id);
              
              // If assignment has submission, try to fetch submission details
              if (assignment.submission?.id) {
                console.log('📄 Fetching submission ID:', assignment.submission.id);
                try {
                  const submissionResponse = await submissionsApi.getSubmissionById(
                    assignment.submission.id
                  );
                  console.log('📦 Submission Response:', submissionResponse);
                  
                  if (submissionResponse.success) {
                    console.log('✅✅✅ SUBMISSION DATA FETCHED:', submissionResponse.data);
                    setSubmissionDetail(submissionResponse.data);
                    console.log('✅✅✅ setSubmissionDetail() CALLED');
                  } else {
                    console.error('⚠️ Submission fetch failed:', submissionResponse);
                  }
                } catch (err) {
                  console.error('❌ ERROR fetching submission:', err);
                }
              } else {
                console.warn('⚠️ Assignment has NO submission yet');
              }
            } else {
              console.error('❌ Assignment NOT found in task assignments');
            }
          }
        } else {
          console.error('❌ No assignments array in task data');
        }
      } else {
        console.error('❌ Task fetch failed');
      }

      // Fetch worker rating if available and viewing as client
      if (userRole === "client" && assignmentDetail?.workerId) {
        try {
          const ratingResponse = await ratingsApi.getRatingStats(
            assignmentDetail.workerId
          );
          if (ratingResponse.success) {
            setWorkerRating(ratingResponse.data);
          }
        } catch (err) {
          console.log('Worker rating not available');
        }
      }
    } catch (err: any) {
      console.error('❌ Error fetching data:', err);
      setError(err?.error?.message || 'Failed to load details');
      toast({
        title: "Error",
        description: "Failed to load details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmitReview = async () => {
    if (!reviewDecision) {
      toast({
        title: "Error",
        description: "Please select a review decision",
        variant: "destructive",
      });
      return;
    }

    if (!submissionDetail?.id) {
      toast({
        title: "Error",
        description: "No submission found to review",
        variant: "destructive",
      });
      return;
    }

    try {
      setReviewing(true);

      if (reviewDecision === "approve") {
        const response = await reviewsApi.acceptSubmission({
          submissionId: submissionDetail.id,
          feedback: reviewNote || undefined,
        });

        if (response.success) {
          toast({
            title: "Success!",
            description: "Submission approved and worker will be paid",
          });
          setTimeout(() => router.push("/client-dashboard"), 1500);
        }
      } else if (reviewDecision === "reject") {
        const response = await reviewsApi.rejectSubmission({
          submissionId: submissionDetail.id,
          feedback: reviewNote,
        });

        if (response.success) {
          toast({
            title: "Submission Rejected",
            description: "Worker has been notified",
          });
          setTimeout(() => router.push("/client-dashboard"), 1500);
        }
      } else {
        // Request fix
        const response = await submissionsApi.requestFix(
          submissionDetail.id,
          { feedback: reviewNote }
        );

        if (response.success) {
          toast({
            title: "Revision Requested",
            description: "Worker will resubmit the work",
          });
          setTimeout(() => router.push("/client-dashboard"), 1500);
        }
      }
    } catch (err: any) {
      console.error('Error submitting review:', err);
      toast({
        title: "Error",
        description: err?.error?.message || 'Failed to submit review',
        variant: "destructive",
      });
    } finally {
      setReviewing(false);
    }
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
      
      // OPTION 1: Upload files to server (ACTIVE - using real file upload)
      const uploadResponse = await uploadApi.uploadFiles(submissionFiles);
      
      if (!uploadResponse.success || uploadResponse.files.length === 0) {
        throw new Error('Failed to upload files');
      }

      // Convert relative path to full URL for validation
      // Backend already returns URL with /api prefix (e.g., /api/uploads/files/xxx.pdf)
      // So we only need the base domain without /api
      const baseUrl = 'http://localhost:3000';
      const payloadUrl = `${baseUrl}${uploadResponse.files[0].url}`;
      const payloadHash = uploadResponse.files.map(f => f.filename).join('-');
      
      console.log("Files uploaded:", uploadResponse.files);
      console.log("Full payloadUrl:", payloadUrl); // Should be: http://localhost:3000/api/uploads/files/xxx.jpg
      console.log("Submitting with files:", submissionFiles.map(f => ({ name: f.name, size: f.size })));
      console.log("Notes:", submissionNotes);
      
      const response = await submissionsApi.createSubmission({
        assignmentId: assignmentId,
        payloadUrl: payloadUrl,
        payloadHash: payloadHash,
        metadata: {
          fileSize: uploadResponse.files.reduce((sum, file) => sum + file.size, 0),
          fileName: uploadResponse.files.map(f => f.originalName).join(", "),
          mimeType: uploadResponse.files[0].mimeType
        }
      });

      if (response.success) {
        toast({
          title: "Success!",
          description: "Your work has been submitted for review",
        });
        
        // Wait a bit before redirecting to show the success message
        setTimeout(() => {
          router.push("/worker-dashboard");
        }, 1500);
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
          {/* Debug Panel - Development Only */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-700" />
              <h3 className="font-bold text-yellow-900">Debug Info (Dev Mode)</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="font-semibold text-yellow-800 mb-1">Task Detail:</div>
                <div className={taskDetail ? "text-green-700" : "text-red-700"}>
                  {taskDetail ? "✓ Loaded" : "✗ Not Loaded"}
                </div>
              </div>
              <div>
                <div className="font-semibold text-yellow-800 mb-1">Assignment Detail:</div>
                <div className={assignmentDetail ? "text-green-700" : "text-red-700"}>
                  {assignmentDetail ? `✓ Loaded (${assignmentDetail.id})` : "✗ Not Loaded"}
                </div>
              </div>
              <div>
                <div className="font-semibold text-yellow-800 mb-1">Submission Detail:</div>
                <div className={submissionDetail ? "text-green-700 font-bold" : "text-red-700 font-bold"}>
                  {submissionDetail ? `✓ LOADED (${submissionDetail.id})` : "✗ NOT LOADED"}
                </div>
              </div>
            </div>
            {submissionDetail && (
              <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-xs">
                <div className="font-semibold text-green-900">Submission Data:</div>
                <pre className="text-green-800 mt-1 overflow-auto max-h-32">
                  {JSON.stringify(submissionDetail, null, 2)}
                </pre>
              </div>
            )}
          </div>

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
                    <TabsList className={`grid w-full ${userRole === 'client' ? 'grid-cols-3' : 'grid-cols-2'} bg-gray-100`}>
                      <TabsTrigger value="description" className="data-[state=active]:bg-white">Description</TabsTrigger>
                      {userRole === "worker" && (
                        <TabsTrigger value="submit" className="data-[state=active]:bg-white">Submit Work</TabsTrigger>
                      )}
                      {userRole === "client" && (
                        <TabsTrigger value="review" className="data-[state=active]:bg-white">
                          Review Submission {submissionDetail && <span className="ml-1">●</span>}
                        </TabsTrigger>
                      )}
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

                    {/* Review Tab (for Client) */}
                    {userRole === "client" && (
                      <TabsContent value="review" className="space-y-6 mt-6">
                        {submissionDetail ? (
                          <>
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <h4 className="font-semibold text-blue-900">Review Worker's Submission</h4>
                              </div>
                              <p className="text-sm text-blue-700">
                                Review the submitted work carefully before accepting or rejecting.
                              </p>
                            </div>

                            {/* Submission Details */}
                            <div className="border border-gray-200 rounded-lg bg-white">
                              <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                  <h5 className="font-semibold text-gray-900">Submission Details</h5>
                                  <Badge className={getStatusColor(submissionDetail.status)}>
                                    {submissionDetail.status}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="p-4 space-y-4">
                                {/* Submission Info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Submitted At:</span>
                                    <div className="font-medium text-gray-900 mt-1">
                                      {new Date(submissionDetail.submittedAt).toLocaleString()}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">File Hash:</span>
                                    <div className="font-mono text-xs text-gray-900 mt-1 truncate">
                                      {submissionDetail.payloadHash}
                                    </div>
                                  </div>
                                </div>

                                {/* Download Files Button */}
                                {submissionDetail.payloadUrl && (
                                  <div>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-center border-2 border-[#20A277] text-[#20A277] hover:bg-[#20A277] hover:text-white"
                                      onClick={() => window.open(submissionDetail.payloadUrl, '_blank')}
                                    >
                                      <Download className="mr-2 h-4 w-4" />
                                      Download & Review Submitted Files
                                    </Button>
                                  </div>
                                )}

                                {/* QA Flags if available */}
                                {submissionDetail.qaFlags && (
                                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                    <div className="text-xs font-semibold text-gray-700 mb-2">Quality Checks:</div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-2">
                                        {submissionDetail.qaFlags.checks?.completeness ? (
                                          <CheckCircle className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <XCircle className="h-3 w-3 text-red-600" />
                                        )}
                                        <span>Completeness</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {submissionDetail.qaFlags.checks?.format ? (
                                          <CheckCircle className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <XCircle className="h-3 w-3 text-red-600" />
                                        )}
                                        <span>Valid Format</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {!submissionDetail.qaFlags.checks?.duplicate ? (
                                          <CheckCircle className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <XCircle className="h-3 w-3 text-red-600" />
                                        )}
                                        <span>Not Duplicate</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {submissionDetail.qaFlags.checks?.size ? (
                                          <CheckCircle className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <XCircle className="h-3 w-3 text-red-600" />
                                        )}
                                        <span>Size OK</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Feedback Input */}
                            <div className="space-y-2">
                              <Label htmlFor="review-note" className="text-sm font-semibold text-gray-700">
                                Feedback (Optional for Accept, Required for Reject)
                              </Label>
                              <Textarea
                                id="review-note"
                                placeholder="Provide feedback to the worker..."
                                value={reviewNote}
                                onChange={(e) => setReviewNote(e.target.value)}
                                rows={4}
                                className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                              />
                            </div>

                            {/* Accept & Reject Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Accept Button */}
                              <Button
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={async () => {
                                  try {
                                    setReviewing(true);
                                    const response = await reviewsApi.acceptSubmission({
                                      submissionId: submissionDetail.id,
                                      feedback: reviewNote || undefined,
                                    });

                                    if (response.success) {
                                      toast({
                                        title: "✅ Submission Accepted!",
                                        description: `Worker will receive $${reward.toFixed(2)}`,
                                      });
                                      setTimeout(() => router.push("/client-dashboard"), 1500);
                                    }
                                  } catch (err: any) {
                                    console.error('Error accepting submission:', err);
                                    toast({
                                      title: "Error",
                                      description: err?.error?.message || 'Failed to accept submission',
                                      variant: "destructive",
                                    });
                                  } finally {
                                    setReviewing(false);
                                  }
                                }}
                                disabled={reviewing}
                              >
                                {reviewing ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    Accept & Pay
                                  </>
                                )}
                              </Button>

                              {/* Reject Button */}
                              <Button
                                size="lg"
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={async () => {
                                  if (!reviewNote.trim()) {
                                    toast({
                                      title: "Feedback Required",
                                      description: "Please provide feedback explaining why you're rejecting this submission",
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  try {
                                    setReviewing(true);
                                    const response = await reviewsApi.rejectSubmission({
                                      submissionId: submissionDetail.id,
                                      feedback: reviewNote,
                                    });

                                    if (response.success) {
                                      toast({
                                        title: "❌ Submission Rejected",
                                        description: "Worker has been notified",
                                      });
                                      setTimeout(() => router.push("/client-dashboard"), 1500);
                                    }
                                  } catch (err: any) {
                                    console.error('Error rejecting submission:', err);
                                    toast({
                                      title: "Error",
                                      description: err?.error?.message || 'Failed to reject submission',
                                      variant: "destructive",
                                    });
                                  } finally {
                                    setReviewing(false);
                                  }
                                }}
                                disabled={reviewing}
                              >
                                {reviewing ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="mr-2 h-5 w-5" />
                                    Reject
                                  </>
                                )}
                              </Button>
                            </div>

                            {/* Payment Notice */}
                            <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="text-sm text-green-800">
                                💰 <strong>${reward.toFixed(2)}</strong> will be transferred to worker upon acceptance
                              </div>
                            </div>
                          </>
                        ) : (
                          /* No Submission Yet */
                          <div className="text-center py-12">
                            <div className="flex justify-center mb-4">
                              <div className="bg-gray-100 rounded-full p-6">
                                <Clock className="h-12 w-12 text-gray-400" />
                              </div>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              No Submission Yet
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              The worker hasn't submitted their work yet. Please check back later.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                              <AlertCircle className="h-4 w-4" />
                              Waiting for worker to complete the task
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    )}
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

              {/* Assignment Details */}
              {assignmentDetail && (
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Assignment Details</h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(assignmentDetail.status)}>
                          {assignmentDetail.status}
                        </Badge>
                      </div>
                      {assignmentDetail.startedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Started:</span>
                          <span className="text-gray-900">
                            {new Date(assignmentDetail.startedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {assignmentDetail.dueAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due:</span>
                          <span className="text-gray-900">
                            {new Date(assignmentDetail.dueAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submission Details Card */}
              {submissionDetail && (
                <Card className="border-gray-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Worker Submission</h3>
                      <Badge className={getStatusColor(submissionDetail.status)}>
                        {submissionDetail.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Submitted Time */}
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <div className="text-xs text-gray-600 mb-1">Submitted At</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {new Date(submissionDetail.submittedAt).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.floor((Date.now() - new Date(submissionDetail.submittedAt).getTime()) / (1000 * 60 * 60))} hours ago
                        </div>
                      </div>

                      {/* File Hash */}
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <div className="text-xs text-gray-600 mb-1">File Hash</div>
                        <div className="font-mono text-xs text-gray-900 break-all">
                          {submissionDetail.payloadHash}
                        </div>
                      </div>

                      {/* Download Button */}
                      {submissionDetail.payloadUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-center border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold"
                          onClick={() => window.open(submissionDetail.payloadUrl, '_blank')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Files
                        </Button>
                      )}

                      {/* QA Checks */}
                      {submissionDetail.qaFlags && (
                        <div className="bg-white p-3 rounded-lg border border-blue-100">
                          <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Quality Checks
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Completeness:</span>
                              {submissionDetail.qaFlags.checks?.completeness ? (
                                <Badge className="bg-green-100 text-green-700 text-xs">✓ Pass</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-700 text-xs">✗ Fail</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Format:</span>
                              {submissionDetail.qaFlags.checks?.format ? (
                                <Badge className="bg-green-100 text-green-700 text-xs">✓ Pass</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-700 text-xs">✗ Fail</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">No Duplicate:</span>
                              {!submissionDetail.qaFlags.checks?.duplicate ? (
                                <Badge className="bg-green-100 text-green-700 text-xs">✓ Pass</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-700 text-xs">✗ Fail</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Size:</span>
                              {submissionDetail.qaFlags.checks?.size ? (
                                <Badge className="bg-green-100 text-green-700 text-xs">✓ Pass</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-700 text-xs">✗ Fail</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Overall Status */}
                      <div className={`p-3 rounded-lg border-2 ${
                        submissionDetail.qaFlags?.passed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          {submissionDetail.qaFlags?.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className={`text-sm font-semibold ${
                            submissionDetail.qaFlags?.passed ? 'text-green-800' : 'text-yellow-800'
                          }`}>
                            {submissionDetail.qaFlags?.passed ? 'All Checks Passed' : 'Pending Review'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submission Status */}
              {submissionDetail && (
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Submission Status</h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(submissionDetail.status)}>
                          {submissionDetail.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="text-gray-900">
                          {new Date(submissionDetail.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {submissionDetail.payloadUrl && (
                        <div>
                          <span className="text-gray-600 block mb-1">Files:</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full justify-start text-xs"
                            onClick={() => window.open(submissionDetail.payloadUrl, '_blank')}
                          >
                            <Download className="mr-2 h-3 w-3" />
                            Download Submission
                          </Button>
                        </div>
                      )}
                      {submissionDetail.qaFlags && (
                        <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                          <div className="text-xs font-semibold text-gray-700 mb-2">QA Checks:</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              {submissionDetail.qaFlags.checks?.completeness ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-600" />
                              )}
                              <span>Completeness</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {submissionDetail.qaFlags.checks?.format ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-600" />
                              )}
                              <span>Format</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {submissionDetail.qaFlags.checks?.duplicate ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-600" />
                              )}
                              <span>No Duplicate</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Worker Rating (for client view) */}
              {userRole === "client" && workerRating && (
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Worker Rating</h3>
                    
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-[#20A277]">
                        {workerRating.averageScore.toFixed(1)} ⭐
                      </div>
                      <div className="text-xs text-gray-500">
                        Based on {workerRating.totalRatings} ratings
                      </div>
                    </div>

                    {workerRating.ratingDistribution && (
                      <div className="space-y-2 text-xs">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="w-4">{star}★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                              <div
                                className="h-full bg-[#20A277]"
                                style={{
                                  width: `${(workerRating.ratingDistribution[star] / workerRating.totalRatings) * 100}%`
                                }}
                              />
                            </div>
                            <span className="w-8 text-right text-gray-600">
                              {workerRating.ratingDistribution[star]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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