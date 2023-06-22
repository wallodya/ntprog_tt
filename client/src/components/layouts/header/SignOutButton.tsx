import { useMutation } from "@tanstack/react-query"
import Button from "components/ui/Button"
import { useAuth } from "features/auth/AuthProvider"
import { useSubscriptions } from "features/subscriptions/SubscriptionsProvider"

const fetchSignOut = async () => {
    const url = process.env["REACT_APP_SERVER_URL"]

    await fetch(
        `${url}/auth/logout`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    )
}

const SignOutButton = () => {
    const { removeUser } = useAuth()
    const { clearSubscriptions } = useSubscriptions()

    const { mutate: signOut } = useMutation(fetchSignOut)

    const handleSignOut = () => {
        removeUser()
        clearSubscriptions()
        signOut()
    }

	return (
		<Button styleType="secondary" onClick={handleSignOut}>
			Sign out
		</Button>
	)
}

export default SignOutButton