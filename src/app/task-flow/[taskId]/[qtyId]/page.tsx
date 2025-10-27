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
  Download
} from "lucide-react";

// Mock data - would come from API based on taskId and qtyId
const getMockTaskFlow = (taskId: string, qtyId: string) => ({
  id: `flow-${qtyId}`,
  taskId: taskId,
  taskTitle: "Label images for AI training",
  qtyId: qtyId,
  workerId: "worker-123",
  workerName: "John Doe",
  workerAvatar: "/placeholder.svg",
  clientId: "client-456",
  clientName: "TechCorp AI",
  clientAvatar: "/placeholder.svg",
  quantityAmount: 50,
  completed: 23,
  reward: 0.50,
  totalReward: 25.00, // 50 * 0.50
  status: "in_progress", // assigned, in_progress, submitted, in_review, revision_requested, completed, rejected
  createdAt: "2025-10-26T08:00:00",
  acceptedAt: "2025-10-26T08:30:00",
  startedAt: "2025-10-26T09:00:00",
  submittedAt: null,
  deadline: "2025-10-30T18:00:00",
  
  taskDescription: "Label 50 images with appropriate categories and tags. Each image must be reviewed carefully and tagged with relevant metadata.",
  taskRequirements: [
    "Must have a smartphone with camera",
    "Must be located within 5km of restaurant", 
    "Must complete during restaurant operating hours"
  ],
  
  steps: [
    {
      id: 1,
      name: "Task Assigned",
      status: "completed",
      timestamp: "2025-10-26T08:00:00",
      description: "Task quantity assigned to worker"
    },
    {
      id: 2,
      name: "Accepted",
      status: "completed",
      timestamp: "2025-10-26T08:30:00",
      description: "Worker accepted the task"
    },
    {
      id: 3,
      name: "In Progress",
      status: "current",
      timestamp: "2025-10-26T09:00:00",
      description: "Worker is currently working"
    },
    {
      id: 4,
      name: "Submitted",
      status: "pending",
      timestamp: null,
      description: "Work submitted for review"
    },
    {
      id: 5,
      name: "Under Review",
      status: "pending",
      timestamp: null,
      description: "Client is reviewing the submission"
    },
    {
      id: 6,
      name: "Completed",
      status: "pending",
      timestamp: null,
      description: "Task completed and payment released"
    }
  ],
  
  submission: null, // Will be populated when worker submits
  
  comments: [
    {
      id: 1,
      author: "John Doe",
      authorRole: "worker",
      avatar: "/placeholder.svg",
      message: "Started working on this task. Estimated completion in 4 hours.",
      timestamp: "2025-10-26T09:00:00"
    }
  ]
});

// Mock submitted task flow
const getMockSubmittedTaskFlow = (taskId: string, qtyId: string) => ({
  ...getMockTaskFlow(taskId, qtyId),
  status: "in_review",
  submittedAt: "2025-10-26T14:00:00",
  completed: 50,
  steps: [
    {
      id: 1,
      name: "Task Assigned",
      status: "completed",
      timestamp: "2025-10-26T08:00:00",
      description: "Task quantity assigned to worker"
    },
    {
      id: 2,
      name: "Accepted",
      status: "completed",
      timestamp: "2025-10-26T08:30:00",
      description: "Worker accepted the task"
    },
    {
      id: 3,
      name: "In Progress",
      status: "completed",
      timestamp: "2025-10-26T09:00:00",
      description: "Worker started working"
    },
    {
      id: 4,
      name: "Submitted",
      status: "completed",
      timestamp: "2025-10-26T14:00:00",
      description: "Work submitted for review"
    },
    {
      id: 5,
      name: "Under Review",
      status: "current",
      timestamp: null,
      description: "Client is reviewing the submission"
    },
    {
      id: 6,
      name: "Completed",
      status: "pending",
      timestamp: null,
      description: "Task completed and payment released"
    }
  ],
  submission: {
    files: [
      { name: "image_labels_001.json", url: "#", type: "application/json", size: "24 KB" },
      { name: "image_labels_002.json", url: "#", type: "application/json", size: "18 KB" },
      { name: "verification_screenshots.zip", url: "#", type: "application/zip", size: "2.4 MB" }
    ],
    notes: "All 50 images have been labeled according to the specifications. I encountered some edge cases with image #23 and #47 where multiple objects were present - I've labeled all visible objects as requested.",
    submittedAt: "2025-10-26T14:00:00"
  },
  comments: [
    {
      id: 1,
      author: "John Doe",
      authorRole: "worker",
      avatar: "/placeholder.svg",
      message: "Started working on this task. Estimated completion in 4 hours.",
      timestamp: "2025-10-26T09:00:00"
    },
    {
      id: 2,
      author: "John Doe",
      authorRole: "worker",
      avatar: "/placeholder.svg",
      message: "Work submitted. Please review the files.",
      timestamp: "2025-10-26T14:00:00"
    }
  ]
});

export default function TaskFlowDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const taskId = params.taskId as string;
  const qtyId = params.qtyId as string;
  const roleParam = searchParams.get("role") as "client" | "worker" | null;
  
  // Auto-detect role based on user session (mock for now)
  const [userRole, setUserRole] = useState<"client" | "worker">(roleParam || "worker");
  
  const [reviewDecision, setReviewDecision] = useState<"approve" | "revision" | "reject" | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  
  // Worker submission state
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);

  // Mock: Use submitted flow for demo if qtyId includes "submitted" or "review"
  const taskFlow = qtyId.includes("submitted") || qtyId.includes("review") 
    ? getMockSubmittedTaskFlow(taskId, qtyId)
    : getMockTaskFlow(taskId, qtyId);

  // Auto-detect role: if task has submission and current user is not worker, assume client
  useEffect(() => {
    // Priority 1: Use role from URL parameter
    if (roleParam) {
      setUserRole(roleParam);
      return;
    }
    
    // Priority 2: Auto-detect based on submission status
    // For demo: if submission exists and we're reviewing, set to client
    if (taskFlow.submission && taskFlow.status === "in_review") {
      setUserRole("client");
    }
  }, [roleParam, taskFlow.submission, taskFlow.status]);

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

  const handleSubmitWork = () => {
    if (submissionFiles.length === 0) {
      alert("Please upload at least one file");
      return;
    }
    console.log("Submitting work:", { files: submissionFiles, notes: submissionNotes });
    // In real app: API call to submit work
    router.push("/worker-dashboard");
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

  const timeRemaining = new Date(taskFlow.deadline).getTime() - new Date().getTime();
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
                <h1 className="text-3xl font-bold">{taskFlow.taskTitle}</h1>
                <Badge className={getStatusColor(taskFlow.status)}>
                  {taskFlow.status.replace(/_/g, " ").toUpperCase()}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Task ID: {taskFlow.taskId} • Qty ID: {taskFlow.qtyId} • Viewing as: <strong>{userRole}</strong>
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">${taskFlow.totalReward.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Reward ({taskFlow.quantityAmount} × ${taskFlow.reward})</div>
            </div>
          </div>

          {/* Deadline Alert */}
          {userRole === "worker" && !taskFlow.submission && hoursRemaining < 24 && (
            <Card className="mb-6 border-warning">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <div>
                    <div className="font-semibold text-warning">Deadline approaching!</div>
                    <div className="text-sm text-muted-foreground">
                      {hoursRemaining} hours remaining until {new Date(taskFlow.deadline).toLocaleString()}
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
                    <Tabs defaultValue={taskFlow.submission ? "progress" : "submit"} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="instructions">Instructions</TabsTrigger>
                        <TabsTrigger value="submit">Submit Work</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                      </TabsList>

                      {/* Instructions Tab */}
                      <TabsContent value="instructions" className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Task Description</h4>
                          <p className="text-sm text-foreground">{taskFlow.taskDescription}</p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-accent" />
                            Requirements
                          </h4>
                          <ul className="space-y-1 text-sm text-foreground ml-6">
                            {taskFlow.taskRequirements.map((req, idx) => (
                              <li key={idx}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-secondary/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Quantity Info</h4>
                          <div className="text-sm space-y-1">
                            <p>Total items: <strong>{taskFlow.quantityAmount}</strong></p>
                            <p>Completed: <strong>{taskFlow.completed}</strong></p>
                            <p>Remaining: <strong>{taskFlow.quantityAmount - taskFlow.completed}</strong></p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Submit Work Tab */}
                      <TabsContent value="submit" className="space-y-4">
                        {taskFlow.submission ? (
                          <div className="bg-accent/10 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-5 w-5 text-accent" />
                              <h4 className="font-semibold text-accent">Work Already Submitted</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Your work was submitted on {new Date(taskFlow.submittedAt!).toLocaleString()}
                              and is currently under review.
                            </p>
                          </div>
                        ) : (
                          <>
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
                              />
                            </div>

                            <Button 
                              size="lg" 
                              className="w-full bg-accent hover:bg-accent/90 text-white"
                              onClick={handleSubmitWork}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Submit Work for Review
                            </Button>
                          </>
                        )}
                      </TabsContent>

                      {/* Progress Tab */}
                      <TabsContent value="progress" className="space-y-4">
                        <div className="space-y-4">
                          {taskFlow.steps.map((step, index) => (
                            <div key={step.id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                {getStepIcon(step.status)}
                                {index < taskFlow.steps.length - 1 && (
                                  <div className={`w-0.5 h-12 mt-2 ${
                                    step.status === "completed" 
                                      ? "bg-accent" 
                                      : "bg-muted"
                                  }`} />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold">{step.name}</h4>
                                  {step.timestamp && (
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(step.timestamp).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                              </div>
                            </div>
                          ))}
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
                    <CardDescription>Track the current status and history of this quantity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {taskFlow.steps.map((step, index) => (
                        <div key={step.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            {getStepIcon(step.status)}
                            {index < taskFlow.steps.length - 1 && (
                              <div className={`w-0.5 h-16 mt-2 ${
                                step.status === "completed" 
                                  ? "bg-accent" 
                                  : "bg-muted"
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold">{step.name}</h4>
                              {step.timestamp && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(step.timestamp).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submission Details (Both views when submitted) */}
              {taskFlow.submission && (
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Details</CardTitle>
                    <CardDescription>
                      Submitted on {new Date(taskFlow.submission.submittedAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Uploaded Files ({taskFlow.submission.files.length})
                      </h4>
                      <div className="space-y-2">
                        {taskFlow.submission.files.map((file, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium">{file.name}</div>
                                <div className="text-xs text-muted-foreground">{file.size}</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Worker Notes
                      </h4>
                      <p className="text-sm text-foreground bg-secondary/50 p-3 rounded-lg">
                        {taskFlow.submission.notes}
                      </p>
                    </div>

                    {/* Review Actions (Client Only) */}
                    {userRole === "client" && taskFlow.status === "in_review" && (
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
                              />
                              <div className="flex gap-3">
                                <Button 
                                  onClick={handleSubmitReview}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  Submit Review
                                </Button>
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    setReviewDecision(null);
                                    setReviewNote("");
                                  }}
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
                      {new Date(taskFlow.deadline).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {hoursRemaining > 0 ? `${hoursRemaining} hours remaining` : "Overdue"}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Reward</div>
                    <div className="text-xl font-bold text-accent">${taskFlow.totalReward.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{taskFlow.quantityAmount} items × ${taskFlow.reward}</div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Progress</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-accent rounded-full h-2 transition-all"
                          style={{ width: `${(taskFlow.completed / taskFlow.quantityAmount) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round((taskFlow.completed / taskFlow.quantityAmount) * 100)}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {taskFlow.completed} / {taskFlow.quantityAmount} completed
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Task ID:</span>
                      <span className="font-mono">{taskFlow.taskId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity ID:</span>
                      <span className="font-mono">{taskFlow.qtyId}</span>
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
                      <AvatarImage src={taskFlow.workerAvatar} />
                      <AvatarFallback>{taskFlow.workerName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{taskFlow.workerName}</div>
                      <div className="text-sm text-muted-foreground">ID: {taskFlow.workerId}</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
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
                      <AvatarImage src={taskFlow.clientAvatar} />
                      <AvatarFallback>{taskFlow.clientName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{taskFlow.clientName}</div>
                      <div className="text-sm text-muted-foreground">ID: {taskFlow.clientId}</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
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
                    onClick={() => router.push(`/task-detail?id=${taskFlow.taskId}&role=${userRole}`)}
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
