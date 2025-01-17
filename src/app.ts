import path from 'path';
import express from 'express';
import router from './controllers';
import { errorHandler } from './middlewares';

const app = express();
const publicDir = path.resolve(__dirname, '..', 'public');

app.use('/', express.json({ limit: '20mb' }));
app.use('/', router);
app.use('/files', express.static(publicDir));
app.use(errorHandler);

export default app;
