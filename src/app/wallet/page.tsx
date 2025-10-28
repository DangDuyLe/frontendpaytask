'use client';

import { useState, useEffect } from "react";
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
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { walletApi, type Wallet, type Transaction } from "@/api";

export default function WalletPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's wallets
      const walletsResponse = await walletApi.getUserWallets();
      
      if (walletsResponse && walletsResponse.length > 0) {
        const userWallet = walletsResponse[0]; // Get first wallet
        setWallet(userWallet);
        
        // Get wallet balance
        const balanceResponse = await walletApi.getUsdcBalance(userWallet.id);
        setBalance(parseFloat(balanceResponse.balance));
        
        // Get transactions
        const txResponse = await walletApi.getTransactions(userWallet.id);
        setTransactions(txResponse.transactions || []);
      }
    } catch (err: any) {
      console.error('Error fetching wallet data:', err);
      setError(err?.error?.message || 'Failed to load wallet data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!wallet) {
      toast({
        title: "Error",
        description: "No wallet found. Please create a wallet first.",
        variant: "destructive"
      });
      return;
    }

    // Validate recipient address
    if (!recipientAddress || recipientAddress.trim().length === 0) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid recipient address",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 5) {
      toast({
        title: "Invalid amount",
        description: "Minimum withdrawal is $5.00",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive"
      });
      return;
    }

    try {
      setWithdrawing(true);
      
      const response = await walletApi.withdraw(wallet.id, {
        amount,
        assetId: 'usdc', // Default to USDC
        recipientAddress: recipientAddress.trim(),
      });

      if (response.success) {
        toast({
          title: "Withdrawal initiated",
          description: `$${amount} will be sent to ${recipientAddress.slice(0, 8)}...${recipientAddress.slice(-8)}. Transaction: ${response.transactionId || 'Pending'}`,
        });
        
        setWithdrawAmount("");
        setRecipientAddress("");
        
        // Refresh wallet data
        fetchWalletData();
      }
    } catch (err: any) {
      console.error('Error withdrawing:', err);
      toast({
        title: "Withdrawal failed",
        description: err?.error?.message || 'Failed to process withdrawal. Please try again.',
        variant: "destructive"
      });
    } finally {
      setWithdrawing(false);
    }
  };

  const copyAddress = () => {
    if (wallet?.addresses?.solana) {
      navigator.clipboard.writeText(wallet.addresses.solana);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate stats
  const pendingBalance = 0; // TODO: Calculate from pending submissions
  const totalEarned = transactions
    .filter(tx => tx.direction === 'Received')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Wallet & Payments</h1>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading wallet...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchWalletData}>Retry</Button>
            </div>
          ) : (
            <>
              {/* Balance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">
                      ${balance.toFixed(2)}
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
                      ${pendingBalance.toFixed(2)}
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
                      ${totalEarned.toFixed(2)}
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
                    <div className="font-medium">{wallet?.walletName || 'Your Wallet'}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {wallet?.addresses?.solana || 'No address'}
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
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    type="text"
                    placeholder="Enter Solana wallet address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the Solana address where you want to receive your funds
                  </p>
                </div>

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
                    Available: ${balance.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWithdrawAmount((balance * 0.25).toFixed(2))}
                  >
                    25%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWithdrawAmount((balance * 0.5).toFixed(2))}
                  >
                    50%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWithdrawAmount((balance * 0.75).toFixed(2))}
                  >
                    75%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWithdrawAmount(balance.toFixed(2))}
                  >
                    Max
                  </Button>
                </div>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-white" 
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                >
                  {withdrawing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Withdraw'
                  )}
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
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {tx.direction === "Received" ? (
                              <ArrowDownLeft className="h-4 w-4 text-accent" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="capitalize">{tx.direction}</span>
                          </div>
                        </TableCell>
                        <TableCell>{tx.assetName} - {tx.network}</TableCell>
                        <TableCell>
                          {formatDate(tx.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${tx.direction === "Received" ? "text-accent" : ""}`}>
                          {tx.direction === "Received" ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {tx.hash && (
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No transactions yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



