

import { z } from "zod";


export const messageSchema = z.object({
    content: z.string().min(2, "must be more than 2 characters").max(300, "must be less than 300"),
})