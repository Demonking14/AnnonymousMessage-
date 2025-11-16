import dbConnect from "@/lib/db";
import { UserModel } from "@/models/Users";
import { Message } from "@/models/Users";
export async function POST(request:Request) {
    await dbConnect();
    const {username , content} = await request.json();
    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success:false , 
                message:"User not found with this username"
            } , {status:403})
        }

        const newMessage = {content , createdAt:new Date()};
        user.message.push(newMessage as Message);
        await user.save();

        return Response.json({
            success:true,
            message:"Message has been sent successfully"
        } , {status:200})
        
    } catch (error) {
        console.log("Error in sending message" , error)
        return Response.json({
            success:false , 
            message:"Error in sending messsage API"
         } , {status:500})
    }
}