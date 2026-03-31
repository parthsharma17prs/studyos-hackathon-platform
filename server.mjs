import express from 'express';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = process.env.PORT || 3000;

// Setup Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  // TestLFrame Backend Integration
  server.use(cors({ origin: true, credentials: true }));
  
  const testApiRouter = express.Router();
  testApiRouter.use(express.json());

  // Dynamic import of testlframe routes since they are ES modules
  const codeExecutionRoutes = (await import('./testlframe/backend/routes/codeExecution.js')).default;
  const proctoringRoutes = (await import('./testlframe/backend/routes/proctoring.js')).default;
  const quizRoutes = (await import('./testlframe/backend/routes/quiz.js')).default;
  const frameworkRoutes = (await import('./testlframe/backend/routes/framework.js')).default;
  const telemetryRoutes = (await import('./testlframe/backend/routes/telemetry.js')).default;
  const { setupSocketHandlers } = await import('./testlframe/backend/socket/handlers.js');

  testApiRouter.get('/health', (req, res) => res.json({status: 'ok'}));
  testApiRouter.use('/code-execution', codeExecutionRoutes);
  testApiRouter.use('/proctoring', proctoringRoutes);
  testApiRouter.use('/quizzes', quizRoutes);
  testApiRouter.use('/framework', frameworkRoutes);
  testApiRouter.use('/telemetry', telemetryRoutes);

  server.use('/api', testApiRouter);

  // Serve TestLFrame Frontend (Vite Build)
  const staticPath = path.join(__dirname, 'testlframe/frontend/dist');
  server.use('/global-exam', express.static(staticPath));
  server.get('/global-exam', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
  server.use('/global-exam', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  // Next.js handles everything else
  server.use((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const httpServer = createServer(server);

  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
  });
  
  setupSocketHandlers(io);

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Single-host server ready on http://${hostname}:${port}`);
    console.log(`> Handling Next.js, Test API, and WebSockets!`);
  });
});
