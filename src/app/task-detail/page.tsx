'use client';
import { useState } from "react";
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
  Calendar
} from "lucide-react";

export default function TaskDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const userRole = searchParams.get("role") || "worker"; // client or worker
  
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
                  <Badge className="mb-2">{task.category}</Badge>
                  <CardTitle className="text-3xl mb-2">{task.title}</CardTitle>
                  <CardDescription className="text-base">
                    {task.quantityRemaining} of {task.quantity} positions available
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-accent">${task.reward}</div>
                  <div className="text-sm text-muted-foreground">per task</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Deadline</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Est. Time</div>
                    <div className="text-sm text-muted-foreground">{task.estimatedTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">On-site</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Description */}
          <Card>
            <CardHeader>
              <CardTitle>Task Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{task.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {task.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-2">Required Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {task.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Languages</div>
                  <div className="flex flex-wrap gap-2">
                    {task.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Posted By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={task.client.avatar} />
                    <AvatarFallback>{task.client.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{task.client.name}</div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        {task.client.reputation} rating
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {task.client.completedTasks} tasks completed
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

          {/* Active Quantities (Client View Only) */}
          {userRole === "client" && task.activeQuantities && task.activeQuantities.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Assigned Quantities ({task.activeQuantities.length})</CardTitle>
                      <CardDescription>Track progress of each worker assignment</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.activeQuantities.filter(q => q.status === "in_review").length} Pending Review
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Worker</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Assigned</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {task.activeQuantities.map((qty) => (
                          <TableRow key={qty.qtyId}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={qty.workerAvatar} />
                                  <AvatarFallback>{qty.workerName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">{qty.workerName}</div>
                                  <div className="text-xs text-muted-foreground">★ {qty.workerRating}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium">{qty.total} items</div>
                              <div className="text-xs text-muted-foreground">
                                ${(qty.total * task.reward).toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-secondary rounded-full h-2 w-20">
                                  <div 
                                    className="bg-accent rounded-full h-2 transition-all"
                                    style={{ width: `${(qty.progress / qty.total) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium">{qty.progress}/{qty.total}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(qty.status)} flex items-center gap-1 w-fit`}>
                                {getStatusIcon(qty.status)}
                                {qty.status.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs text-muted-foreground">
                                {new Date(qty.assignedAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/task-flow/${task.id}/${qty.qtyId}`)}
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  View
                                </Button>
                                {qty.status === "in_review" && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-accent hover:bg-accent/90"
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
                </CardContent>
              </Card>

              {/* Quick Review Dialog */}
              {reviewingQty && (
                <Card className="border-accent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-accent" />
                      Quick Review: {task.activeQuantities.find(q => q.qtyId === reviewingQty)?.workerName}
                    </CardTitle>
                    <CardDescription>
                      Review submission for quantity {reviewingQty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-secondary/50 p-3 rounded-lg text-sm">
                      <p className="text-muted-foreground">
                        <strong>Note:</strong> For detailed review with file downloads and full submission details, 
                        click "Full Review" to open the complete task flow page.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant={quickReviewDecision === "approve" ? "default" : "outline"}
                        className={quickReviewDecision === "approve" ? "bg-accent hover:bg-accent/90" : ""}
                        onClick={() => setQuickReviewDecision("approve")}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant={quickReviewDecision === "revision" ? "default" : "outline"}
                        className={quickReviewDecision === "revision" ? "bg-warning hover:bg-warning/90" : ""}
                        onClick={() => setQuickReviewDecision("revision")}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Request Revision
                      </Button>
                      <Button
                        variant={quickReviewDecision === "reject" ? "destructive" : "outline"}
                        onClick={() => setQuickReviewDecision("reject")}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>

                    {quickReviewDecision && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Feedback for worker</label>
                          <Textarea
                            placeholder="Add your feedback..."
                            value={quickReviewNote}
                            onChange={(e) => setQuickReviewNote(e.target.value)}
                            rows={4}
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={handleSubmitQuickReview}
                            className="bg-primary hover:bg-primary/90"
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
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => router.push(`/task-flow/${task.id}/${reviewingQty}`)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Full Review
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Action Buttons (Worker View) */}
          {userRole === "worker" && (
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-accent hover:bg-accent/90 text-white"
                onClick={handleAcceptTask}
              >
                Accept Task
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
};



