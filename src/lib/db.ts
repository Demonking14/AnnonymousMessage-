import mongoose from "mongoose";

type connectionObject =  {
    isConnected ? : number

}

const connection : connectionObject = {};

async function dbConnect ():Promise<void>{
   if(connection.isConnected){
    console.log("Database is alreaady connected ")
    return;
   }

   try {
    const connecting = await mongoose.connect(process.env.MONGO_URI || '');
    // console.log(connecting.connections[0] );
    connection.isConnected =connecting.connections[0].readyState;

    console.log("Db connected successfully");
    
   } catch (error: unknown) {
    console.log("Error in connecting to mongoDB" , error);

    process.exit(1);
    
   }

}

export default dbConnect;