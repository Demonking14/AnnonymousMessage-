import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { UserModel } from "@/models/Users";
import dbConnect from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@gmail.com" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {
                dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier }, { username: credentials.identifier }
                        ]
                    }
                    )

                    if (!user) {
                        throw new Error("No user found with this username or email");
                    }
                    if (!user.isverified) {
                        throw new Error("Please verify your account first");
                    }
                    const passwordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (passwordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("Incorrect password")
                    }

                } catch (error) {

                    throw new Error("Problem while signing In")

                }





            }
        })
    ],
    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token._id = user._id,
                    token.email = user.email,
                    token.isVerified = user.isVerified,
                    token.isAcceptingMessage = user.isAcceptingMessage

            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id,
                    session.user.email = token.email,
                    session.user.isVerified = token.isVerified,
                    session.user.isAcceptingMessage = token.isAcceptingMessage

            }
            return session
        },

    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET


}




