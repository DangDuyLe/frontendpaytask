# PayTask API Client

Thư mục này chứa tất cả các API functions để giao tiếp với PayTask Backend.

## 📁 Cấu trúc

```
api/
├── config.ts              # Cấu hình API, base URL, headers, auth helpers
├── auth.api.ts            # Authentication APIs (register, login, logout)
├── tasks.api.ts           # Tasks APIs (create, update, publish, delete, list)
├── assignments.api.ts     # Assignments APIs (accept task, list assignments)
├── submissions.api.ts     # Submissions APIs (create, get, request fix)
├── ratings.api.ts         # Ratings APIs (create, get ratings & stats)
├── reviews.api.ts         # Reviews APIs (accept, reject, refund)
├── wallet.api.ts          # Wallet APIs (create, balance, transactions, withdraw)
├── users.api.ts           # Users APIs (profile, update, deactivate)
├── stats.api.ts           # Statistics APIs (task stats, categories)
├── errorlogs.api.ts       # Error Logs APIs (create, list, resolve, cleanup)
├── health.api.ts          # Health Check APIs
└── index.ts               # Export tất cả APIs
```

## 🚀 Cách sử dụng

### 1. Cấu hình môi trường

Tạo file `.env.local` trong thư mục `frontend/frontendpaytask`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Import và sử dụng

#### Cách 1: Import từng API module

```typescript
import { authApi } from '@/api/auth.api';
import { tasksApi } from '@/api/tasks.api';

// Đăng ký
const registerUser = async () => {
  try {
    const response = await authApi.register({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'client'
    });
    console.log('User registered:', response.data);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

// Lấy danh sách tasks
const getTasks = async () => {
  try {
    const response = await tasksApi.getAllTasks({
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      order: 'desc'
    });
    console.log('Tasks:', response.data);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }
};
```

#### Cách 2: Import tất cả từ index

```typescript
import { authApi, tasksApi, walletApi } from '@/api';

// Sử dụng như bình thường
await authApi.login({ email: '...', password: '...' });
```

## 📚 API Modules

### 🔐 Authentication (`auth.api.ts`)

```typescript
// Đăng ký
authApi.register({ username, email, password, role? })

// Đăng nhập
authApi.login({ email, password })

// Đăng xuất
authApi.logout()

// Lấy thông tin user hiện tại
authApi.getCurrentUser()
```

### 📝 Tasks (`tasks.api.ts`)

```typescript
// Tạo task mới (draft)
tasksApi.createTask({ title, description?, category?, reward, qty, deadline? })

// Cập nhật task draft
tasksApi.updateTaskDraft(taskId, { title?, description?, ... })

// Publish task
tasksApi.publishTask(taskId)

// Xóa task
tasksApi.deleteTask(taskId)

// Lấy danh sách tasks
tasksApi.getAllTasks({ category?, minReward?, maxReward?, sortBy?, order?, page?, limit? })

// Lấy chi tiết task
tasksApi.getTaskById(taskId)
```

### 📋 Assignments (`assignments.api.ts`)

```typescript
// Worker nhận task
assignmentsApi.acceptTask({ taskId, workerId? })

// Lấy danh sách assignments với filter
assignmentsApi.listAssignments({ workerId?, status?, page?, limit? })

// Lấy assignments của worker
assignmentsApi.getMyAssignments(workerId?)
```

### 📤 Submissions (`submissions.api.ts`)

```typescript
// Tạo submission
submissionsApi.createSubmission({
  assignmentId,
  payloadUrl,
  payloadHash,
  metadata?: { fileSize, fileName, mimeType }
})

// Lấy chi tiết submission
submissionsApi.getSubmissionById(submissionId)

// Yêu cầu sửa (Admin only)
submissionsApi.requestFix(submissionId, { feedback })
```

### ⭐ Ratings (`ratings.api.ts`)

```typescript
// Tạo rating
ratingsApi.createRating({ toUserId, taskId, score, comment? })

// Lấy tất cả ratings
ratingsApi.getAllRatings({ page?, limit? })

// Lấy rating theo ID
ratingsApi.getRatingById(ratingId)

// Lấy ratings của task
ratingsApi.getRatingsByTask(taskId)

// Lấy ratings do user đưa ra
ratingsApi.getRatingsGivenByUser(userId)

// Lấy ratings user nhận được
ratingsApi.getRatingsReceivedByUser(userId)

// Lấy thống kê rating
ratingsApi.getRatingStats(userId, { includeRecent? })
```

### 🔍 Reviews (`reviews.api.ts`)

```typescript
// Chấp nhận submission
reviewsApi.acceptSubmission({ submissionId, feedback? })

// Từ chối submission
reviewsApi.rejectSubmission({ submissionId, feedback })

// Hoàn tiền (Admin/Support only)
reviewsApi.refundTask({ taskId, reason })

// Lấy review theo ID
reviewsApi.getReviewById(reviewId)

// Lấy reviews của submission
reviewsApi.getReviewsBySubmission(submissionId)

// Lấy danh sách pending refunds (Admin)
reviewsApi.getPendingRefunds()
```

### 💰 Wallet (`wallet.api.ts`)

```typescript
// Tạo wallet
walletApi.createWallet({ walletName, ... })

// Lấy danh sách wallets
walletApi.getUserWallets()

// Lấy chi tiết wallet
walletApi.getWalletById(walletId)

// Lấy số dư USDC
walletApi.getUsdcBalance(walletId)

// Lấy địa chỉ deposit
walletApi.getDepositAddress(walletId, assetId)

// Đồng bộ địa chỉ Solana
walletApi.syncSolanaAddress(walletId)

// Lấy lịch sử giao dịch
walletApi.getTransactions(walletId)

// Rút tiền
walletApi.withdraw(walletId, { recipientAddress, amount, assetId })
```

### 👥 Users (`users.api.ts`)

```typescript
// Lấy profile
usersApi.getProfile()

// Cập nhật profile
usersApi.updateProfile({ email?, username? })

// Vô hiệu hóa tài khoản
usersApi.deactivateAccount()

// Lấy tất cả users (Admin)
usersApi.getAllUsers()

// Lấy user theo ID
usersApi.getUserById(userId)
```

### 📊 Statistics (`stats.api.ts`)

```typescript
// Lấy thống kê tasks
statsApi.getTaskStats()

// Lấy danh sách categories
statsApi.getCategories()

// Xóa cache
statsApi.clearCache()
```

### 🐛 Error Logs (`errorlogs.api.ts`)

```typescript
// Tạo error log
errorLogsApi.createErrorLog({ errorCode, errorMessage, ... })

// Lấy danh sách error logs
errorLogsApi.listErrorLogs({ page?, limit?, severity?, ... })

// Lấy thống kê errors
errorLogsApi.getStatistics(startDate?, endDate?)

// Lấy error log theo ID
errorLogsApi.getErrorLogById(errorLogId)

// Resolve error log
errorLogsApi.resolveErrorLog(errorLogId, { resolvedBy, notes? })

// Cleanup old logs
errorLogsApi.cleanup(daysOld?)
```

### 💚 Health (`health.api.ts`)

```typescript
// Health check
healthApi.healthCheck()

// Readiness check
healthApi.readinessCheck()

// Liveness check
healthApi.livenessCheck()
```

## 🔑 Authentication

API client tự động quản lý authentication token:

- Khi login/register thành công, token được lưu vào `localStorage`
- Khi logout, token được xóa khỏi `localStorage`
- Các API yêu cầu authentication tự động gửi token trong header

### Manual token management

```typescript
import { setAuthToken, getAuthToken, removeAuthToken } from '@/api/config';

// Lưu token
setAuthToken('your-token-here');

// Lấy token
const token = getAuthToken();

// Xóa token
removeAuthToken();
```

## ⚠️ Error Handling

Tất cả API functions đều throw error khi request thất bại:

```typescript
try {
  const response = await tasksApi.createTask(data);
  console.log('Success:', response);
} catch (error: any) {
  // Error có cấu trúc:
  // {
  //   success: false,
  //   error: {
  //     message: 'Error message',
  //     code: 'ERROR_CODE',
  //     details?: {...}
  //   }
  // }
  console.error('Error:', error.error?.message);
}
```

## 🎯 Next Steps

Sau khi tạo xong các API functions, bạn có thể:

1. **Tích hợp vào Components**: Import và sử dụng trong các React components
2. **Tạo Custom Hooks**: Tạo hooks như `useAuth`, `useTasks`, `useWallet` để quản lý state
3. **Thêm React Query**: Sử dụng `@tanstack/react-query` để cache và manage API calls
4. **Error Boundary**: Tạo error boundary để handle API errors globally

## 📝 Ví dụ sử dụng trong Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { tasksApi, type Task } from '@/api';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await tasksApi.getAllTasks({
          page: 1,
          limit: 20,
          sortBy: 'createdAt',
          order: 'desc'
        });
        setTasks(response.data.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

## 🔗 Liên kết

- Backend Routes: `src/routes/`
- Backend Services: `src/services/`
- API Documentation: Swagger UI tại `http://localhost:3000/documentation`
