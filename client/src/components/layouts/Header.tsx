import Button from "components/ui/Button"
import Card from "components/ui/Card"

const NewBidButton = () => {
    return (
        <Button type="primary">New bid</Button>
    )
}

const SignInButton = () => {
    return (
        <Button type="secondary">Sign in</Button>
    )
}

const Header = () => {
	return (
        <Card>
            <div  className="flex justify-between items-center">
                <NewBidButton/>
                <SignInButton/>
            </div>
        </Card>
    )
}

export default Header
