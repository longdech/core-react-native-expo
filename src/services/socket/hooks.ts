import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { devLog } from '@/utils/devLog';

import { socketClient } from './client';
import { SocketContext } from './context';
import { ClientToServerEvents, ServerToClientEvents } from './events';

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

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

// Hook: Emit socket events (type-safe); queues until connected when offline.
export const useSocketEmit = () => {
  const emit = useCallback(
    <K extends keyof ClientToServerEvents>(
      event: K,
      ...args: Parameters<ClientToServerEvents[K]>
    ) => {
      socketClient.emitOrQueue(event, ...args);
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
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setSocketId(null);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

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
    const apply = (state: AppStateStatus) => {
      const active = state === 'active';
      socketClient.setAppInForeground(active);
      if (active && !socketClient.isSocketConnected()) {
        devLog('socket', 'foreground → reconnect');
        socketClient.reconnect();
      }
    };

    apply(AppState.currentState);

    const subscription = AppState.addEventListener('change', apply);

    return () => subscription.remove();
  }, []);
};
