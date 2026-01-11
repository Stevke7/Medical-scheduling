import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  ServerToClientEvents, 
  ClientToServerEvents,
  INewEventPayload,
  IReminderPayload 
} from '@medical/shared';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinPatientRoom: (patientId: string) => void;
  leavePatientRoom: (patientId: string) => void;
  onNewEvent: (callback: (payload: INewEventPayload) => void) => () => void;
  onReminder: (callback: (payload: IReminderPayload) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    const newSocket = io('/', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinPatientRoom = useCallback((patientId: string) => {
    if (socket) {
      socket.emit(ClientToServerEvents.JOIN_PATIENT_ROOM, patientId);
      console.log(`📥 Joined patient room: ${patientId}`);
    }
  }, [socket]);

  const leavePatientRoom = useCallback((patientId: string) => {
    if (socket) {
      socket.emit(ClientToServerEvents.LEAVE_PATIENT_ROOM, patientId);
      console.log(`📤 Left patient room: ${patientId}`);
    }
  }, [socket]);

  const onNewEvent = useCallback((callback: (payload: INewEventPayload) => void) => {
    if (!socket) return () => {};
    
    socket.on(ServerToClientEvents.NEW_EVENT_CREATED, callback);
    
    return () => {
      socket.off(ServerToClientEvents.NEW_EVENT_CREATED, callback);
    };
  }, [socket]);

  const onReminder = useCallback((callback: (payload: IReminderPayload) => void) => {
    if (!socket) return () => {};
    
    socket.on(ServerToClientEvents.EVENT_REMINDER, callback);
    
    return () => {
      socket.off(ServerToClientEvents.EVENT_REMINDER, callback);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinPatientRoom,
        leavePatientRoom,
        onNewEvent,
        onReminder,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
