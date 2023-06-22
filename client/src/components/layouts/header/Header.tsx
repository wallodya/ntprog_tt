import * as Dialog from "@radix-ui/react-dialog"
import Button from "components/ui/Button"
import Card from "components/ui/Card"
import DialogContainer from "components/ui/dialog/DialogContainer"
import { useAuth } from "features/auth/AuthProvider"
import AuthForm from "features/auth/form/AuthForm"
import Ticker from "features/ticker/Ticker"
import SignOutButton from "./SignOutButton"

const NewBidButton = () => {
	return (
		<DialogContainer>
			<Button styleType="primary">New order</Button>
			<Ticker />
		</DialogContainer>
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
				<NewBidButton />
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
