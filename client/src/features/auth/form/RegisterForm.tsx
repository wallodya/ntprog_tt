import { zodResolver } from "@hookform/resolvers/zod"
import Button from "components/ui/Button"
import FormFieldError from "components/ui/FormFieldError"
import FormInput from "components/ui/FormInput"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAuthFetch } from "./auth-form.hooks"
import registerSchema, { RegisterData } from "./register.schema"

const RegisterForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterData>({
		resolver: zodResolver(registerSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
	})

    const { mutate: signUp, isLoading } = useAuthFetch("register")

	const onSubmit: SubmitHandler<RegisterData> = data => {
		signUp(data)
	}

	return (
		<form
            autoComplete="none"
			className="h-full flex flex-col gap-2"
			onSubmit={handleSubmit(onSubmit)}
		>
			<FormFieldError err={errors.login} />
			<FormInput placeholder="Login" {...register("login")} />

			<FormFieldError err={errors.password} />
			<FormInput placeholder="Password" {...register("password")} />

			<FormFieldError err={errors.confirmPassword} />
			<FormInput
				placeholder="Confirm password"
				{...register("confirmPassword")}
			/>

			<Button styleType="primary" className="mt-auto">
				{isLoading ? "Loading..." : "Create account"}
			</Button>
		</form>
	)
}

export default RegisterForm
