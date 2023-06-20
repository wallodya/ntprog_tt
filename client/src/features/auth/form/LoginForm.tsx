import { zodResolver } from "@hookform/resolvers/zod"
import FormFieldError from "components/ui/FormFieldError"
import FormInput from "components/ui/FormInput"
import { SubmitHandler, useForm } from "react-hook-form"
import loginSchema, { LoginData } from "./login.schema"
import Button from "components/ui/Button"
import { useAuthFetch } from "./auth-form.hooks"

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
	})

    const { mutate: signIn, isLoading } = useAuthFetch("login")

	const onSubmit: SubmitHandler<LoginData> = data => {
		signIn(data)
	}

	return (
		<form className="h-full flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
			<FormFieldError err={errors.login} />
			<FormInput placeholder="Login" {...register("login")} />

			<FormFieldError err={errors.password} />
			<FormInput placeholder="Password" {...register("password")} />

			<Button styleType="primary" className="mt-auto">
				{isLoading ? "Loading..." : "Sign in"}
			</Button>
		</form>
	)
}

export default LoginForm
