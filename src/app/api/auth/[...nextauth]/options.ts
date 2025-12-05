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
                identifier: {
                    label: "Email or Username",
                    type: "text",
                    placeholder: "example@gmail.com"
                },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {
             await   dbConnect();

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
                const dbUser = user as any; 
                token._id = dbUser._id;
                token.username = dbUser.username;
                token.email = dbUser.email;
                token.isVerified = dbUser.isverified;
                token.isAcceptingMessage = dbUser.isAcceptingMessage;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
         
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return `${baseUrl}/dashboard`;
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




