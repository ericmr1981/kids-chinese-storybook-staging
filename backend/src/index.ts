import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes.js';

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});