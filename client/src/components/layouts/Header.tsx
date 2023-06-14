import Button from "components/ui/Button"
import Card from "components/ui/Card"
import * as Dialog from "@radix-ui/react-dialog"
import Ticker from "features/ticker/Ticker"

const NewBidButton = () => {
	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<Button type="primary">New bid</Button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed z-40 h-screen w-screen inset-0 bg-gray-950/70"/>
				<Dialog.Content>
					<Ticker/>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

const SignInButton = () => {
	return <Button type="secondary">Sign in</Button>
}

const Header = () => {
	return (
		<Card>
			<div className="flex justify-between items-center">
				<NewBidButton />
				<SignInButton />
			</div>
		</Card>
	)
}

export default Header
