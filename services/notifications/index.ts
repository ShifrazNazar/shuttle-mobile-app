// Push notification logic

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
}

export interface NotificationService {
  registerForPushNotifications: () => Promise<string | null>;
  sendNotification: (payload: NotificationPayload) => Promise<void>;
  scheduleNotification: (
    payload: NotificationPayload,
    trigger: any
  ) => Promise<void>;
  cancelNotification: (notificationId: string) => Promise<void>;
  getNotificationPermissions: () => Promise<boolean>;
}

export interface NotificationToken {
  token: string;
  userId: string;
  deviceType: "ios" | "android";
  createdAt: Date;
}

export {};
