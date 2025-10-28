# Hướng dẫn sử dụng API trong Client Dashboard

## 🎯 Đã tích hợp

### 1. **API để lấy danh sách tasks của client**

**File:** `src/api/tasks.api.ts`

**Function:** `tasksApi.getMyTasks()`

```typescript
// Lấy tất cả tasks của client hiện tại
const response = await tasksApi.getMyTasks({
  status: 'open',        // Filter theo status: draft, open, in_progress, completed
  page: 1,
  limit: 20,
  sortBy: 'createdAt',  // Sắp xếp theo: createdAt, reward, deadline
  order: 'desc'         // asc hoặc desc
});
```

**Response:**
```typescript
{
  success: true,
  data: {
    data: Task[],        // Mảng các task
    pagination: {
      page: 1,
      limit: 20,
      total: 100,
      totalPages: 5
    }
  }
}
```

### 2. **API để xem chi tiết một task**

**File:** `src/api/tasks.api.ts`

**Function:** `tasksApi.getTaskById(taskId)`

```typescript
// Lấy chi tiết task theo ID
const response = await tasksApi.getTaskById('task-uuid-here');
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string,
    title: string,
    description: string | null,
    category: string | null,
    reward: string,           // Số tiền dạng string
    qty: number,             // Tổng số lượng cần hoàn thành
    deadline: string | null,  // ISO date string
    status: string,          // draft, open, in_progress, completed, cancelled
    createdAt: string,       // ISO date string
    client: {
      id: string,
      email: string
    },
    _count: {
      assignments: number    // Số lượng đã được accept/hoàn thành
    }
  }
}
```

## 📋 Đã implement trong Client Dashboard

### Features đã hoạt động:

1. ✅ **Tự động load tasks khi mở trang**
2. ✅ **Filter tasks theo status** (All, Open, Draft, Completed)
3. ✅ **Hiển thị thống kê** (Total Spent, Active Tasks, Completions)
4. ✅ **Loading state** (spinner khi đang load)
5. ✅ **Error handling** (hiển thị lỗi nếu API fail)
6. ✅ **Empty state** (hiển thị khi chưa có task)
7. ✅ **Format ngày tháng** (2 hours ago, 1 day ago, etc.)
8. ✅ **Status badges** (màu khác nhau cho mỗi status)
9. ✅ **Navigate to detail** (click View Details để xem chi tiết)

### Component structure:

```typescript
export default function ClientDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({ ... });

  // Fetch tasks khi component mount hoặc tab thay đổi
  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  const fetchTasks = async () => {
    // Gọi API tasksApi.getMyTasks()
    // Tính toán stats từ data
  };
}
```

## 🔧 Các API khác có sẵn

### Tasks API

```typescript
import { tasksApi } from '@/api';

// Tạo task mới (draft)
await tasksApi.createTask({
  title: "Task title",
  description: "Description",
  category: "Category",
  reward: 5.0,
  qty: 100,
  deadline: "2025-12-31T00:00:00Z"
});

// Cập nhật task draft
await tasksApi.updateTaskDraft(taskId, {
  title: "New title",
  reward: 10.0
});

// Publish task (fund and make it available)
await tasksApi.publishTask(taskId);

// Xóa task
await tasksApi.deleteTask(taskId);

// Lấy tất cả tasks (không filter theo user)
await tasksApi.getAllTasks({
  category: "Data Entry",
  minReward: 1.0,
  maxReward: 10.0
});
```

### Wallet API

```typescript
import { walletApi } from '@/api';

// Lấy số dư USDC
await walletApi.getUsdcBalance(walletId);

// Lấy danh sách wallets
await walletApi.getUserWallets();

// Lấy lịch sử giao dịch
await walletApi.getTransactions(walletId);

// Rút tiền
await walletApi.withdraw(walletId, {
  recipientAddress: "address",
  amount: 100,
  assetId: "USDC"
});
```

### Users API

```typescript
import { usersApi } from '@/api';

// Lấy profile
await usersApi.getProfile();

// Cập nhật profile
await usersApi.updateProfile({
  email: "new@email.com",
  username: "newname"
});
```

### Stats API

```typescript
import { statsApi } from '@/api';

// Lấy thống kê tasks
await statsApi.getTaskStats();

// Lấy danh sách categories
await statsApi.getCategories();
```

## 🎨 Custom Hooks đã tạo

### useTask - Lấy chi tiết task

```typescript
import { useTask } from '@/hooks/useApi';

function TaskDetail({ taskId }: { taskId: string }) {
  const { task, loading, error, refetch } = useTask(taskId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!task) return <div>Task not found</div>;

  return <div>{task.title}</div>;
}
```

### useTasks - Lấy danh sách tasks

```typescript
import { useTasks } from '@/hooks/useApi';

function TaskList() {
  const { tasks, loading, error, pagination, refetch } = useTasks({
    status: 'open',
    page: 1,
    limit: 20
  });

  // Use tasks, pagination, etc.
}
```

### useAuth - Authentication

```typescript
import { useAuth } from '@/hooks/useAuth';

function Header() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={() => login(email, password)}>Login</button>;
  }

  return (
    <div>
      Welcome {user?.username}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🚀 Các bước tiếp theo

### 1. Test API với Backend

Đảm bảo backend đang chạy:
```bash
cd e:\SwiftPath\PayTask\PayTask
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3000`

### 2. Chạy Frontend

```bash
cd e:\SwiftPath\PayTask\PayTask\frontend\frontendpaytask
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3001` (hoặc port khác)

### 3. Test flow hoàn chỉnh

1. Đăng ký/Đăng nhập
2. Vào Client Dashboard
3. Tạo task mới
4. Xem danh sách tasks
5. Click "View Details" để xem chi tiết task

### 4. Các trang cần tích hợp API tiếp theo:

- [ ] **Task Detail Page** - Hiển thị chi tiết task, danh sách workers, submissions
- [ ] **Create Task Page** - Tạo task mới
- [ ] **Update Task Page** - Cập nhật task draft
- [ ] **Worker Dashboard** - Danh sách assignments của worker
- [ ] **Wallet Page** - Quản lý ví, giao dịch
- [ ] **Profile Page** - Quản lý profile

## 📝 Notes

- Tất cả API đều tự động xử lý authentication token
- Token được lưu trong localStorage khi login/register
- Token tự động được gửi trong header `Authorization: Bearer <token>`
- Khi logout, token được xóa khỏi localStorage
- API base URL được config trong `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3000/api`

## 🐛 Debugging

Nếu gặp lỗi:

1. Check console để xem error message
2. Check Network tab trong DevTools để xem request/response
3. Kiểm tra backend có đang chạy không
4. Kiểm tra `.env.local` có đúng API URL không
5. Kiểm tra token có hợp lệ không (localStorage -> accessToken)
