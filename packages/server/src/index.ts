import { createServer } from 'http';
import app from './app.js';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initializeSocket } from './config/socket.js';
import { startReminderScheduler } from './schedulers/reminder.scheduler.js';

const startServer = async (): Promise<void> => {
  try {
    // Connect to databases
    await connectDB();
    await connectRedis();

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io
    initializeSocket(httpServer);

    // Start the reminder scheduler
    startReminderScheduler();

    // Start listening
    httpServer.listen(config.port, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('  🏥 Medical Scheduling Server');
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`  🌐 Server:     http://localhost:${config.port}`);
      console.log(`  📡 API:        http://localhost:${config.port}/api`);
      console.log(`  🔌 Socket.io:  ws://localhost:${config.port}`);
      console.log(`  🌍 Environment: ${config.nodeEnv}`);
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');
    });

    // Graceful shutdown
    const shutdown = async (): Promise<void> => {
      console.log('\n🛑 Shutting down gracefully...');
      httpServer.close(() => {
        console.log('👋 Server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
