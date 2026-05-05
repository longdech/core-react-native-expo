export interface ServerToClientEvents {
  // Server gửi xuống client
  'new-notification': (data: NotificationPayload) => void;
  'fake-ad': (data: AdPayload) => void;
  'user-connected': (data: UserStatusPayload) => void;
  'user-disconnected': (data: UserStatusPayload) => void;
  'message-received': (data: MessagePayload) => void;
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;
}

export interface ClientToServerEvents {
  // Client gửi lên server
  'join-room': (data: { roomId: string; userId: string }) => void;
  'leave-room': (data: { roomId: string; userId: string }) => void;
  'send-message': (data: SendMessagePayload) => void;
  typing: (data: { roomId: string; userId: string; isTyping: boolean }) => void;
  ping: () => void;
}

// Payload types
export interface NotificationPayload {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time?: string;
}

export interface AdPayload {
  message: string;
  time: string;
}

export interface UserStatusPayload {
  userId: string;
  userName: string;
  timestamp: string;
}

export interface MessagePayload {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface SendMessagePayload {
  roomId: string;
  content: string;
}

// Socket connection options
export interface SocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  timeout?: number;
}
