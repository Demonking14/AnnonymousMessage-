import {z} from 'zod';

export const messageSchema = z.object({
    content : z.string().min(2 , "Message should be atleast 2 character").max(100 , "Message cannot be more than 100 characters")

})