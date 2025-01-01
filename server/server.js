import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv';
import connectToDB from './utils/db.js';
import CredientialsRoutes from './Routes/credientials-routes.js'
import TaskRoutes from './Routes/task-routes.js'
import AdminRoutes from './Routes/admin-routes.js'
import ManagerRoutes from './Routes/manager-routes.js'

configDotenv();
connectToDB();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000

app.use('/', CredientialsRoutes);
app.use('/', TaskRoutes);
app.use('/', AdminRoutes)
app.use('/', ManagerRoutes)

app.use('/test', (req,res)=>{
    res.send({message: 'Server is running'})
})

app.listen(PORT, (req,res)=>{
    console.log(`Server is listening on ${PORT}`);
    
})