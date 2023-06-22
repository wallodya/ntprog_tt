import Button from "components/ui/Button"
import Card from "components/ui/Card"
import DialogContainer from "components/ui/dialog/DialogContainer"
import { useAuth } from "features/auth/AuthProvider"
import AuthForm from "features/auth/form/AuthForm"
import SignOutButton from "./SignOutButton"

const Title = () => {
	return (
		<div>
            <h1 className="font-semibold text-neutral-900/70">
                Test task for NT Progress
            </h1>
        </div>
	)
}

const SignInButton = () => {
	return (
        <DialogContainer>
            <Button styleType="primary">Sign in</Button>
            <AuthForm />
        </DialogContainer>
	)
}

const Header = () => {
	const { user } = useAuth()

	return (
		<Card>
			<div className="flex justify-between items-center">
				<Title />
				<div>
					{user ? (
						<div className="flex gap-8 items-center">
							<p className="text-neutral-900/70 font-semibold">
								{user.login}
							</p>
							<SignOutButton />
						</div>
					) : (
						<SignInButton />
					)}
				</div>
			</div>
		</Card>
	)
}

export default Header
