# 🎯 PayTask - Decentralized Task Management Platform

A modern task management platform built with Next.js 14, TypeScript, and Tailwind CSS. Connects clients who need tasks completed with workers who want to earn.

## 🚀 Recent Updates (Oct 26, 2025)

### ✨ Major Flow Improvements:
- ✅ **Dynamic Routing** - Clean URLs với `/task-flow/[taskId]/[qtyId]`
- ✅ **Unified Workspace** - Merged task-workspace vào task-flow (1 page thay vì 2)
- ✅ **Auto Role Detection** - Tự động phát hiện client/worker view
- ✅ **Quantity Management** - Mỗi quantity = 1 workspace riêng biệt
- ✅ **Better UX** - Worker tabs (Instructions, Submit, Progress)

📖 **Chi tiết:** Xem `FLOW_CHANGES_SUMMARY.md`

---

## 📂 Project Structure (Updated)

```
src/app/
  ├── admin-dashboard/       # Admin panel
  ├── client-dashboard/      # ✅ Client manages tasks & reviews
  ├── create-task/           # ✅ Create new tasks
  ├── discover-tasks/        # Worker browses available tasks
  ├── login/                 # Authentication
  ├── notifications/         # Notification center
  ├── profile/               # User profiles
  ├── settings/              # App settings
  ├── signup/                # Registration
  ├── support/               # Help & support
  ├── task-detail/           # ✅ Task details with quick review
  ├── task-flow/             
  │   └── [taskId]/
  │       └── [qtyId]/       # ⭐ NEW: Unified workspace (client + worker)
  ├── wallet/                # Payment & wallet
  └── worker-dashboard/      # ✅ Worker views assignments

src/components/
  ├── ui/                    # Shadcn/ui components
  ├── Navigation.tsx         # Main navigation
  ├── Footer.tsx             # Footer
  └── ...                    # Other shared components
```

### 📄 Documentation Files:
- `FLOW_DOCUMENTATION.md` - Detailed technical documentation
- `FLOW_VISUAL_GUIDE.md` - Visual diagrams & UI flows
- `FLOW_CHANGES_SUMMARY.md` - Summary of all changes
- `QUICK_START.md` - Quick start guide
- `CHECKLIST.md` - Implementation verification checklist


---

## 🎯 Key Features

### For Clients:
- ✅ Create tasks with quantity & rewards
- ✅ Track all quantities & workers in real-time
- ✅ Quick review submissions from task detail
- ✅ Approve/Request Revision/Reject workflow
- ✅ Communication with workers
- ✅ Escrow payment protection

### For Workers:
- ✅ Browse available tasks
- ✅ Accept & manage assignments
- ✅ Unified workspace with tabs (Instructions, Submit, Progress)
- ✅ Upload multiple files
- ✅ Track progress timeline
- ✅ Communication with clients
- ✅ Instant payment upon approval

---

## 🔄 User Flows

### Client Flow:
```
Client Dashboard 
  → Task Detail (view all quantities & workers)
    → Task Flow (/task-flow/[taskId]/[qtyId])
      → Review submission
        → Approve/Reject/Request Revision
```

### Worker Flow:
```
Worker Dashboard (tasks accepted)
  → Task Flow (/task-flow/[taskId]/[qtyId])
    → Read instructions
      → Submit work
        → Track progress
          → Get paid when approved ✅
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React
- **State Management:** React Hooks
- **Routing:** Next.js Dynamic Routes

---

## 🚀 Getting Started

### Prerequisites:
```bash
Node.js 18+ 
npm or yarn or pnpm
```

### Installation:

### Installation:

```bash
# Clone the repository
git clone <your-repo-url>
cd frontendpaytask

# Install dependencies
npm install

# Run development server
npm run dev
```

### Development Server:

### Development Server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production:

```bash
npm run build
npm start
```

---

## 📱 Demo Routes

### Test URLs:
```
Worker Dashboard:    /worker-dashboard
Client Dashboard:    /client-dashboard
Task Detail:         /task-detail?id=1&role=client
Task Flow (Worker):  /task-flow/task-123/qty-1
Task Flow (Client):  /task-flow/task-123/qty-review-1
```

---

## 📖 Documentation

### Quick Links:
- 🚀 **Quick Start:** `QUICK_START.md` - Get started in 5 minutes
- 📊 **Flow Guide:** `FLOW_VISUAL_GUIDE.md` - Visual diagrams & UI flows
- 📚 **Full Docs:** `FLOW_DOCUMENTATION.md` - Complete technical docs
- ✅ **Checklist:** `CHECKLIST.md` - Verification checklist
- 📝 **Changes:** `FLOW_CHANGES_SUMMARY.md` - What's new

### Key Concepts:
1. **Task** - A job posted by client (e.g., "Label 1000 images")
2. **Quantity** - Portion of task assigned to worker (e.g., 50 images)
3. **Workspace** - Individual page for each quantity at `/task-flow/[taskId]/[qtyId]`

**Relationship:** `1 Task → N Quantities → Each Quantity = 1 Worker + 1 Workspace`

---

## 🧪 Testing

### Manual Testing:
```bash
# Test Worker Flow
1. Go to /worker-dashboard
2. Click any assignment
3. Verify tabs: Instructions, Submit Work, Progress
4. Try uploading files
5. Check timeline updates

# Test Client Flow
1. Go to /client-dashboard
2. Click a task
3. View quantities list
4. Click "Quick Review"
5. Try approve/reject actions
```

### Run Linter:
```bash
npm run lint
```

---

## 🎨 UI Components

Built with [Shadcn/ui](https://ui.shadcn.com/):
- Button, Card, Badge, Avatar
- Tabs, Dialog, Separator
- Input, Textarea, Label, Select
- Table, Alert Dialog

**Customization:** Edit `src/components/ui/` files

---

## 🔐 Authentication (To be integrated)

Current: Mock authentication
Future: 
- JWT tokens
- Role-based access control
- OAuth providers

---

## 💳 Payment Integration (To be integrated)

Current: Mock escrow system
Future:
- Smart contract integration
- Cryptocurrency payments
- Fiat gateway

---

## 🚧 Roadmap

### Phase 1 (Current) ✅
- [x] Core UI/UX
- [x] Dynamic routing
- [x] Unified workspace
- [x] Role-based views

### Phase 2 (Next)
- [ ] Backend API integration
- [ ] Real authentication
- [ ] File upload to cloud
- [ ] WebSocket for real-time updates

### Phase 3 (Future)
- [ ] Payment processing
- [ ] Rating & review system
- [ ] Advanced analytics
- [ ] Mobile app

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💬 Support

Questions? Check:
- Documentation files (see above)
- Code comments in files
- Mock data for examples

---

## 🎉 Acknowledgments

- Next.js team for amazing framework
- Shadcn for beautiful UI components
- Tailwind CSS for styling system
- Lucide for icons

---

**Last Updated:** October 26, 2025  
**Version:** 2.0 (Dynamic Routing + Unified Workspace)  
**Status:** ✅ Production Ready (Frontend)

---
