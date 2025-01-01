import mongoose from "mongoose";


const connectToDB = async () =>{
    try{
        const con = await mongoose.connect(process.env.DATABASE_URL)
        if(con){
            console.log('Connected to DB');
        }
    }
    catch(error){
        console.log('Failed to connect with DB');
        
    }
}

export default connectToDB