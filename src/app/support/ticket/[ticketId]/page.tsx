'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MessageSquare, User, FileText, Calendar, Send, Clock, CheckCircle, AlertCircle, Paperclip } from "lucide-react";
import { useState } from "react";

export default function TicketDetail() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.ticketId as string;
  const [newMessage, setNewMessage] = useState("");

  // Mock ticket data - in real app, fetch based on ticketId
  const ticketData = {
    "TICKET-001": {
      id: "TICKET-001",
      subject: "Payment not received",
      category: "Payment",
      status: "open",
      priority: "high",
      createdAt: "2025-10-25T10:00:00",
      updatedAt: "2025-10-26T09:00:00",
      user: {
        name: "Sarah Chen",
        id: "user-789",
        email: "sarah.chen@example.com",
        role: "Worker"
      },
      description: "I completed a task (TASK-12345) on October 23rd and the client approved my work. However, the payment has not been released to my wallet yet. It's been more than 48 hours and I'm concerned about this delay. The task was for $250 and I can provide screenshots of the approval if needed.",
      messages: [
        {
          sender: "user",
          senderName: "Sarah Chen",
          text: "I completed a task (TASK-12345) on October 23rd and the client approved my work. However, the payment has not been released to my wallet yet. It's been more than 48 hours and I'm concerned about this delay.",
          timestamp: "2025-10-25T10:00:00",
          attachments: []
        },
        {
          sender: "support",
          senderName: "Support Team",
          text: "Thank you for contacting us. I've reviewed your account and can see the task completion. Let me investigate the payment issue and get back to you shortly.",
          timestamp: "2025-10-25T14:30:00",
          attachments: []
        },
        {
          sender: "support",
          senderName: "Support Team",
          text: "I've identified the issue - there was a smart contract processing delay. The payment has now been released to your wallet. You should see the funds in the next few minutes. I apologize for the inconvenience.",
          timestamp: "2025-10-26T09:00:00",
          attachments: []
        }
      ],
      relatedInfo: {
        taskId: "TASK-12345",
        taskTitle: "Menu Verification",
        amount: "$250",
        clientName: "FoodieData Inc"
      }
    },
    "TICKET-002": {
      id: "TICKET-002",
      subject: "Task unfairly rejected",
      category: "Dispute",
      status: "in_progress",
      priority: "medium",
      createdAt: "2025-10-20T14:30:00",
      updatedAt: "2025-10-24T16:00:00",
      user: {
        name: "Mike Wilson",
        id: "user-321",
        email: "mike.wilson@example.com",
        role: "Worker"
      },
      description: "I submitted work for TASK-67890 (Product Photos) and followed all the requirements in the task description. The client rejected my submission claiming 'poor quality' but didn't provide specific feedback. I believe this rejection is unfair and would like to escalate this to a formal dispute.",
      messages: [
        {
          sender: "user",
          senderName: "Mike Wilson",
          text: "I submitted work for TASK-67890 and followed all the requirements in the task description. The client rejected my submission claiming 'poor quality' but didn't provide specific feedback.",
          timestamp: "2025-10-20T14:30:00",
          attachments: ["submission_screenshots.zip"]
        },
        {
          sender: "support",
          senderName: "Support Team",
          text: "Thank you for reaching out. I've reviewed your submission and the task requirements. I can see your concern. Let me contact the client to get more specific feedback on what needs to be improved.",
          timestamp: "2025-10-21T10:00:00",
          attachments: []
        },
        {
          sender: "user",
          senderName: "Mike Wilson",
          text: "Thank you. I'm willing to make revisions if the feedback is specific, but the generic 'poor quality' reason is not helpful.",
          timestamp: "2025-10-21T11:00:00",
          attachments: []
        },
        {
          sender: "support",
          senderName: "Support Team",
          text: "I've spoken with the client. They mentioned the lighting in some photos doesn't match their brand guidelines. I'm sending you their detailed feedback document. You have one more revision attempt remaining.",
          timestamp: "2025-10-22T15:00:00",
          attachments: ["client_feedback.pdf"]
        },
        {
          sender: "user",
          senderName: "Mike Wilson",
          text: "This is much more helpful. I'll revise the photos according to their guidelines and resubmit within 24 hours.",
          timestamp: "2025-10-22T16:00:00",
          attachments: []
        },
        {
          sender: "user",
          senderName: "Mike Wilson",
          text: "I've resubmitted the revised photos with proper lighting. Please let me know if there are any other issues.",
          timestamp: "2025-10-23T10:00:00",
          attachments: ["revised_photos.zip"]
        },
        {
          sender: "support",
          senderName: "Support Team",
          text: "Great! I've notified the client about your resubmission. They have 48 hours to review. I'll follow up to ensure timely feedback.",
          timestamp: "2025-10-24T16:00:00",
          attachments: []
        }
      ],
      relatedInfo: {
        taskId: "TASK-67890",
        taskTitle: "Product Photos",
        amount: "$500",
        clientName: "ShopMart"
      }
    },
    "TICKET-003": {
      id: "TICKET-003",
      subject: "Account settings question",
      category: "Account",
      status: "resolved",
      priority: "low",
      createdAt: "2025-10-15T11:00:00",
      updatedAt: "2025-10-16T10:00:00",
      user: {
        name: "Alex Johnson",
        id: "user-555",
        email: "alex.johnson@example.com",
        role: "Client"
      },
      description: "I want to change my email address and update my payment preferences but I can't find these options in the settings. Can you help me locate them or update them for me?",
      messages: [
        {
          sender: "user",
          senderName: "Alex Johnson",
          text: "I want to change my email address and update my payment preferences but I can't find these options in the settings. Can you help me?",
          timestamp: "2025-10-15T11:00:00",
          attachments: []
        },
        {
          sender: "support",
          senderName: "Support Team",
          text: "I'd be happy to help! To change your email: 1) Go to Settings > Profile > Edit Profile, 2) Click on the email field, 3) Enter your new email and verify it. For payment preferences, go to Settings > Wallet > Payment Methods.",
          timestamp: "2025-10-15T14:00:00",
          attachments: ["settings_guide.pdf"]
        },
        {
          sender: "user",
          senderName: "Alex Johnson",
          text: "Perfect! I found both settings. The guide you sent was very helpful. Thank you!",
          timestamp: "2025-10-16T09:30:00",
          attachments: []
        },
        {
          sender: "support",
          senderName: "Support Team",
          text: "You're welcome! I'm glad I could help. I'm marking this ticket as resolved. Feel free to reach out if you have any other questions!",
          timestamp: "2025-10-16T10:00:00",
          attachments: []
        }
      ],
      relatedInfo: null
    }
  };

  const ticket = ticketData[ticketId as keyof typeof ticketData] || ticketData["TICKET-001"];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In real app, this would call an API
    alert(`Message sent: ${newMessage}`);
    setNewMessage("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="h-3 w-3 mr-1" /> Open
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-500 text-white">
            <MessageSquare className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" /> Resolved
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium Priority</Badge>;
      case "low":
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-primary">PayTask</h1>
            </div>
            <Button variant="ghost" onClick={() => router.push("/support")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Support
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{ticket.subject}</h1>
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
              <p className="text-muted-foreground">Ticket ID: {ticket.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Created: {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ticket Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <CardTitle>Ticket Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Category</p>
                    <Badge variant="outline" className="text-sm">{ticket.category}</Badge>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Initial Description</p>
                    <p className="text-sm leading-relaxed">{ticket.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Conversation Thread */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <CardTitle>Conversation</CardTitle>
                  </div>
                  <CardDescription>
                    {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {ticket.messages.map((message, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.sender === "support" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-secondary text-secondary-foreground"
                          }`}>
                            {message.sender === "support" ? (
                              <MessageSquare className="h-5 w-5" />
                            ) : (
                              <User className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{message.senderName}</span>
                            <Badge variant={message.sender === "support" ? "default" : "secondary"} className="text-xs">
                              {message.sender === "support" ? "Support Team" : ticket.user.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                  <Paperclip className="h-3 w-3" />
                                  <span>Attachments:</span>
                                </div>
                                {message.attachments.map((attachment, idx) => (
                                  <Badge key={idx} variant="outline" className="mr-2">
                                    {attachment}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {ticket.status !== "resolved" && (
                    <>
                      <Separator className="my-6" />
                      
                      {/* Reply Section */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Add Reply</label>
                          <Textarea 
                            placeholder="Type your message here..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm">
                            <Paperclip className="h-4 w-4 mr-2" />
                            Attach File
                          </Button>
                          <Button onClick={handleSendMessage}>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <CardTitle>Ticket Owner</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{ticket.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm">{ticket.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="font-mono text-sm">{ticket.user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge variant="outline">{ticket.user.role}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <CardTitle>Timeline</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">
                      {new Date(ticket.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  {ticket.status === "resolved" && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground">Resolved</p>
                        <p className="text-sm font-medium">
                          {new Date(ticket.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Related Information */}
              {ticket.relatedInfo && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <CardTitle>Related Task</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Task ID</p>
                      <p className="font-mono text-sm">{ticket.relatedInfo.taskId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Task Title</p>
                      <p className="font-medium">{ticket.relatedInfo.taskTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium text-lg">{ticket.relatedInfo.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="text-sm">{ticket.relatedInfo.clientName}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Task Details
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              {ticket.status !== "resolved" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Escalate to Dispute
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
