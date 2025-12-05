import { UserModel } from "@/models/Users";
import dbConnect from "@/lib/db";

export async function POST(request: Request) {
    await dbConnect(); // Fixed: add await
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        
        if (!decodedUsername) {
            return Response.json(
                {
                    success: false,
                    message: "No decoded username found"
                }, 
                { status: 400 }
            );
        }
        
        const user = await UserModel.findOne({ username: decodedUsername }); // Fixed: proper query
        
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "No user found with this username"
                },
                { status: 400 }
            );
        }
        
        const isCodeValid = user.verificationCode === code;
        const isExpired = new Date(user.verificationExpiry) < new Date(); // Fixed: < instead of >
        
        if (isCodeValid && !isExpired) {
            user.isverified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "User verified successfully"
                }, 
                { status: 200 }
            );
        }
        else if (!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid Verification code"
                }, 
                { status: 400 }
            );
        } 
        else {
            return Response.json(
                {
                    success: false,
                    message: "Verification code expired. Please sign up again to generate a new code"
                }, 
                { status: 400 }
            );
        }

    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false, // Fixed: false instead of true
                message: "Error in Verification Code API"
            }, 
            { status: 500 }
        );
    }
}