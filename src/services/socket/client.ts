import { io, Socket } from 'socket.io-client';

import { ENV } from '@/constants/env';
import { devError, devLog, devWarn } from '@/utils/dev-log';

import { ClientToServerEvents, ServerToClientEvents, SocketOptions } from './events';

const getSocketBaseUrl = (): string => {
  if (!__DEV__) {
    return ENV.apiSocketUrl ?? '';
  }

  return `http://${ENV.serverIp}:${ENV.serverPort}`;
};

type QueuedEmit = {
  [K in keyof ClientToServerEvents]: {
    event: K;
    args: Parameters<ClientToServerEvents[K]>;
  };
}[keyof ClientToServerEvents];

/**
 * Single-flight socket singleton.
 *
 * Important: `socket.connected` is false while the handshake is still in progress.
 * Treating that as "no socket" and calling `io()` again creates duplicate managers,
 * duplicate listeners, and duplicate "Initializing…" logs.
 */
class SocketClient {
  private static instance: SocketClient;
  private static readonly MAX_EMIT_QUEUE = 50;

  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private pingIntervalId: ReturnType<typeof setInterval> | null = null;
  private internalListenersBound = false;
  private emitQueue: QueuedEmit[] = [];
  /** When false, periodic `ping` is not sent (saves battery in background). */
  private appInForeground = true;

  private constructor() {}

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  /**
   * Call from app lifecycle (e.g. `AppState`) so we only ping while foregrounded.
   */
  setAppInForeground(value: boolean): void {
    this.appInForeground = value;
  }

  /**
   * Emit now if connected; otherwise queue and flush on next `connect`.
   */
  emitOrQueue<K extends keyof ClientToServerEvents>(
    event: K,
    ...args: Parameters<ClientToServerEvents[K]>
  ): void {
    const socket = this.getSocket();
    if (this.isSocketConnected()) {
      socket.emit(event, ...args);
      return;
    }

    if (this.emitQueue.length >= SocketClient.MAX_EMIT_QUEUE) {
      this.emitQueue.shift();
      devWarn('socket', 'emit queue full, dropped oldest');
    }

    this.emitQueue.push({ event, args } as QueuedEmit);
    devWarn('socket', 'queued emit (offline):', String(event));

    if (!socket.active) {
      socket.connect();
    }
  }

  private flushEmitQueue(): void {
    if (!this.socket || !this.isSocketConnected()) return;
    const emitLoose = this.socket.emit.bind(this.socket) as (
      event: keyof ClientToServerEvents,
      ...payload: unknown[]
    ) => void;
    while (this.emitQueue.length > 0) {
      const item = this.emitQueue.shift()!;
      emitLoose(item.event, ...(item.args as unknown[]));
    }
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
    devLog('socket', 'connecting:', baseUrl);

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
    this.emitQueue = [];

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    devLog('socket', 'disconnected (manual)');
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
      devLog('socket', 'connected', this.socket?.id);
      this.flushEmitQueue();
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      devLog('socket', 'disconnected:', reason);

      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      devError('socket', 'connect_error:', error.message);
      this.reconnectAttempts += 1;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        devError('socket', 'max reconnect attempts reached');
      }
    });

    if (this.pingIntervalId != null) {
      clearInterval(this.pingIntervalId);
    }
    this.pingIntervalId = setInterval(() => {
      if (!this.appInForeground) return;
      if (this.isConnected) {
        this.socket?.emit('ping');
      }
    }, 25_000);
  }
}

export const socketClient = SocketClient.getInstance();
