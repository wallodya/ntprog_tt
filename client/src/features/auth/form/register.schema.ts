import { z } from "zod";

const registerSchema = z
	.object({
		login: z
			.string()
			.min(4, { message: "Login should be at least 4 letters long" }),
		password: z
			.string()
			.min(4, { message: "Password should be at least 4 letters long" }),
		confirmPassword: z
			.string()
			.min(4, { message: "Password should be at least 4 letters long" }),
	})
	.refine(
		data => {
            if (data.password !== data.confirmPassword) {
                return false
            }

			return true
		},
		{ message: "Password don't match", path: ["confirmPassword"]}
	)

export type RegisterData = z.infer<typeof registerSchema>

export default registerSchema