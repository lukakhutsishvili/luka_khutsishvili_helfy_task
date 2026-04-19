import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.use('/api/tasks', tasksRouter);


app.use((_, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

app.listen(PORT, () => {
    console.log(`Task Manager running on http://localhost:${PORT}`);
  });
  