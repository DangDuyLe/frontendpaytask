'use client';
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
  Wallet
} from "lucide-react";

function TaskDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const userRole = searchParams.get("role") || "worker"; // client or worker
  const isDraft = searchParams.get("draft") === "true";
  
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<any>(null);
  const [reviewingQty, setReviewingQty] = useState<string | null>(null);
  const [quickReviewDecision, setQuickReviewDecision] = useState<"approve" | "reject" | "revision" | null>(null);
  const [quickReviewNote, setQuickReviewNote] = useState("");
  


  // Mock data - would come from API
  const task = {
    id: id || "1",
    title: "Verify Restaurant Menu Prices",
    description: "Visit the restaurant and verify that all menu prices match our database. Take photos of the menu items and confirm pricing accuracy. Must be completed during business hours (11am-9pm).",
    category: "Data Verification",
    reward: 5.00,
    quantity: 50,
    quantityRemaining: 23,
    deadline: "2025-10-30T18:00:00",
    requiredSkills: ["Photography", "Data Entry", "Attention to Detail"],
    languages: ["English"],
    estimatedTime: "30 minutes",
    client: {
      id: "client-1",
      name: "FoodieData Inc.",
      reputation: 4.8,
      completedTasks: 127,
      avatar: "/placeholder.svg"
    },
    requirements: [
      "Must have a smartphone with camera",
      "Must be located within 5km of restaurant",
      "Must complete during restaurant operating hours"
    ],
    // For client view - list of active quantities
    activeQuantities: [
      { qtyId: "qty-1", workerId: "worker-123", workerName: "John Doe", workerAvatar: "/placeholder.svg", workerRating: 4.9, status: "in_review", progress: 50, total: 50, assignedAt: "2025-10-26T08:00:00", hasSubmission: true },
      { qtyId: "qty-2", workerId: "worker-124", workerName: "Jane Smith", workerAvatar: "/placeholder.svg", workerRating: 4.7, status: "completed", progress: 30, total: 30, assignedAt: "2025-10-25T10:00:00", hasSubmission: false },
      { qtyId: "qty-3", workerId: "worker-125", workerName: "Bob Wilson", workerAvatar: "/placeholder.svg", workerRating: 4.6, status: "in_progress", progress: 15, total: 40, assignedAt: "2025-10-26T11:00:00", hasSubmission: false },
      { qtyId: "qty-4", workerId: "worker-126", workerName: "Alice Johnson", workerAvatar: "/placeholder.svg", workerRating: 4.8, status: "in_review", progress: 25, total: 25, assignedAt: "2025-10-26T08:30:00", hasSubmission: true },
    ]
  };

  const handleAcceptTask = () => {
    // In real app, would call API to accept task and get assigned qtyId
    const assignedQtyId = "qty-new-" + Math.random().toString(36).substr(2, 9);
    router.push(`/task-flow/${task.id}/${assignedQtyId}`);
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

  const handleFundTask = () => {
    console.log("Funding task:", id, {
      totalAmount: totalCost
    });
    // Handle funding logic here
    router.push("/client-dashboard");
  };

  // Calculate costs
  const totalTaskCost = task.quantity * task.reward;
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
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(userRole === "client" ? "/client-dashboard" : "/worker-dashboard")}
            className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="mb-3 bg-blue-100 text-blue-700">{task.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <p className="text-gray-600">
                {task.quantityRemaining} of {task.quantity} positions available
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#20A277]">${task.reward}</div>
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
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Est. Time</div>
                    <div className="font-semibold text-gray-900">{task.estimatedTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-semibold text-gray-900">On-site</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Description */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Task Description</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">{task.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
              </div>
              <div className="p-6 space-y-6">
                <ul className="space-y-3">
                  {task.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-[#20A277] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
                <div className="h-px bg-gray-200" />
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Required Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {task.requiredSkills.map((skill) => (
                        <Badge key={skill} className="bg-gray-100 text-gray-700 hover:bg-gray-200">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Languages</div>
                    <div className="flex flex-wrap gap-2">
                      {task.languages.map((lang) => (
                        <Badge key={lang} className="bg-gray-100 text-gray-700 hover:bg-gray-200">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Posted By</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-gray-200">
                      <AvatarImage src={task.client.avatar} />
                      <AvatarFallback className="bg-[#20A277] text-white text-lg">{task.client.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{task.client.name}</div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          {task.client.reputation} rating
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {task.client.completedTasks} tasks completed
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

          {/* Active Quantities (Client View Only) */}
          {userRole === "client" && task.activeQuantities && task.activeQuantities.length > 0 && (
            <>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Assigned Quantities ({task.activeQuantities.length})</h2>
                      <p className="text-sm text-gray-600 mt-1">Track progress of each worker assignment</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">
                      {task.activeQuantities.filter(q => q.status === "in_review").length} Pending Review
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-gray-900 font-semibold">Worker</TableHead>
                          <TableHead className="text-gray-900 font-semibold">Quantity</TableHead>
                          <TableHead className="text-gray-900 font-semibold">Progress</TableHead>
                          <TableHead className="text-gray-900 font-semibold">Status</TableHead>
                          <TableHead className="text-gray-900 font-semibold">Assigned</TableHead>
                          <TableHead className="text-gray-900 font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {task.activeQuantities.map((qty) => (
                          <TableRow key={qty.qtyId} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 border border-gray-200">
                                  <AvatarImage src={qty.workerAvatar} />
                                  <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">{qty.workerName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm text-gray-900">{qty.workerName}</div>
                                  <div className="text-xs text-gray-600">★ {qty.workerRating}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium text-gray-900">{qty.total} items</div>
                              <div className="text-xs text-gray-600">
                                ${(qty.total * task.reward).toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
                                  <div 
                                    className="bg-[#20A277] rounded-full h-1.5 transition-all"
                                    style={{ width: `${(qty.progress / qty.total) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700">{qty.progress}/{qty.total}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(qty.status)} flex items-center gap-1 w-fit`}>
                                {getStatusIcon(qty.status)}
                                {qty.status.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs text-gray-600">
                                {new Date(qty.assignedAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/task-flow/${task.id}/${qty.qtyId}?role=client`)}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  View
                                </Button>
                                {qty.status === "in_review" && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-[#20A277] hover:bg-[#1a8d66] text-white"
                                    onClick={() => handleQuickReview(qty.qtyId)}
                                  >
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Review
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Quick Review Dialog */}
              {reviewingQty && (
                <div className="bg-white rounded-lg border-2 border-[#20A277] shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-[#20A277]" />
                      Quick Review: {task.activeQuantities.find(q => q.qtyId === reviewingQty)?.workerName}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Review submission for quantity {reviewingQty}
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-sm border border-blue-100">
                      <p className="text-gray-700">
                        <strong>Note:</strong> For detailed review with file downloads and full submission details, 
                        click "Full Review" to open the complete task flow page.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant={quickReviewDecision === "approve" ? "default" : "outline"}
                        className={quickReviewDecision === "approve" ? "bg-[#20A277] hover:bg-[#1a8d66]" : "border-gray-300 text-gray-700 hover:bg-gray-50"}
                        onClick={() => setQuickReviewDecision("approve")}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant={quickReviewDecision === "revision" ? "default" : "outline"}
                        className={quickReviewDecision === "revision" ? "bg-orange-600 hover:bg-orange-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}
                        onClick={() => setQuickReviewDecision("revision")}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Request Revision
                      </Button>
                      <Button
                        variant={quickReviewDecision === "reject" ? "destructive" : "outline"}
                        onClick={() => setQuickReviewDecision("reject")}
                        className={quickReviewDecision !== "reject" ? "border-gray-300 text-gray-700 hover:bg-gray-50" : ""}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>

                    {quickReviewDecision && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900">Feedback for worker</label>
                          <Textarea
                            placeholder="Add your feedback..."
                            value={quickReviewNote}
                            onChange={(e) => setQuickReviewNote(e.target.value)}
                            rows={4}
                            className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={handleSubmitQuickReview}
                            className="bg-[#20A277] hover:bg-[#1a8d66] text-white"
                          >
                            Submit Review
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setReviewingQty(null);
                              setQuickReviewDecision(null);
                              setQuickReviewNote("");
                            }}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => router.push(`/task-flow/${task.id}/${reviewingQty}`)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Full Review
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                      <span className="text-gray-600">Task Cost ({task.quantity} × ${task.reward})</span>
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
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Fund & Publish Task
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/client-dashboard")}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
          {userRole === "worker" && (
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-[#20A277] hover:bg-[#1a8d66] text-white"
                onClick={handleAcceptTask}
              >
                Accept Task
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



