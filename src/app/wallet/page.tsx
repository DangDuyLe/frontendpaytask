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
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet & Payments</h1>
          <p className="text-gray-600">Manage your earnings and withdrawals</p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20A277]" />
              <p className="text-gray-600">Loading wallet...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchWalletData} className="bg-[#20A277] hover:bg-[#1a8d66] text-white">Retry</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Balance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <WalletIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-600">Available Balance</h3>
                    </div>
                    <div className="text-3xl font-bold text-[#20A277]">
                      ${balance.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Ready to withdraw</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <WalletIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-600">Pending Balance</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${pendingBalance.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Being reviewed</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <WalletIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-600">Total Earned</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${totalEarned.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">All time</p>
                  </div>
                </div>
              </div>

              {/* Wallet Info & Withdrawal */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Connected Wallet</h2>
                    <p className="text-sm text-gray-600 mt-1">Your crypto wallet for receiving payments</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="p-2 bg-[#20A277] rounded-lg">
                        <WalletIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{wallet?.walletName || 'Your Wallet'}</div>
                        <div className="text-sm text-gray-600 truncate">
                          {wallet?.addresses?.solana || 'No address'}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={copyAddress}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Withdraw Funds</h2>
                    <p className="text-sm text-gray-600 mt-1">Minimum withdrawal: $5.00</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient" className="text-sm font-medium text-gray-900">Recipient Address</Label>
                      <Input
                        id="recipient"
                        type="text"
                        placeholder="Enter Solana wallet address"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                      />
                      <p className="text-xs text-gray-600">
                        Enter the Solana address where you want to receive your funds
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-medium text-gray-900">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        min="5"
                        step="0.01"
                        className="border-gray-300 focus:border-[#20A277] focus:ring-[#20A277]"
                      />
                      <p className="text-xs text-gray-600">
                        Available: ${balance.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setWithdrawAmount((balance * 0.25).toFixed(2))}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        25%
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setWithdrawAmount((balance * 0.5).toFixed(2))}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        50%
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setWithdrawAmount((balance * 0.75).toFixed(2))}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        75%
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setWithdrawAmount(balance.toFixed(2))}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Max
                      </Button>
                    </div>
                    <Button 
                      className="w-full bg-[#20A277] hover:bg-[#1a8d66] text-white" 
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
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
                  <p className="text-sm text-gray-600 mt-1">Your recent payments and withdrawals</p>
                </div>
                <div className="p-6">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-gray-900 font-semibold">Type</TableHead>
                          <TableHead className="text-gray-900 font-semibold">Description</TableHead>
                          <TableHead className="text-gray-900 font-semibold">Date</TableHead>
                          <TableHead className="text-gray-900 font-semibold">Status</TableHead>
                          <TableHead className="text-gray-900 font-semibold text-right">Amount</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.length > 0 ? (
                          transactions.map((tx) => (
                            <TableRow key={tx.id} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {tx.direction === "Received" ? (
                                    <div className="p-1.5 bg-green-50 rounded">
                                      <ArrowDownLeft className="h-4 w-4 text-green-600" />
                                    </div>
                                  ) : (
                                    <div className="p-1.5 bg-gray-100 rounded">
                                      <ArrowUpRight className="h-4 w-4 text-gray-600" />
                                    </div>
                                  )}
                                  <span className="capitalize text-gray-900 font-medium">{tx.direction}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-700">{tx.assetName} - {tx.network}</TableCell>
                              <TableCell className="text-gray-600">
                                {formatDate(tx.timestamp)}
                              </TableCell>
                              <TableCell>
                                <Badge className={tx.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                                  {tx.status}
                                </Badge>
                              </TableCell>
                              <TableCell className={`text-right font-semibold ${tx.direction === "Received" ? "text-[#20A277]" : "text-gray-900"}`}>
                                {tx.direction === "Received" ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {tx.hash && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                              No transactions yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}