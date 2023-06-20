import DialogContentWrapper from "components/ui/DialogContentWrapper"
import * as Tabs from "@radix-ui/react-tabs"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

const AuthForm = () => {
	return (
		<DialogContentWrapper>
			<Tabs.Root defaultValue="login">
				<Tabs.List
					className="grid grid-cols-2 gap-2 items-center"
					aria-label="Manage your account"
				>
					<Tabs.Trigger
						className="p-2 font-semibold col-start-1 rounded-lg border-2 border-neutral-400/50 aria-selected:border-neutral-900"
						value="login"
					>
						Sign in
					</Tabs.Trigger>
					<Tabs.Trigger
						className="p-2 font-semibold col-start-2 rounded-lg border-2 border-neutral-400/50 aria-selected:border-neutral-900"
						value="register"
					>
						Create account
					</Tabs.Trigger>
				</Tabs.List>
				<div className="h-[400px]">
					<Tabs.Content value="login" className="h-full">
						<LoginForm />
					</Tabs.Content>
					<Tabs.Content value="register" className="h-full">
						<RegisterForm />
					</Tabs.Content>
				</div>
			</Tabs.Root>
		</DialogContentWrapper>
	)
}

export default AuthForm
