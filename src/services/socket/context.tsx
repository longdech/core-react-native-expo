import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { socketClient } from './client';

interface SocketContextValue {
  isConnected: boolean;
  socketId: string | null;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

/**
 * Owns connection state for the app tree. Socket IO itself is a singleton on
 * `socketClient`; this provider only mirrors `connect` / `disconnect` for React.
 */
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    const socket = socketClient.getSocket();

    const onConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id ?? null);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setSocketId(null);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected) {
      onConnect();
    } else {
      setIsConnected(false);
      setSocketId(null);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, socketId }}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
