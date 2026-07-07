import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import express from 'express';
import router from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { ENV } from './app/config/env';
import './app/config/passport';

const app = express();

app.use(
  session({
    secret: ENV.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: ENV.NODE_ENV === 'production' ? true : false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(cookieParser());
app.set('trust proxy', 1);
app.use('/api/v1', router);

app.get('/', (_req, res) => {
  res.send('API is running');
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found',
  });
});

app.use(globalErrorHandler);

export default app;
