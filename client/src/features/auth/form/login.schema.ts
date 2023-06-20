import { z } from "zod";

const loginSchema = z.object({
    login: z.string().min(4, { message: "login should be at least 4 letters long"}),
    password: z.string().min(4, { message: "Password should be at least 4 letters long"}),
})

export type LoginData = z.infer<typeof loginSchema>

export default loginSchema