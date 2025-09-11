import {z} from 'zod';

export const isAcceptingSchema = z.object({
    isAccept : z.boolean()
})