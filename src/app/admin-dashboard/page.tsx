'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Users, DollarSign, AlertTriangle, TrendingUp, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function AdminDashboard() {
  const router = useRouter();

  // Mock data
  const stats = {
    totalUsers: 12453,
    activeUsers: 8934,
    totalTasks: 45678,
    activeTasks: 1234,
    totalVolume: 234567,
    platformFees: 11728,
    openDisputes: 12
  };

  const disputes = [
    { 
      id: "DISPUTE-001", 
      taskTitle: "Menu Verification", 
      worker: "Sarah Chen", 
      client: "FoodieData Inc",
      status: "open",
      createdAt: "2025-10-25T14:00:00"
    },
    { 
      id: "DISPUTE-002", 
      taskTitle: "Product Photos", 
      worker: "Mike Wilson", 
      client: "ShopMart",
      status: "under_review",
      createdAt: "2025-10-24T11:30:00"
    }
  ];

  const auditLogs = [
    { id: "1", action: "KYC Approved", user: "admin@paytask.com", target: "user-123", timestamp: "2025-10-26T14:00:00" },
    { id: "2", action: "Dispute Resolved", user: "admin@paytask.com", target: "DISPUTE-003", timestamp: "2025-10-26T13:30:00" },
    { id: "3", action: "Policy Updated", user: "admin@paytask.com", target: "platform_fee", timestamp: "2025-10-26T12:00:00" },
    { id: "4", action: "User Suspended", user: "admin@paytask.com", target: "user-456", timestamp: "2025-10-26T10:00:00" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeUsers.toLocaleString()} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTasks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeTasks.toLocaleString()} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalVolume.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  ${stats.platformFees.toLocaleString()} fees
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.openDisputes}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.openDisputes} open disputes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="disputes" className="space-y-6">
            <TabsList>
              <TabsTrigger value="disputes">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Disputes ({stats.openDisputes})
              </TabsTrigger>
              <TabsTrigger value="audit">
                <FileText className="h-4 w-4 mr-2" />
                Audit Log
              </TabsTrigger>
            </TabsList>

            {/* Disputes Tab */}
            <TabsContent value="disputes">
              <Card>
                <CardHeader>
                  <CardTitle>Open Disputes</CardTitle>
                  <CardDescription>Review and resolve task disputes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Parties</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disputes.map((dispute) => (
                        <TableRow key={dispute.id}>
                          <TableCell className="font-mono text-sm">{dispute.id}</TableCell>
                          <TableCell className="font-medium">{dispute.taskTitle}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>Worker: {dispute.worker}</div>
                              <div>Client: {dispute.client}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={dispute.status === "open" ? "destructive" : "secondary"}>
                              {dispute.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm"
                              onClick={() => router.push(`/admin-dashboard/dispute/${dispute.id}`)}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Log Tab */}
            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Log</CardTitle>
                  <CardDescription>Track all administrative actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Admin User</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell className="font-mono text-sm">{log.target}</TableCell>
                          <TableCell>
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}


