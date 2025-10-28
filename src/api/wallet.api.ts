// Wallet API
import { apiFetch, getHeaders } from './config';

// Types
export interface CreateWalletRequest {
  walletName: string;
  fystackWalletId?: string;
  fystackWorkspaceId?: string;
  addresses?: any;
  isActive?: boolean;
}

export interface WithdrawRequest {
  recipientAddress: string;
  amount: number;
  assetId: string;
}

export interface Wallet {
  id: string;
  userId: string;
  walletName: string;
  fystackWalletId: string;
  fystackWorkspaceId: string;
  addresses: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletBalance {
  balance: string;
  asset: {
    id: string | null;
    symbol: string;
    name: string;
  };
}

export interface DepositAddress {
  address: string;
  network: string;
  assetId: string;
}

export interface Transaction {
  id: string;
  hash: string;
  amount: string;
  assetSymbol: string;
  assetName: string;
  type: string;
  fromAddress: string;
  toAddress: string;
  blockTime: string;
  network: string;
  displayAmount: string;
  direction: 'Received' | 'Sent';
  timestamp: string;
  status: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
}

export interface WithdrawResponse {
  success: boolean;
  transactionId?: string;
  transactionHash?: string | null;
  amount: number;
  asset: string;
  toAddress: string;
  network: string;
  status: string;
  message: string;
}

// API Functions
export const walletApi = {
  // POST /api/wallets
  createWallet: async (data: CreateWalletRequest): Promise<Wallet> => {
    return await apiFetch('/wallets', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  // GET /api/wallets
  getUserWallets: async (): Promise<Wallet[]> => {
    return await apiFetch('/wallets', {
      method: 'GET',
      headers: getHeaders(true),
    });
  },

  // GET /api/wallets/:walletId
  getWalletById: async (walletId: string): Promise<Wallet> => {
    return await apiFetch(`/wallets/${walletId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
  },

  // GET /api/wallets/:walletId/usdc-balance
  getUsdcBalance: async (walletId: string): Promise<WalletBalance> => {
    return await apiFetch(`/wallets/${walletId}/usdc-balance`, {
      method: 'GET',
      headers: getHeaders(true),
    });
  },

  // GET /api/wallets/:walletId/deposit-address
  getDepositAddress: async (walletId: string, assetId: string): Promise<DepositAddress> => {
    return await apiFetch(`/wallets/${walletId}/deposit-address?asset_id=${assetId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
  },

  // POST /api/wallets/:walletId/sync-solana-address
  syncSolanaAddress: async (walletId: string): Promise<{ message: string }> => {
    return await apiFetch(`/wallets/${walletId}/sync-solana-address`, {
      method: 'POST',
      headers: getHeaders(true),
    });
  },

  // GET /api/wallets/:walletId/transactions
  getTransactions: async (walletId: string): Promise<TransactionListResponse> => {
    return await apiFetch(`/wallets/${walletId}/transactions`, {
      method: 'GET',
      headers: getHeaders(true),
    });
  },

  // POST /api/wallets/:walletId/withdraw
  withdraw: async (walletId: string, data: WithdrawRequest): Promise<WithdrawResponse> => {
    return await apiFetch(`/wallets/${walletId}/withdraw`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },
};
