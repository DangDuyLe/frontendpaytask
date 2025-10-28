'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Users, AlertTriangle, TrendingUp, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Platform overview and management</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600">Total Users</span>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-sm text-gray-500">{stats.activeUsers.toLocaleString()} active users</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600">Total Tasks</span>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalTasks.toLocaleString()}</div>
                <p className="text-sm text-gray-500">{stats.activeTasks.toLocaleString()} active tasks</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600">Platform Volume</span>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">${stats.totalVolume.toLocaleString()}</div>
                <p className="text-sm text-gray-500">${stats.platformFees.toLocaleString()} in fees</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600">Pending Actions</span>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.openDisputes}</div>
                <p className="text-sm text-gray-500">{stats.openDisputes} open disputes</p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="disputes" className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger 
                value="disputes" 
                className="data-[state=active]:bg-[#20A277] data-[state=active]:text-white"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Disputes ({stats.openDisputes})
              </TabsTrigger>
              <TabsTrigger 
                value="audit"
                className="data-[state=active]:bg-[#20A277] data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Audit Log
              </TabsTrigger>
            </TabsList>

            {/* Disputes Tab */}
            <TabsContent value="disputes">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Open Disputes</h3>
                    <p className="text-sm text-gray-600">Review and resolve task disputes</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="font-semibold text-gray-700">ID</TableHead>
                          <TableHead className="font-semibold text-gray-700">Task</TableHead>
                          <TableHead className="font-semibold text-gray-700">Parties</TableHead>
                          <TableHead className="font-semibold text-gray-700">Status</TableHead>
                          <TableHead className="font-semibold text-gray-700">Created</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {disputes.map((dispute) => (
                          <TableRow key={dispute.id} className="hover:bg-gray-50">
                            <TableCell className="font-mono text-sm text-gray-900">{dispute.id}</TableCell>
                            <TableCell className="font-semibold text-gray-900">{dispute.taskTitle}</TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">
                                <div>Worker: {dispute.worker}</div>
                                <div>Client: {dispute.client}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  dispute.status === "open" 
                                    ? "bg-red-100 text-red-700 hover:bg-red-100" 
                                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                }
                              >
                                {dispute.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(dispute.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm"
                                onClick={() => router.push(`/admin-dashboard/dispute/${dispute.id}`)}
                                className="bg-[#20A277] hover:bg-[#1a8a63] text-white"
                              >
                                Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Log Tab */}
            <TabsContent value="audit">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Audit Log</h3>
                    <p className="text-sm text-gray-600">Track all administrative actions</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="font-semibold text-gray-700">Action</TableHead>
                          <TableHead className="font-semibold text-gray-700">Admin User</TableHead>
                          <TableHead className="font-semibold text-gray-700">Target</TableHead>
                          <TableHead className="font-semibold text-gray-700">Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditLogs.map((log) => (
                          <TableRow key={log.id} className="hover:bg-gray-50">
                            <TableCell className="font-semibold text-gray-900">{log.action}</TableCell>
                            <TableCell className="text-sm text-gray-600">{log.user}</TableCell>
                            <TableCell className="font-mono text-sm text-gray-900">{log.target}</TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(log.timestamp).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

