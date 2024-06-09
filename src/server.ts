import express, { Request, Response } from 'express';
import apiRoutes from './routes/apiRoutes'
import dotenv from 'dotenv';
import { connectDatabase } from './database';
const cors = require('cors');


dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

connectDatabase();

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
