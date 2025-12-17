import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import { UserModel } from "@/models/Users";


export async function DELETE(request:Request , {params} :{params:{messageID:string}}) {
    const messageID = params.messageID;
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if(!session || !user){
            return Response.json({
                success:false,  
                message:"Not authenticated to get message"
            } , {status:401});
        }
        const updatedResult = await UserModel.updateOne(
            {_id:user._id } , 
            {$pull:{message:{_id:messageID}}}
        )

        if(updatedResult.modifiedCount ===0){
            return Response.json({success:false , message:"No message found or already deleted"} , {status:400})
        }
     

        return Response.json({
            success:true, 
            message:"Message deleted Successfully"
        } , {status:200})

    } catch (error: unknown) {
        console.log("Error in delete-message route")
            return Response.json({
                success:false , 
                message:"Got caught in delete-message "
            } , {status:500})
        }        
    }
    
