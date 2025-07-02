import express, {Request, Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth';
import journalRoutes from './routes/phi/journal';
import generalHealthRoutes from './routes/phi/generalHealth';
import sensorRoutes from './routes/phi/sensor';

const app = express();

// helps to parse JSON data
app.use(express.json());

// helps to parse urlencoded form data
app.use(express.urlencoded({ extended: true }));

// allows cross-origin requests
app.use(cors());

// set up the routes
app.use('/api/auth', authRoutes);
app.use('/api/phi/journal', journalRoutes);
app.use('/api/phi/generalHealth', generalHealthRoutes);
app.use('/api/phi/sensor', sensorRoutes);

// test endpoint
app.get('/api/test', async (req : Request, res : Response) => {
  res.json({message: 'Hello from the backend!'})
});

// start the server
app.listen(7000, () => {
    console.log('Server is running on http://localhost:7000');
})