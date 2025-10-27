'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRouter } from "next/navigation";
import { MessageSquare, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const router = useRouter();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Mock data for existing tickets
  const tickets = [
    {
      id: "TICKET-001",
      subject: "Payment not received",
      category: "Payment",
      status: "open",
      createdAt: "2025-10-25T10:00:00",
      updatedAt: "2025-10-26T09:00:00",
      messages: 3
    },
    {
      id: "TICKET-002",
      subject: "Task unfairly rejected",
      category: "Dispute",
      status: "in_progress",
      createdAt: "2025-10-20T14:30:00",
      updatedAt: "2025-10-24T16:00:00",
      messages: 7
    },
    {
      id: "TICKET-003",
      subject: "Account settings question",
      category: "Account",
      status: "resolved",
      createdAt: "2025-10-15T11:00:00",
      updatedAt: "2025-10-16T10:00:00",
      messages: 5
    }
  ];

  const handleSubmit = () => {
    if (!subject || !category || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Ticket created",
      description: "Your support ticket has been submitted. We'll respond within 24 hours.",
    });

    setSubject("");
    setCategory("");
    setDescription("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-warning text-white"><Clock className="h-3 w-3 mr-1" /> Open</Badge>;
      case "in_progress":
        return <Badge className="bg-info text-white"><MessageSquare className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-success text-white"><CheckCircle className="h-3 w-3 mr-1" /> Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">PayTask</h1>
            <Button variant="ghost" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Support & Disputes</h1>

          <Tabs defaultValue="new" className="space-y-6">
            <TabsList>
              <TabsTrigger value="new">New Ticket</TabsTrigger>
              <TabsTrigger value="tickets">My Tickets ({tickets.length})</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            {/* New Ticket Tab */}
            <TabsContent value="new">
              <Card>
                <CardHeader>
                  <CardTitle>Create Support Ticket</CardTitle>
                  <CardDescription>
                    Describe your issue and our support team will help you resolve it
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">Payment Issues</SelectItem>
                        <SelectItem value="dispute">Task Dispute</SelectItem>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="technical">Technical Problem</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide as much detail as possible about your issue..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={8}
                    />
                    <p className="text-xs text-muted-foreground">
                      Include relevant task IDs, transaction hashes, or screenshots if applicable
                    </p>
                  </div>

                  <div className="bg-info/10 border border-info/20 p-4 rounded-lg">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                      <div className="text-sm space-y-1">
                        <div className="font-semibold">Before submitting:</div>
                        <ul className="text-muted-foreground space-y-1 ml-4">
                          <li>• Check our FAQ section for quick answers</li>
                          <li>• Include all relevant details (task ID, timestamps, etc.)</li>
                          <li>• For disputes, review our dispute resolution policy</li>
                          <li>• Response time: 24-48 hours</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-accent hover:bg-accent/90 text-white"
                    onClick={handleSubmit}
                  >
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Tickets Tab */}
            <TabsContent value="tickets" className="space-y-4">
              {tickets.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No support tickets</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You haven't created any support tickets yet.
                    </p>
                    <Button onClick={() => router.push("/support")}>
                      Create Your First Ticket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                tickets.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/support/ticket/${ticket.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>ID: {ticket.id}</span>
                            <span>•</span>
                            <Badge variant="outline">{ticket.category}</Badge>
                            <span>•</span>
                            <span>{ticket.messages} messages</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">
                          Created: {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">How long does it take to receive payment?</h4>
                    <p className="text-sm text-muted-foreground">
                      Payments are released instantly once your work is approved by the client. The funds appear in your PayTask wallet immediately and can be withdrawn to your crypto wallet.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">What if my submission is rejected?</h4>
                    <p className="text-sm text-muted-foreground">
                      If your submission is rejected, you'll receive detailed feedback from the client. You can request a fix (up to 2 times) or open a dispute if you believe the rejection was unfair.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">How does the dispute process work?</h4>
                    <p className="text-sm text-muted-foreground">
                      You have 7 days after a final decision to open a dispute. Our support team will review all evidence from both parties and make a fair decision within 5-7 business days.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">What happens if I miss a deadline?</h4>
                    <p className="text-sm text-muted-foreground">
                      Missing a deadline will affect your reputation score. The assignment will be automatically expired and returned to the available tasks pool. Repeated deadline misses may result in temporary restrictions.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">How is my reputation score calculated?</h4>
                    <p className="text-sm text-muted-foreground">
                      Your reputation is based on completion rate, client ratings, early submissions, and quality of work. High reputation unlocks premium tasks and better opportunities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};



