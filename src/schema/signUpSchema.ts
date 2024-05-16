import { z } from "zod"
export const usernameSchema = z.string().min(2, "user name must me more than 2 characters").max(20, "user name must be more than 20 characters")


export const signUpSchema = z.object({
    username: usernameSchema,
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }).max(100, { message: "Password must be less than 100 characters long" })
});