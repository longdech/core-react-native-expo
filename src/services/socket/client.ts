import { io, Socket } from 'socket.io-client';

import { ENV } from '@/constants/env';

import { ClientToServerEvents, ServerToClientEvents, SocketOptions } from './events';

const getSocketBaseUrl = (): string => {
  if (!__DEV__) {
    return ENV.apiUrl ?? '';
  }

  return `http://${ENV.serverIp}:${ENV.serverPort}`;
};

/**
 * Single-flight socket singleton.
 *
 * Important: `socket.connected` is false while the handshake is still in progress.
 * Treating that as "no socket" and calling `io()` again creates duplicate managers,
 * duplicate listeners, and duplicate "Initializing…" logs.
 */
class SocketClient {
  private static instance: SocketClient;

  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private pingIntervalId: ReturnType<typeof setInterval> | null = null;
  private internalListenersBound = false;

  private constructor() {}

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  /** Create the client once; reuse the same instance while connecting or reconnecting. */
  initialize(options?: SocketOptions): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (this.socket) {
      if (this.socket.connected) {
        return this.socket;
      }
      // Handshake in progress or closed — never allocate a second `io()` here.
      if (!this.socket.active) {
        this.socket.connect();
      }
      return this.socket;
    }

    const baseUrl = getSocketBaseUrl();
    if (__DEV__) {
      // eslint-disable-next-line no-console -- socket lifecycle is useful in dev
      console.log(`🔌 Initializing socket connection to: ${baseUrl}`);
    }

    this.socket = io(baseUrl, {
      autoConnect: options?.autoConnect ?? true,
      reconnection: options?.reconnection ?? true,
      reconnectionAttempts: options?.reconnectionAttempts ?? this.maxReconnectAttempts,
      reconnectionDelay: options?.reconnectionDelay ?? 1000,
      reconnectionDelayMax: 5000,
      timeout: options?.timeout ?? 10000,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: {
        token: undefined,
      },
    });

    this.attachInternalListeners();
    return this.socket;
  }

  /**
   * Returns the live socket, creating it on first use only.
   * Does not create a new `io()` just because `connected` is still false.
   */
  getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!this.socket) {
      return this.initialize();
    }
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  disconnect(): void {
    if (this.pingIntervalId != null) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
    this.internalListenersBound = false;

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    if (__DEV__) {
      // eslint-disable-next-line no-console -- socket lifecycle is useful in dev
      console.log('🔌 Socket manually disconnected');
    }
  }

  updateAuthToken(token: string): void {
    if (this.socket) {
      this.socket.auth = { ...this.socket.auth, token };
    }
  }

  reconnect(): void {
    if (this.socket) {
      if (!this.socket.connected) {
        this.socket.connect();
      }
    } else {
      this.initialize();
    }
  }

  private attachInternalListeners(): void {
    if (!this.socket || this.internalListenersBound) {
      return;
    }
    this.internalListenersBound = true;

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      if (__DEV__) {
        // eslint-disable-next-line no-console -- socket lifecycle is useful in dev
        console.log('✅ Socket connected! ID:', this.socket?.id);
      }
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      if (__DEV__) {
        // eslint-disable-next-line no-console -- socket lifecycle is useful in dev
        console.log('❌ Socket disconnected:', reason);
      }

      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      // eslint-disable-next-line no-console -- connection errors should surface
      console.error('🔌 Socket connection error:', error.message);
      this.reconnectAttempts += 1;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        // eslint-disable-next-line no-console -- operator-facing reconnect cap
        console.error('❌ Max reconnect attempts reached');
      }
    });

    if (this.pingIntervalId != null) {
      clearInterval(this.pingIntervalId);
    }
    this.pingIntervalId = setInterval(() => {
      if (this.isConnected) {
        this.socket?.emit('ping');
      }
    }, 25_000);
  }
}

export const socketClient = SocketClient.getInstance();
