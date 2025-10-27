'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, AlertTriangle, User, Briefcase, FileText, Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function DisputeReview() {
  const router = useRouter();
  const params = useParams();
  const disputeId = params.disputeId as string;
  const [resolution, setResolution] = useState("");

  // Mock dispute data - in real app, fetch based on disputeId
  const disputeData = {
    "DISPUTE-001": {
      id: "DISPUTE-001",
      taskTitle: "Menu Verification",
      taskId: "TASK-12345",
      taskDescription: "Verify restaurant menus and upload photos for 50 local restaurants",
      worker: {
        name: "Sarah Chen",
        id: "worker-789",
        email: "sarah.chen@example.com"
      },
      client: {
        name: "FoodieData Inc",
        id: "client-456",
        email: "contact@foodiedata.com"
      },
      status: "open",
      createdAt: "2025-10-25T14:00:00",
      taskAmount: 250,
      quantityCompleted: 42,
      quantityTotal: 50,
      reason: "Quality Dispute",
      workerClaim: "I completed 42 out of 50 menu verifications as per the task requirements. All photos are clear and menus are accurate. The client is refusing to accept the work without valid reasons.",
      clientClaim: "The worker only completed 35 verifications properly. 7 of the submissions have blurry photos or incomplete menu information. We cannot accept substandard work.",
      evidence: [
        {
          type: "worker",
          description: "Screenshot of all 42 completed submissions with timestamps",
          uploadedAt: "2025-10-25T14:30:00"
        },
        {
          type: "client",
          description: "Examples of 7 submissions with quality issues highlighted",
          uploadedAt: "2025-10-25T15:00:00"
        }
      ],
      messages: [
        {
          sender: "worker",
          text: "I have completed all the required verifications. Please review the submissions.",
          timestamp: "2025-10-25T14:00:00"
        },
        {
          sender: "client",
          text: "Several submissions do not meet our quality standards. We need clear photos and complete menu information.",
          timestamp: "2025-10-25T14:30:00"
        }
      ]
    },
    "DISPUTE-002": {
      id: "DISPUTE-002",
      taskTitle: "Product Photos",
      taskId: "TASK-67890",
      taskDescription: "Take professional photos of products for e-commerce listings",
      worker: {
        name: "Mike Wilson",
        id: "worker-321",
        email: "mike.wilson@example.com"
      },
      client: {
        name: "ShopMart",
        id: "client-654",
        email: "disputes@shopmart.com"
      },
      status: "under_review",
      createdAt: "2025-10-24T11:30:00",
      taskAmount: 500,
      quantityCompleted: 100,
      quantityTotal: 100,
      reason: "Non-payment",
      workerClaim: "I completed all 100 product photos as requested. The client approved the work but has not released the payment after 5 days.",
      clientClaim: "We experienced technical issues with our payment system. We are working to resolve this but need more time.",
      evidence: [
        {
          type: "worker",
          description: "Email confirmation from client approving all photos",
          uploadedAt: "2025-10-24T12:00:00"
        }
      ],
      messages: [
        {
          sender: "worker",
          text: "The payment deadline has passed. I need the funds released immediately.",
          timestamp: "2025-10-24T11:30:00"
        },
        {
          sender: "client",
          text: "We apologize for the delay. Our finance team is working on it.",
          timestamp: "2025-10-24T13:00:00"
        }
      ]
    }
  };

  const dispute = disputeData[disputeId as keyof typeof disputeData] || disputeData["DISPUTE-001"];

  const handleResolve = (favoredParty: "worker" | "client" | "split") => {
    // In real app, this would call an API
    alert(`Dispute resolved in favor of ${favoredParty}. Resolution notes: ${resolution}`);
    router.push("/admin-dashboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "under_review": return "secondary";
      case "resolved": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-primary">PayTask</h1>
              <Badge variant="destructive">Admin</Badge>
            </div>
            <Button variant="ghost" onClick={() => router.push("/admin-dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Dispute Review</h1>
                <Badge variant={getStatusColor(dispute.status)}>
                  {dispute.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <p className="text-muted-foreground">Dispute ID: {dispute.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Filed: {new Date(dispute.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Task Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                <CardTitle>Task Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Task Title</p>
                  <p className="font-medium">{dispute.taskTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Task ID</p>
                  <p className="font-mono text-sm">{dispute.taskId}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Task Description</p>
                <p className="mt-1">{dispute.taskDescription}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Task Amount</p>
                  <p className="font-medium text-lg">${dispute.taskAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="font-medium">{dispute.quantityCompleted} / {dispute.quantityTotal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dispute Reason</p>
                  <Badge variant="outline">{dispute.reason}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parties Involved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Worker Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Worker</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{dispute.worker.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm">{dispute.worker.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{dispute.worker.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <CardTitle>Client</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{dispute.client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm">{dispute.client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{dispute.client.id}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Claims */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Worker Claim */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Worker's Claim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{dispute.workerClaim}</p>
              </CardContent>
            </Card>

            {/* Client Claim */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Client's Claim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{dispute.clientClaim}</p>
              </CardContent>
            </Card>
          </div>

          {/* Evidence */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Evidence Submitted</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dispute.evidence.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Badge variant={item.type === "worker" ? "default" : "secondary"}>
                      {item.type}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{item.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded: {new Date(item.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Communication History */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <CardTitle>Communication History</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dispute.messages.map((message, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Badge variant={message.sender === "worker" ? "default" : "secondary"}>
                        {message.sender}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resolution Section */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Admin Resolution</CardTitle>
              <CardDescription>Review the evidence and resolve this dispute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Resolution Notes</label>
                <Textarea 
                  placeholder="Enter your resolution notes and reasoning here..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium mb-4">Resolution Action</p>
                <div className="flex gap-4">
                  <Button 
                    className="flex-1" 
                    variant="default"
                    onClick={() => handleResolve("worker")}
                  >
                    Favor Worker
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="secondary"
                    onClick={() => handleResolve("split")}
                  >
                    Split Decision
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => handleResolve("client")}
                  >
                    Favor Client
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Important</p>
                    <p className="text-muted-foreground">
                      Your decision is final and will be recorded in the audit log. 
                      Make sure to review all evidence and communications before resolving.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
