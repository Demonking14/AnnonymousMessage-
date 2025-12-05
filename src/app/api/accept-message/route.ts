import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import { UserModel } from "@/models/Users";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;
        if (!session || !user) {
            return Response.json({
                success: false,
                message: "Not authenticated user",
            }, {
                status: 401
            })
        }
        const {isAcceptingMessage} = await request.json();
        const userId = user._id;
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, { isAcceptingMessage: isAcceptingMessage }, { new: true }
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Error while toggling Accept message"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "Message acceptance updated successfully"
        }, { status: 200 })
    } catch (error) {
        console.log("Catch error in accept-message")
        return Response.json(
            {
                success: false,
                message: "Error in accept message toggle"
            },
            {
                status: 500
            })
    }
}

export async function GET(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;
        if (!session || !user) {
            return Response.json({
                success: false,
                message: "Not authenticated"
            }, { status: 400 })
        }
        const userId = user._id;
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({ success: false, message: "Error in finding the user using userId" }, { status: 400 })
        }

        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage,
            message: "IsAcceptingMessage fetched successfully"
        }, {
            status: 200
        })
    } catch (error) {
        console.log("Error while getting isAcceptingMessage");
        return Response.json({
            success: false,
            message: "Error in getting the isAccepting Message"
        }, { status: 500 })
    }
}