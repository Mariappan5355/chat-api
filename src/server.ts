import express, { Request, Response } from 'express';
import apiRoutes from './routes/apiRoutes';
import dotenv from 'dotenv';
import { connectDatabase } from './database';
import cors from 'cors';
import { Server as WebSocketServer } from 'ws';
import { createServer } from 'http';
import { messageService } from './services/messageService';
import bodyParser from 'body-parser';
import { connectMongoDatabase } from './mongoDatabase';


dotenv.config();
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
connectDatabase();

connectMongoDatabase().then(() => {
  console.log('MongoDB connected'); 
}).catch(err => {
  console.error('Error connecting to MongoDB:', err); 
});

app.use('/api', apiRoutes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
messageService.initializeWebSocket(wss);


