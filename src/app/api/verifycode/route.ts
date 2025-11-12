import { UserModel } from "@/models/Users";
import dbConnect from "@/lib/db";


export async function POST(request: Request) {
    dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        if (!decodedUsername) {
            return Response.json(
                {
                    success: false,
                    message: "No decoded username found"
                }, {
                status: 400
            }
            )
        }
        const user = await UserModel.findOne({ decodedUsername });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "No user found of this username"
                },
                {
                    status: 400
                }
            )
        }
        const isCodeValid = user.verificationCode === code;
        const isExpired = new Date(user.verificationExpiry) > new Date();
        if (isCodeValid && isExpired) {
            user.isverified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User verified successfully"
            }, {
                status: 200
            })
        }
        else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Invalid Verification code"
            }, {
                status: 400
            })
        } else {
            return Response.json({
                success: false,
                message: "verificaiton code expired please signup again to generate new verification code"
            }, {
                status: 400
            })

        }

    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: true,
                message: "Error in Verification Code API"
            }, {
            status: 500
        }
        )

    }


}