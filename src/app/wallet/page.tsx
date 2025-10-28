'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

export default function Wallet() {
  const router = useRouter();
  const { toast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Mock data
  const walletData = {
    balance: 1247.50,
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f3f9a",
    pendingBalance: 125.00,
    totalEarned: 3240.00,
    transactions: [
      {
        id: "1",
        type: "credit",
        amount: 5.00,
        description: "Task completion - Menu verification",
        date: "2025-10-26T14:30:00",
        status: "completed",
        txHash: "0x1234...5678"
      },
      {
        id: "2",
        type: "debit",
        amount: 100.00,
        description: "Withdrawal to wallet",
        date: "2025-10-25T09:15:00",
        status: "completed",
        txHash: "0xabcd...efgh"
      },
      {
        id: "3",
        type: "credit",
        amount: 15.00,
        description: "Task completion - Data entry",
        date: "2025-10-24T16:45:00",
        status: "completed",
        txHash: "0x9876...5432"
      },
      {
        id: "4",
        type: "credit",
        amount: 30.00,
        description: "Task completion - Survey response",
        date: "2025-10-23T11:20:00",
        status: "completed",
        txHash: "0xijkl...mnop"
      },
      {
        id: "5",
        type: "debit",
        amount: 50.00,
        description: "Withdrawal to wallet",
        date: "2025-10-22T14:00:00",
        status: "completed",
        txHash: "0xqrst...uvwx"
      }
    ]
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 5) {
      toast({
        title: "Invalid amount",
        description: "Minimum withdrawal is $5.00",
        variant: "destructive"
      });
      return;
    }
    if (amount > walletData.balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Withdrawal initiated",
      description: `$${amount} will be sent to your wallet within 1 hour.`,
    });
    setWithdrawAmount("");
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.walletAddress);
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Wallet & Payments</h1>

          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  ${walletData.balance.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Ready to withdraw</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${walletData.pendingBalance.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Being reviewed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${walletData.totalEarned.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Info & Withdrawal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Wallet</CardTitle>
                <CardDescription>Your crypto wallet for receiving payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <WalletIcon className="h-8 w-8 text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">Your Wallet</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {walletData.walletAddress}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>Minimum withdrawal: $5.00</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="5"
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: ${walletData.balance.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWithdrawAmount((walletData.balance * 0.25).toFixed(2))}
                  >
                    25%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWithdrawAmount((walletData.balance * 0.5).toFixed(2))}
                  >
                    50%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWithdrawAmount((walletData.balance * 0.75).toFixed(2))}
                  >
                    75%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWithdrawAmount(walletData.balance.toFixed(2))}
                  >
                    Max
                  </Button>
                </div>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-white" 
                  onClick={handleWithdraw}
                >
                  Withdraw
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent payments and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {walletData.transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tx.type === "credit" ? (
                            <ArrowDownLeft className="h-4 w-4 text-accent" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell>
                        {new Date(tx.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${tx.type === "credit" ? "text-accent" : ""}`}>
                        {tx.type === "credit" ? "+" : "-"}${tx.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};



