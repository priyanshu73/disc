import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path'
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:4000/disc', 'http://localhost:4000/','138.234.44.121:4000/disc','138.234.44.121:4000'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/disc/api', apiRouter);

// app.get('/', (req, res) => {
//     res.json({ message: 'Hello from the controller!' })
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildDir = path.join(__dirname, 'build')
app.use('/disc', express.static(buildDir));

app.get(/^\/disc\/.*/, (req,res) => {
  res.sendFile(path.join(buildDir,'index.html'));
});
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 