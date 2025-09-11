import {z} from "zod";

const username = z.string().min(2 , {message:"Username should be atleast more than 2 character"}).max(14 , {message:"Username cannot be more than 14 characters"}).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ,  {message:"special character is not allowed"});



export const signupSchema = z.object({
    username:username,
    email: z.email(),
    password:z.string().min(5  , {message:"Password must be atleast 5 character"})
})

