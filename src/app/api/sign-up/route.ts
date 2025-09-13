import dbConnect from "@/lib/db";
import { UserModel } from "@/models/Users";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";




export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isverified: true

        })
        if (existingVerifiedUser) {
            return NextResponse.json({ success: false, message: "User already exist" }, { status: 400 })
        }
        const userExistByEmail = await UserModel.findOne({
            email
        })
        if (userExistByEmail) {
            if (userExistByEmail?.isverified) {
                return NextResponse.json({ success: false, message: "User already exist" }, { status: 400 });
            } else {
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                const hashedPassword = await bcrypt.hash(password, 10);
                userExistByEmail.password = hashedPassword;
                userExistByEmail.verificationCode = verifyCode;
                userExistByEmail.verificationExpiry = expiryDate;

                await userExistByEmail.save();

            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const user = new UserModel({
                username,
                email,
                password: hashedPassword,
                isAcceptingMessage: true,
                isverified: false,
                message: [],
                verificationCode: verifyCode,
                verificationExpiry: expiryDate,
            })
            await user.save();
        }
        const emailResponse = await sendVerificationEmail(username, email, verifyCode);

        if (!emailResponse.success) {
            return NextResponse.json({ success: false, message: "error in sending verification mail while singUp" }, { status: 400 });
        } else {
            return NextResponse.json({ success: true, message: "User is signed-Up successfully" }, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Error in signing Up" }, { status: 400 })

    }


}