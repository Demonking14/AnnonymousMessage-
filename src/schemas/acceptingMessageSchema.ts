import {z} from 'zod';

export const isAcceptingSchema = z.object({
    isAcceptingMessage : z.boolean()
})