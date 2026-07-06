import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import router from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(cookieParser());
app.set('trust proxy', 1);
app.use('/api/v1', router);

// Default route for testing
app.get('/', (_req, res) => {
  res.send('API is running');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found',
  });
});

app.use(globalErrorHandler);

export default app;
