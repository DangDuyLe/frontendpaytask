// API Index - Export all API modules
export * from './config';
export * from './auth.api';
export * from './tasks.api';
export * from './assignments.api';
export * from './submissions.api';
export * from './ratings.api';
export * from './reviews.api';
export * from './wallet.api';
export * from './users.api';
export * from './stats.api';
export * from './errorlogs.api';
export * from './health.api';
export * from './upload.api';

// Re-export all API functions for convenience
export { authApi } from './auth.api';
export { tasksApi } from './tasks.api';
export { assignmentsApi } from './assignments.api';
export { submissionsApi } from './submissions.api';
export { ratingsApi } from './ratings.api';
export { reviewsApi } from './reviews.api';
export { walletApi } from './wallet.api';
export { usersApi } from './users.api';
export { statsApi } from './stats.api';
export { errorLogsApi } from './errorlogs.api';
export { healthApi } from './health.api';
export { uploadApi } from './upload.api';
