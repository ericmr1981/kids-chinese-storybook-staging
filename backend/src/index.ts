import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
  console.log(`ENCRYPTION_KEY length: ${process.env.ENCRYPTION_KEY ? process.env.ENCRYPTION_KEY.length : 'NOT SET'}`);
});