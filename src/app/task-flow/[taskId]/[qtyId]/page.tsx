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
  Download
} from "lucide-react";

// Mock data - would come from API based on taskId and qtyId
const getMockTaskFlow = (taskId: string, qtyId: string) => ({
  id: `flow-${qtyId}`,
  taskId: taskId,
  taskTitle: "Verify Restaurant Menu Prices",
  qtyId: qtyId,
  workerId: "worker-123",
  workerName: "John Doe",
  workerAvatar: "/placeholder.svg",
  clientId: "client-456",
  clientName: "FoodieData Inc.",
  clientAvatar: "/placeholder.svg",
  quantityAmount: 50,
  completed: 23,
  reward: 5.00,
  totalReward: 250.00,
  status: "in_progress",
  createdAt: "2025-10-26T08:00:00",
  acceptedAt: "2025-10-26T08:30:00",
  startedAt: "2025-10-26T09:00:00",
  submittedAt: null,
  deadline: "2025-10-30T18:00:00",
  
  taskDescription: "Visit the restaurant and verify that all menu prices match our database. Take photos of the menu items and confirm pricing accuracy. Must be completed during business hours (11am-9pm).",
  taskRequirements: [
    "Must have a smartphone with camera",
    "Must be located within 5km of restaurant", 
    "Must complete during restaurant operating hours"
  ],
  
  steps: [
    { id: 1, name: "Task Assigned", status: "completed", timestamp: "2025-10-26T08:00:00", description: "Task quantity assigned to worker" },
    { id: 2, name: "Accepted", status: "completed", timestamp: "2025-10-26T08:30:00", description: "Worker accepted the task" },
    { id: 3, name: "In Progress", status: "current", timestamp: "2025-10-26T09:00:00", description: "Worker is currently working" },
    { id: 4, name: "Submitted", status: "pending", timestamp: null, description: "Work submitted for review" },
    { id: 5, name: "Under Review", status: "pending", timestamp: null, description: "Client is reviewing the submission" },
    { id: 6, name: "Completed", status: "pending", timestamp: null, description: "Task completed and payment released" }
  ],
  
  submission: null,
  
  comments: [
    { id: 1, author: "John Doe", authorRole: "worker", avatar: "/placeholder.svg", message: "Started working on this task. Estimated completion in 4 hours.", timestamp: "2025-10-26T09:00:00" }
  ]
});

// Mock submitted task flow
const getMockSubmittedTaskFlow = (taskId: string, qtyId: string) => ({
  ...getMockTaskFlow(taskId, qtyId),
  status: "in_review",
  submittedAt: "2025-10-26T14:00:00",
  completed: 50,
  steps: [
    { id: 1, name: "Task Assigned", status: "completed", timestamp: "2025-10-26T08:00:00", description: "Task quantity assigned to worker" },
    { id: 2, name: "Accepted", status: "completed", timestamp: "2025-10-26T08:30:00", description: "Worker accepted the task" },
    { id: 3, name: "In Progress", status: "completed", timestamp: "2025-10-26T09:00:00", description: "Worker started working" },
    { id: 4, name: "Submitted", status: "completed", timestamp: "2025-10-26T14:00:00", description: "Work submitted for review" },
    { id: 5, name: "Under Review", status: "current", timestamp: null, description: "Client is reviewing the submission" },
    { id: 6, name: "Completed", status: "pending", timestamp: null, description: "Task completed and payment released" }
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
    { id: 1, author: "John Doe", authorRole: "worker", avatar: "/placeholder.svg", message: "Started working on this task. Estimated completion in 4 hours.", timestamp: "2025-10-26T09:00:00" },
    { id: 2, author: "John Doe", authorRole: "worker", avatar: "/placeholder.svg", message: "Work submitted. Please review the files.", timestamp: "2025-10-26T14:00:00" }
  ]
});

export default function TaskFlowDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const taskId = params.taskId as string;
  const qtyId = params.qtyId as string;
  const roleParam = searchParams.get("role") as "client" | "worker" | null;
  
  const [userRole, setUserRole] = useState<"client" | "worker">(roleParam || "worker");
  const [reviewDecision, setReviewDecision] = useState<"approve" | "revision" | "reject" | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);

  const taskFlow = qtyId.includes("submitted") || qtyId.includes("review") 
    ? getMockSubmittedTaskFlow(taskId, qtyId)
    : getMockTaskFlow(taskId, qtyId);

  useEffect(() => {
    if (roleParam) {
      setUserRole(roleParam);
      return;
    }
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
    router.push("/worker-dashboard");
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

  const timeRemaining = new Date(taskFlow.deadline).getTime() - new Date().getTime();
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));

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
                  <h1 className="text-3xl font-bold text-gray-900">{taskFlow.taskTitle}</h1>
                  <Badge className={getStatusColor(taskFlow.status)}>
                    {taskFlow.status.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                </div>
                <p className="text-gray-600">
                  Task ID: {taskFlow.taskId} • Qty ID: {taskFlow.qtyId} • Viewing as: <strong>{userRole}</strong>
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#20A277]">${taskFlow.totalReward.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Reward ({taskFlow.quantityAmount} × ${taskFlow.reward})</div>
              </div>
            </div>
          </div>

          {/* Deadline Alert */}
          {userRole === "worker" && !taskFlow.submission && hoursRemaining < 24 && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-semibold text-yellow-800">Deadline approaching!</div>
                    <div className="text-sm text-yellow-700">
                      {hoursRemaining} hours remaining until {new Date(taskFlow.deadline).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Worker View Tabs */}
              {userRole === "worker" && (
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Workspace</h2>
                      <p className="text-gray-600 mt-1">Track progress and submit your work</p>
                    </div>

                    <Tabs defaultValue={taskFlow.submission ? "progress" : "submit"} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                        <TabsTrigger value="instructions" className="data-[state=active]:bg-white">Instructions</TabsTrigger>
                        <TabsTrigger value="submit" className="data-[state=active]:bg-white">Submit Work</TabsTrigger>
                        <TabsTrigger value="progress" className="data-[state=active]:bg-white">Progress</TabsTrigger>
                      </TabsList>

                      {/* Instructions Tab */}
                      <TabsContent value="instructions" className="space-y-4 mt-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Task Description</h4>
                          <p className="text-sm text-gray-600">{taskFlow.taskDescription}</p>
                        </div>
                        <Separator className="bg-gray-200" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Requirements
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600 ml-6">
                            {taskFlow.taskRequirements.map((req, idx) => (
                              <li key={idx}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Quantity Info</h4>
                          <div className="text-sm space-y-1 text-gray-600">
                            <p>Total items: <strong className="text-gray-900">{taskFlow.quantityAmount}</strong></p>
                            <p>Completed: <strong className="text-gray-900">{taskFlow.completed}</strong></p>
                            <p>Remaining: <strong className="text-gray-900">{taskFlow.quantityAmount - taskFlow.completed}</strong></p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Submit Work Tab */}
                      <TabsContent value="submit" className="space-y-4 mt-6">
                        {taskFlow.submission ? (
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <h4 className="font-semibold text-green-800">Work Already Submitted</h4>
                            </div>
                            <p className="text-sm text-green-700">
                              Your work was submitted on {new Date(taskFlow.submittedAt!).toLocaleString()}
                              and is currently under review.
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="file-upload" className="text-sm font-semibold text-gray-700">Upload Files (Required)</Label>
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
                                  <p className="text-sm font-medium text-gray-900 mb-2">Selected files ({submissionFiles.length}):</p>
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
                              <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Additional Notes (Optional)</Label>
                              <Textarea
                                id="notes"
                                placeholder="Add any relevant notes about your work, challenges faced, or observations..."
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
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Submit Work for Review
                            </Button>
                          </>
                        )}
                      </TabsContent>

                      {/* Progress Tab */}
                      <TabsContent value="progress" className="space-y-4 mt-6">
                        <div className="space-y-4">
                          {taskFlow.steps.map((step, index) => (
                            <div key={step.id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                {getStepIcon(step.status)}
                                {index < taskFlow.steps.length - 1 && (
                                  <div className={`w-0.5 h-12 mt-2 ${
                                    step.status === "completed" ? "bg-green-600" : "bg-gray-300"
                                  }`} />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-gray-900">{step.name}</h4>
                                  {step.timestamp && (
                                    <span className="text-xs text-gray-500">
                                      {new Date(step.timestamp).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{step.description}</p>
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
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Task Progress Timeline</h2>
                      <p className="text-gray-600 mt-1">Track the current status and history of this quantity</p>
                    </div>

                    <div className="space-y-6">
                      {taskFlow.steps.map((step, index) => (
                        <div key={step.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            {getStepIcon(step.status)}
                            {index < taskFlow.steps.length - 1 && (
                              <div className={`w-0.5 h-16 mt-2 ${
                                step.status === "completed" ? "bg-green-600" : "bg-gray-300"
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{step.name}</h4>
                              {step.timestamp && (
                                <span className="text-xs text-gray-500">
                                  {new Date(step.timestamp).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submission Details (Both views when submitted) */}
              {taskFlow.submission && (
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
                      <p className="text-gray-600 mt-1">
                        Submitted on {new Date(taskFlow.submission.submittedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Uploaded Files ({taskFlow.submission.files.length})
                        </h4>
                        <div className="space-y-2">
                          {taskFlow.submission.files.map((file, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                  <div className="text-xs text-gray-500">{file.size}</div>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-gray-200" />

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Worker Notes
                        </h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                          {taskFlow.submission.notes}
                        </p>
                      </div>

                      {/* Review Actions (Client Only) */}
                      {userRole === "client" && taskFlow.status === "in_review" && (
                        <>
                          <Separator className="bg-gray-200" />
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Review Submission</h4>
                            
                            <div className="flex gap-3">
                              <Button
                                variant={reviewDecision === "approve" ? "default" : "outline"}
                                className={reviewDecision === "approve" ? "bg-green-600 hover:bg-green-700 text-white" : "border-gray-300 hover:bg-gray-50"}
                                onClick={() => handleReview("approve")}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                variant={reviewDecision === "revision" ? "default" : "outline"}
                                className={reviewDecision === "revision" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "border-gray-300 hover:bg-gray-50"}
                                onClick={() => handleReview("revision")}
                              >
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Request Revision
                              </Button>
                              <Button
                                variant={reviewDecision === "reject" ? "destructive" : "outline"}
                                className={reviewDecision !== "reject" ? "border-gray-300 hover:bg-gray-50" : ""}
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
                                  className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                                />
                                <div className="flex gap-3">
                                  <Button 
                                    onClick={handleSubmitReview}
                                    className="bg-[#20A277] hover:bg-[#1a8a63] text-white"
                                  >
                                    Submit Review
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => {
                                      setReviewDecision(null);
                                      setReviewNote("");
                                    }}
                                    className="border-gray-300 hover:bg-gray-50"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Info */}
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Task Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Deadline</div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Calendar className="h-4 w-4" />
                        {new Date(taskFlow.deadline).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {hoursRemaining > 0 ? `${hoursRemaining} hours remaining` : "Overdue"}
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    <div>
                      <div className="text-sm text-gray-600 mb-1">Reward</div>
                      <div className="text-xl font-bold text-[#20A277]">${taskFlow.totalReward.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{taskFlow.quantityAmount} items × ${taskFlow.reward}</div>
                    </div>

                    <Separator className="bg-gray-200" />

                    <div>
                      <div className="text-sm text-gray-600 mb-1">Progress</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#20A277] rounded-full h-2 transition-all"
                            style={{ width: `${(taskFlow.completed / taskFlow.quantityAmount) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{Math.round((taskFlow.completed / taskFlow.quantityAmount) * 100)}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {taskFlow.completed} / {taskFlow.quantityAmount} completed
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Task ID:</span>
                        <span className="font-mono text-gray-900">{taskFlow.taskId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity ID:</span>
                        <span className="font-mono text-gray-900">{taskFlow.qtyId}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Worker Info */}
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Worker</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={taskFlow.workerAvatar} />
                      <AvatarFallback>{taskFlow.workerName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{taskFlow.workerName}</div>
                      <div className="text-sm text-gray-600">ID: {taskFlow.workerId}</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Client Info */}
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Client</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={taskFlow.clientAvatar} />
                      <AvatarFallback>{taskFlow.clientName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{taskFlow.clientName}</div>
                      <div className="text-sm text-gray-600">ID: {taskFlow.clientId}</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-300 hover:bg-gray-50"
                      onClick={() => router.push(`/task-detail?id=${taskFlow.taskId}&role=${userRole}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Full Task
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-300 hover:bg-gray-50"
                      onClick={() => router.push(userRole === "client" ? "/client-dashboard" : "/worker-dashboard")}
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
