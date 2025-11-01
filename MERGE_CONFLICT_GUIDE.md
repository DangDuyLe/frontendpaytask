# Hướng Dẫn Giải Quyết Merge Conflicts

## Nguyên Tắc Giải Quyết Conflicts

### 📐 **Quy Tắc Chung:**
1. **Styling/Design/UI** → Giữ code từ `frontendonly` (HEAD)
2. **Backend Integration/API calls** → Giữ code từ `master` (origin/master)
3. **Logic & Data Flow** → Ưu tiên code từ `master` (có kết nối backend thực)

---

## 📋 Danh Sách Files Cần Fix

### ✅ Đã Fix (Có thể bỏ qua):
- `src/app/login/page.tsx` (đã git add)

### 🔴 Cần Fix Ngay (Files có conflict):

#### **1. src/app/signup/page.tsx**
**Conflict:** Styling vs API integration

**Hướng dẫn:**
```
✓ Giữ STYLING từ HEAD (frontendonly):
  - className với Tailwind CSS custom colors
  - Layout structure (Card, Button variants)
  - Icon components
  
✓ Giữ BACKEND LOGIC từ origin/master:
  - import { authApi } from "@/api"
  - import { useToast } from "@/hooks/use-toast"
  - Hàm handleSignup với API call thực
  - Loading states (isLoading, setIsLoading)
  - Toast notifications
```

**Cụ thể làm gì:**
- Merge imports: Lấy cả icons từ HEAD + authApi/useToast từ master
- Giữ JSX structure từ HEAD (layout đẹp hơn)
- Thay thế logic trong `handleSignup` bằng version từ master (có API call)
- Thêm loading state vào Button từ master

---

#### **2. src/app/task-detail/page.tsx**
**Conflict:** Mock data vs Real API

**Hướng dẫn:**
```
✓ Giữ STYLING từ HEAD:
  - Card layouts với border-gray-200, shadow-sm
  - Badge colors và variants
  - Table styling
  
✓ Giữ BACKEND từ origin/master:
  - API imports và hooks
  - useEffect với fetchTaskDetail
  - Real data structure từ API
  - Assignment và submission objects
```

**Cụ thể:**
- Xóa tất cả mock data
- Giữ layout/styling từ HEAD
- Sử dụng data fetching từ master
- Map data từ API vào UI components

---

#### **3. src/app/task-flow/[taskId]/[qtyId]/page.tsx**
**Conflict:** Mock workflow vs Real submission flow

**Hướng dẫn:**
```
✓ Giữ STYLING từ HEAD:
  - Tabs design
  - Progress indicators
  - Color schemes
  
✓ Giữ BACKEND từ origin/master:
  - File upload logic
  - Submission API calls
  - Review API calls
  - Assignment status management
```

**Cụ thể:**
- Xóa getMockTaskFlow() và getMockSubmittedTaskFlow()
- Giữ UI components và styling từ HEAD
- Sử dụng real data fetching từ master
- Integrate file upload API từ master

---

#### **4. src/app/update-task/[taskId]/page.tsx**
**Conflict:** Form styling vs API integration

**Hướng dẫn:**
```
✓ Giữ STYLING từ HEAD:
  - Form layout (2 columns)
  - Input styling
  - Summary card design
  
✓ Giữ BACKEND từ origin/master:
  - tasksApi imports
  - fetchTask useEffect
  - handleUpdateTask với API call
  - Loading & error states
```

---

#### **5. src/app/wallet/page.tsx**
**Conflict:** Mock wallet vs Real wallet API

**Hướng dẫn:**
```
✓ Giữ STYLING từ HEAD:
  - Card layouts
  - Transaction table design
  - Balance display styling
  
✓ Giữ BACKEND từ origin/master:
  - walletApi imports
  - fetchWalletData logic
  - Real transaction data
  - Withdrawal API integration
```

---

#### **6. src/app/worker-dashboard/page.tsx**
**Conflict:** Mock assignments vs Real assignments API

**Hướng dẫn:**
```
✓ Giữ STYLING từ HEAD:
  - Dashboard cards design
  - Stats grid layout
  - Assignment cards styling
  
✓ Giữ BACKEND từ origin/master:
  - assignmentsApi
  - fetchAssignments logic
  - Real assignment data structure
  - useAuth hook
```

---

## 🛠️ Các Bước Thực Hiện

### **Cho Mỗi File:**

1. **Mở file trong VS Code**
2. **Tìm các dòng conflict:**
   ```
   <<<<<<< HEAD
   (code từ frontendonly)
   =======
   (code từ master)
   >>>>>>> origin/master
   ```

3. **Áp dụng quy tắc:**
   - **Phần UI/Styling**: Chọn "Accept Current Change" (HEAD)
   - **Phần Logic/API**: Chọn "Accept Incoming Change" (master)
   - **Phần Mixed**: Chỉnh sửa thủ công, kết hợp cả hai

4. **Test import statements:**
   - Đảm bảo có đủ imports cho cả styling và API
   - Xóa các imports duplicate

5. **Lưu file**

6. **Stage changes:**
   ```bash
   git add <filepath>
   ```

---

## 📝 Template Giải Quyết Conflict

### **Pattern 1: Imports (Merge cả hai)**
```typescript
// ✅ KẾT QUẢ MONG MUỐN
import { useState } from "react"; // Chung
import { Button } from "@/components/ui/button"; // Chung
import { Card } from "@/components/ui/card"; // Chung
import { User, Check } from "lucide-react"; // Từ HEAD (styling)
import { apiClient } from "@/api"; // Từ master (backend)
import { useToast } from "@/hooks/use-toast"; // Từ master (backend)
```

### **Pattern 2: Component Structure (Giữ HEAD styling)**
```typescript
// ✅ Giữ layout từ HEAD
return (
  <div className="min-h-screen bg-gray-50"> {/* HEAD styling */}
    <Card className="border-gray-200 shadow-sm"> {/* HEAD styling */}
      {/* Nhưng data bên trong từ master API */}
      <CardContent>
        {apiData.map(item => ( {/* master data */}
          <div className="p-4 hover:bg-gray-50"> {/* HEAD styling */}
            {item.title} {/* master data */}
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);
```

### **Pattern 3: Event Handlers (Giữ master logic)**
```typescript
// ✅ Giữ logic từ master với API calls
const handleSubmit = async () => {
  setLoading(true); // master
  try {
    const response = await apiClient.post('/endpoint', data); // master
    if (response.success) {
      toast({ title: "Success" }); // master
      router.push('/dashboard'); // master
    }
  } catch (err) {
    toast({ title: "Error", variant: "destructive" }); // master
  } finally {
    setLoading(false); // master
  }
};

// Nhưng Button styling từ HEAD
<Button 
  className="bg-[#20A277] hover:bg-[#1a8a63]" // HEAD styling
  onClick={handleSubmit} // master logic
  disabled={loading} // master state
>
  Submit
</Button>
```

---

## ✅ Checklist Sau Khi Fix Mỗi File

- [ ] Không còn markers `<<<<<<<`, `=======`, `>>>>>>>`
- [ ] Imports đầy đủ (cả UI components và API)
- [ ] Styling/className giữ từ HEAD (frontendonly)
- [ ] Logic/API calls từ master
- [ ] File build thành công (không có lỗi TypeScript)
- [ ] Stage file: `git add <filepath>`

---

## 🚀 Sau Khi Fix Tất Cả Files

```bash
# 1. Kiểm tra status
git status

# 2. Commit merge
git commit -m "Merge master into frontendonly - Keep frontend styling + backend integration"

# 3. Push lên remote
git push origin frontendonly
```

---

## 🆘 Nếu Làm Sai

```bash
# Hủy merge và thử lại
git merge --abort

# Hoặc reset về trước khi merge
git reset --hard HEAD
```

---

## 📞 Câu Hỏi Thường Gặp

**Q: File quá nhiều conflict, không biết bắt đầu từ đâu?**
A: Bắt đầu từ imports → state declarations → JSX structure → event handlers

**Q: Giữ cả hai phần code có được không?**
A: Được, nhưng phải đảm bảo không duplicate và logic chạy đúng

**Q: Làm sao biết phần nào là styling, phần nào là backend?**
A: 
- Styling: className, Tailwind classes, layout structure, colors
- Backend: API calls, useEffect với fetch, async functions, error handling

---

**Good luck! 🎉**
