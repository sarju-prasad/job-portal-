import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import router from './routers/user.router.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));
app.use('/api/user', router);

const PORT = 8000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at Port no. ${PORT}`);
    });
}).catch((err) => {
    console.error(`Failed to connect to the database: ${err}`);
    process.exit(1); 
});
