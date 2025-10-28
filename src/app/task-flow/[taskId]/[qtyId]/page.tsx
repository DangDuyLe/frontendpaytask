'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { assignmentsApi, tasksApi, submissionsApi } from "@/api";
import type { Assignment, Submission } from "@/api";
import { useToast } from "@/hooks/use-toast";

interface TaskFlowData {
  assignment: Assignment | null;
  task: any;
  submission: Submission | null;
  comments: any[];
}

export default function TaskFlowDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const taskId = params.taskId as string;
  const qtyId = params.qtyId as string;
  const assignmentId = qtyId; // qtyId is actually assignmentId
  const roleParam = searchParams.get("role") as "client" | "worker" | null;
  
  // State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [taskFlowData, setTaskFlowData] = useState<TaskFlowData>({
    assignment: null,
    task: null,
    submission: null,
    comments: []
  });
  
  // Auto-detect role based on user session (mock for now)
  const [userRole, setUserRole] = useState<"client" | "worker">(roleParam || "worker");
  
  const [reviewDecision, setReviewDecision] = useState<"approve" | "revision" | "reject" | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  
  // Worker submission state
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);

  // Fetch assignment and task data
  useEffect(() => {
    fetchTaskFlowData();
  }, [assignmentId, taskId]);

  const fetchTaskFlowData = async () => {
    try {
      setLoading(true);
      
      // Fetch assignment details
      const assignmentsResponse = await assignmentsApi.listAssignments();
      const assignment = assignmentsResponse.data.data.find(a => a.id === assignmentId);
      
      if (!assignment) {
        toast({
          title: "Error",
          description: "Assignment not found",
          variant: "destructive",
        });
        router.push("/worker-dashboard");
        return;
      }

      // Fetch task details
      const taskResponse = await tasksApi.getTaskById(taskId);
      const task = taskResponse.data;

      // Fetch submission if exists
      let submission = null;
      if (assignment.submission?.id) {
        try {
          const submissionResponse = await submissionsApi.getSubmissionById(assignment.submission.id);
          submission = submissionResponse.data;
        } catch (error) {
          console.log("No submission yet");
        }
      }

      setTaskFlowData({
        assignment,
        task,
        submission,
        comments: [] // TODO: Add comments API
      });

    } catch (error: any) {
      console.error('Error fetching task flow data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load task flow data",
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
    if (!reviewDecision || !taskFlowData.submission) return;

    try {
      setReviewing(true);

      if (reviewDecision === "revision") {
        await submissionsApi.requestFix(taskFlowData.submission.id, {
          feedback: reviewNote || "Please revise your submission"
        });

        toast({
          title: "Success",
          description: "Revision request sent to worker",
        });
      } else if (reviewDecision === "approve") {
        // TODO: Add approve submission API
        toast({
          title: "Success",
          description: "Submission approved",
        });
      } else if (reviewDecision === "reject") {
        // TODO: Add reject submission API
        toast({
          title: "Success",
          description: "Submission rejected",
        });
      }

      router.push("/client-dashboard");
    } catch (error: any) {
      console.error('Error reviewing submission:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
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

    if (!taskFlowData.assignment) {
      toast({
        title: "Error",
        description: "Assignment not found",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      // TODO: Upload files to S3 first and get URLs
      // For now, using placeholder URL
      const payloadUrl = "https://placeholder-s3-url.com/submission.zip";
      const payloadHash = "placeholder-hash";

      await submissionsApi.createSubmission({
        assignmentId: taskFlowData.assignment.id,
        payloadUrl,
        payloadHash,
        metadata: {
          fileSize: submissionFiles.reduce((acc, f) => acc + f.size, 0),
          fileName: submissionFiles[0].name,
          mimeType: submissionFiles[0].type,
        }
      });

      toast({
        title: "Success",
        description: "Work submitted successfully! It's now under review.",
      });

      // Refresh data
      await fetchTaskFlowData();

    } catch (error: any) {
      console.error('Error submitting work:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit work",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-accent/10 text-accent";
      case "in_review": return "bg-warning/10 text-warning";
      case "in_progress": return "bg-info/10 text-info";
      case "submitted": return "bg-purple-500/10 text-purple-500";
      case "rejected": return "bg-destructive/10 text-destructive";
      default: return "bg-secondary/10 text-secondary-foreground";
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-accent" />;
      case "current": return <AlertCircle className="h-5 w-5 text-warning" />;
      default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 bg-secondary flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="pt-6 text-center">
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Loading task flow...</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!taskFlowData.assignment || !taskFlowData.task) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 bg-secondary flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="font-semibold mb-2">Task Not Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The requested task assignment could not be found.
              </p>
              <Button onClick={() => router.push("/worker-dashboard")}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const { assignment, task, submission } = taskFlowData;
  const deadline = assignment.dueAt || task.deadline;
  const timeRemaining = deadline ? new Date(deadline).getTime() - new Date().getTime() : 0;
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{task.title}</h1>
                <Badge className={getStatusColor(assignment.status)}>
                  {assignment.status.replace(/_/g, " ").toUpperCase()}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Task ID: {task.id} • Assignment ID: {assignment.id} • Viewing as: <strong>{userRole}</strong>
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">${task.reward}</div>
              <div className="text-sm text-muted-foreground">Reward per completion</div>
            </div>
          </div>

          {/* Deadline Alert */}
          {userRole === "worker" && !submission && hoursRemaining < 24 && hoursRemaining > 0 && (
            <Card className="mb-6 border-warning">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <div>
                    <div className="font-semibold text-warning">Deadline approaching!</div>
                    <div className="text-sm text-muted-foreground">
                      {hoursRemaining} hours remaining until {deadline ? new Date(deadline).toLocaleString() : 'deadline'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs for Worker View */}
              {userRole === "worker" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Workspace</CardTitle>
                    <CardDescription>Track progress and submit your work</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={submission ? "progress" : "submit"} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="instructions">Instructions</TabsTrigger>
                        <TabsTrigger value="submit">Submit Work</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                      </TabsList>

                      {/* Instructions Tab */}
                      <TabsContent value="instructions" className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Task Description</h4>
                          <p className="text-sm text-foreground">{task.description || 'No description available'}</p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-accent" />
                            Task Details
                          </h4>
                          <div className="space-y-1 text-sm text-foreground ml-6">
                            <p>• Category: {task.category || 'General'}</p>
                            <p>• Reward: ${task.reward}</p>
                            {deadline && <p>• Deadline: {new Date(deadline).toLocaleString()}</p>}
                          </div>
                        </div>
                        <div className="bg-secondary/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Assignment Status</h4>
                          <div className="text-sm space-y-1">
                            <p>Status: <strong className="capitalize">{assignment.status.replace(/_/g, ' ')}</strong></p>
                            <p>Started: <strong>{assignment.startedAt ? new Date(assignment.startedAt).toLocaleString() : 'Not started'}</strong></p>
                            {assignment.dueAt && <p>Due: <strong>{new Date(assignment.dueAt).toLocaleString()}</strong></p>}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Submit Work Tab */}
                      <TabsContent value="submit" className="space-y-4">
                        {submission ? (
                          <div className="bg-accent/10 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-5 w-5 text-accent" />
                              <h4 className="font-semibold text-accent">Work Already Submitted</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Your work was submitted on {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'recently'}
                              and is currently under review.
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* TODO: Integrate S3 file upload service for file storage */}
                            <div className="space-y-2">
                              <Label htmlFor="file-upload">Upload Files (Required)</Label>
                              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                <Input
                                  id="file-upload"
                                  type="file"
                                  multiple
                                  accept="image/*,.pdf,.json,.zip"
                                  onChange={handleFileChange}
                                  className="hidden"
                                  disabled={submitting}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                  <p className="text-sm font-medium">Click to upload files</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Images, PDF, JSON, ZIP up to 10MB each
                                  </p>
                                </label>
                              </div>
                              {submissionFiles.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium mb-2">Selected files ({submissionFiles.length}):</p>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {submissionFiles.map((file, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-accent" />
                                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="notes">Additional Notes (Optional)</Label>
                              <Textarea
                                id="notes"
                                placeholder="Add any relevant notes about your work, challenges faced, or observations..."
                                value={submissionNotes}
                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                rows={5}
                                disabled={submitting}
                              />
                            </div>

                            <Button 
                              size="lg" 
                              className="w-full bg-accent hover:bg-accent/90 text-white"
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
                          </>
                        )}
                      </TabsContent>

                      {/* Progress Tab */}
                      <TabsContent value="progress" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <CheckCircle className="h-5 w-5 text-accent" />
                              <div className="w-0.5 h-12 mt-2 bg-accent" />
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold">Task Assigned</h4>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(assignment.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">Assignment created</p>
                            </div>
                          </div>

                          {assignment.startedAt && (
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <CheckCircle className="h-5 w-5 text-accent" />
                                {!submission && <div className="w-0.5 h-12 mt-2 bg-accent" />}
                                {submission && <div className="w-0.5 h-12 mt-2 bg-accent" />}
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold">In Progress</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(assignment.startedAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">Worker started working</p>
                              </div>
                            </div>
                          )}

                          {submission && (
                            <>
                              <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <CheckCircle className="h-5 w-5 text-accent" />
                                  <div className="w-0.5 h-12 mt-2 bg-muted" />
                                </div>
                                <div className="flex-1 pb-4">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold">Submitted</h4>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(submission.submittedAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">Work submitted for review</p>
                                </div>
                              </div>

                              <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <AlertCircle className="h-5 w-5 text-warning" />
                                </div>
                                <div className="flex-1 pb-4">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold">Under Review</h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground">Client is reviewing the submission</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Client View - Progress Timeline */}
              {userRole === "client" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Task Progress Timeline</CardTitle>
                    <CardDescription>Track the current status and history of this assignment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Assignment Created */}
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <CheckCircle className="h-5 w-5 text-accent" />
                          <div className="w-0.5 h-16 mt-2 bg-accent" />
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">Assignment Created</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(assignment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">Task assigned to worker</p>
                        </div>
                      </div>

                      {/* Started */}
                      {assignment.startedAt && (
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <CheckCircle className="h-5 w-5 text-accent" />
                            {submission && <div className="w-0.5 h-16 mt-2 bg-accent" />}
                            {!submission && <div className="w-0.5 h-16 mt-2 bg-muted" />}
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold">In Progress</h4>
                              <span className="text-xs text-muted-foreground">
                                {new Date(assignment.startedAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">Worker started working on task</p>
                          </div>
                        </div>
                      )}

                      {/* Submitted */}
                      {submission && (
                        <>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <CheckCircle className="h-5 w-5 text-accent" />
                              <div className="w-0.5 h-16 mt-2 bg-muted" />
                            </div>
                            <div className="flex-1 pb-8">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold">Submitted</h4>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(submission.submittedAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">Work submitted for review</p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <AlertCircle className="h-5 w-5 text-warning" />
                            </div>
                            <div className="flex-1 pb-8">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold">Under Review</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">Awaiting client review</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submission Details (Both views when submitted) */}
              {submission && (
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Details</CardTitle>
                    <CardDescription>
                      Submitted on {new Date(submission.submittedAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Submission File
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">Submission Data</div>
                              <div className="text-xs text-muted-foreground">
                                URL: {submission.payloadUrl}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={submission.payloadUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        QA Status
                      </h4>
                      <div className="bg-secondary/50 p-3 rounded-lg space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Status:</span>
                          <Badge className={submission.qaFlags.passed ? "bg-accent" : "bg-warning"}>
                            {submission.qaFlags.passed ? "Passed" : "Needs Review"}
                          </Badge>
                        </div>
                        {submission.earlySubmission && (
                          <div className="flex items-center justify-between text-sm">
                            <span>Early Submission Bonus:</span>
                            <span className="text-accent font-medium">+{submission.bonusPoints} points</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review Actions (Client Only) */}
                    {userRole === "client" && submission.status === "submitted" && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="font-semibold">Review Submission</h4>
                          
                          <div className="flex gap-3">
                            <Button
                              variant={reviewDecision === "approve" ? "default" : "outline"}
                              className={reviewDecision === "approve" ? "bg-accent hover:bg-accent/90" : ""}
                              onClick={() => handleReview("approve")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant={reviewDecision === "revision" ? "default" : "outline"}
                              className={reviewDecision === "revision" ? "bg-warning hover:bg-warning/90" : ""}
                              onClick={() => handleReview("revision")}
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Request Revision
                            </Button>
                            <Button
                              variant={reviewDecision === "reject" ? "destructive" : "outline"}
                              onClick={() => handleReview("reject")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>

                          {reviewDecision && (
                            <div className="space-y-3">
                              <Textarea
                                placeholder="Add feedback for the worker..."
                                value={reviewNote}
                                onChange={(e) => setReviewNote(e.target.value)}
                                rows={4}
                                disabled={reviewing}
                              />
                              <div className="flex gap-3">
                                <Button 
                                  onClick={handleSubmitReview}
                                  className="bg-primary hover:bg-primary/90"
                                  disabled={reviewing}
                                >
                                  {reviewing ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Submitting...
                                    </>
                                  ) : (
                                    "Submit Review"
                                  )}
                                </Button>
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    setReviewDecision(null);
                                    setReviewNote("");
                                  }}
                                  disabled={reviewing}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Deadline</div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      {deadline ? new Date(deadline).toLocaleString() : 'No deadline set'}
                    </div>
                    {deadline && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {hoursRemaining > 0 ? `${hoursRemaining} hours remaining` : "Overdue"}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Reward</div>
                    <div className="text-xl font-bold text-accent">${task.reward}</div>
                    <div className="text-xs text-muted-foreground">Per completion</div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Assignment Status</div>
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Task ID:</span>
                      <span className="font-mono">{task.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assignment ID:</span>
                      <span className="font-mono">{assignment.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Worker Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Worker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {assignment.workerId.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Worker</div>
                      <div className="text-sm text-muted-foreground">ID: {assignment.workerId}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>CL</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Client</div>
                      <div className="text-sm text-muted-foreground">Task Owner</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push(`/task-detail?id=${task.id}&role=${userRole}`)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Full Task
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push(userRole === "client" ? "/client-dashboard" : "/worker-dashboard")}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
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
