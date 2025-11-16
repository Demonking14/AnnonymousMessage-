import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options";
import dbConnect from "@/lib/db";
import { UserModel } from "@/models/Users";
import mongoose from "mongoose";


export async function GET(request:Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;
        if(!session || !user){
            return Response.json({
                success:false,  
                message:"Not authenticated to get message"
            } , {status:401});
        }

        const userId = new mongoose.Types.ObjectId(user._id);

        const users = await UserModel.aggregate([
            {$match:{_id:userId}}, 
            {$unwind: '$message'},
            {$sort: {'message.createdAt' :-1}},
            {$group:{_id:'$_id', message: {$push:'$message'}}}

        ])

        if(!users || users.length === 0 ){
            return Response.json({
                success:false , 
                message:"No messages found or user not found"
            } , {status:404})
        }

        return Response.json({
            success:true, 
            message:users[0].message
        } , {status:200})

    } catch (error) {
        console.log("Error in get-message route")
            return Response.json({
                success:false , 
                message:"Got caught in get-message "
            } , {status:500})
        }        
    }
    
