import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from './index.js';
import { ClientToServerEvents, ServerToClientEvents } from '@medical/shared';

let io: Server;

// Track connected patients by their ID
const connectedPatients = new Map<string, Set<string>>(); // patientId -> Set of socket IDs

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Patient joins their room to receive updates
    socket.on(ClientToServerEvents.JOIN_PATIENT_ROOM, (patientId: string) => {
      socket.join(`patient:${patientId}`);
      
      // Track this connection
      if (!connectedPatients.has(patientId)) {
        connectedPatients.set(patientId, new Set());
      }
      connectedPatients.get(patientId)!.add(socket.id);
      
      console.log(`📥 Patient ${patientId} joined room via socket ${socket.id}`);
    });

    // Patient leaves their room
    socket.on(ClientToServerEvents.LEAVE_PATIENT_ROOM, (patientId: string) => {
      socket.leave(`patient:${patientId}`);
      
      // Remove from tracking
      connectedPatients.get(patientId)?.delete(socket.id);
      if (connectedPatients.get(patientId)?.size === 0) {
        connectedPatients.delete(patientId);
      }
      
      console.log(`📤 Patient ${patientId} left room`);
    });

    socket.on('disconnect', () => {
      // Clean up from all patient rooms
      connectedPatients.forEach((sockets, patientId) => {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            connectedPatients.delete(patientId);
          }
        }
      });
      
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Check if a patient is currently online
export const isPatientOnline = (patientId: string): boolean => {
  return connectedPatients.has(patientId) && connectedPatients.get(patientId)!.size > 0;
};

// Emit to a specific patient's room
export const emitToPatient = (patientId: string, event: ServerToClientEvents, data: unknown): void => {
  getIO().to(`patient:${patientId}`).emit(event, data);
};
