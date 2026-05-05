import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { socketClient } from './client';
import { ClientToServerEvents, ServerToClientEvents } from './events';

// Hook: Listen to socket events
export const useSocketEvent = <K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K],
) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = socketClient.getSocket();

    const wrappedHandler = (...args: unknown[]) => {
      Reflect.apply(
        handlerRef.current as (this: void, ...args: unknown[]) => void,
        undefined,
        args,
      );
    };

    socket.on(event, wrappedHandler as never);

    return () => {
      socket.off(event, wrappedHandler as never);
    };
  }, [event]);
};

// Hook: Emit socket events (type-safe)
export const useSocketEmit = () => {
  const emit = useCallback(
    <K extends keyof ClientToServerEvents>(
      event: K,
      ...args: Parameters<ClientToServerEvents[K]>
    ) => {
      const socket = socketClient.getSocket();
      if (socketClient.isSocketConnected()) {
        socket.emit(event, ...args);
      } else {
        console.warn(`⚠️ Socket not connected, cannot emit: ${event}`);
      }
    },
    [],
  );

  return { emit };
};

// Hook: Connection status
export const useSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    const socket = socketClient.getSocket();

    const onConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id || null);
      console.log('✅ Socket connected in hook');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setSocketId(null);
      console.log('❌ Socket disconnected in hook');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Check current status
    setIsConnected(socketClient.isSocketConnected());
    setSocketId(socket.id || null);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { isConnected, socketId };
};

// Hook: Handle app state changes (background/foreground)
export const useSocketAppState = () => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App comes to foreground - reconnect if needed
        if (!socketClient.isSocketConnected()) {
          console.log('🔄 App foreground, reconnecting socket...');
          socketClient.reconnect();
        }
      } else if (nextAppState === 'background') {
        // App goes to background - optional: disconnect to save battery
        // But keep connection for push notifications
        console.log('📱 App background, socket stays connected');
      }
    });

    return () => subscription.remove();
  }, []);
};
