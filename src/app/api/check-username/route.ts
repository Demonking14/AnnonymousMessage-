import {success, z} from 'zod'
import dbConnect from '@/lib/db'
import { UserModel } from '@/models/Users'
import { usernamevalidate } from '@/schemas/SignUpSchema'

const usernameQuerySchema = z.object({
    username:usernamevalidate
})

export async function GET(request:Request) {
    await dbConnect();
    const {searchParams} = new URL(request.url);
    const usernameQuery = {
        username:searchParams.get('username')
    }
    const result = usernameQuerySchema.safeParse(usernameQuery);
    console.log(result);
    if(!result.success){
        const userError = result.error.format().username?._errors || [];
        return Response.json({
            success:false,
            message:userError?.length>0? userError.join(' , '): "Error in getting username from params "
        } , {status :400})
    }

    const {username} = result.data;
    const existingUser = await UserModel.findOne({username , isverified:true} );

    if(existingUser){
        return Response.json({success :false , message:'Username already exist'} , {status:200})
    }

    return Response.json({success:true , message:"Username is available"} , {status:200})



}