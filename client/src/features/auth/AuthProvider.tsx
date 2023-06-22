import { MarketSubscription } from "models/Base"
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { useSavedSubscriptions } from "features/quotes/subscriptions.hooks"
import { User, isUserType } from "./types/auth.types"
import { UserData } from "./types/user-data.schema"
import { saveSubscriptions } from "features/quotes/subscriptions.utils"

export type AuthContextValue = {
	subscriptions: MarketSubscription[]
	user: User | null
	controls: {
		addSubscription: (sub: MarketSubscription) => void
		removeSubscription: (id: number) => void
		removeUser: () => void
	}
	updateUser: (userData: UserData) => void
}

const initialContext: AuthContextValue = {
	user: null,
    controls: {
        addSubscription: (sub: MarketSubscription) => {},
        removeSubscription: (id: number) => {},
        removeUser: () => {}
    },
    updateUser: () => {},
    subscriptions: []
}

const AuthContext = createContext<AuthContextValue>(initialContext)

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const {
		removeSubscription,
		addSubscription,
		clearSubscriptions,
		setSubscriptions,
		subscriptions,
	} = useSavedSubscriptions()

	const [user, setUser] = useState<User | null>(null)
    
	const removeUser = () => {
        setUser(null)
        clearSubscriptions()
		localStorage.removeItem("user")
	}

    const [controls, setControls] = useState<AuthContextValue["controls"]>({
        removeSubscription, addSubscription, removeUser
    })

	const initUser = () => {
		const userDataLS = localStorage.getItem("user")
		if (!userDataLS) {
			return
		}
		const parsedUserData = JSON.parse(userDataLS)

		if (isUserType(parsedUserData)) {
			setUser(parsedUserData)
		}

		if (user) {
			setControls({
				removeSubscription,
				addSubscription,
				removeUser,
			})
			return
		}
	}

	useEffect(() => {
		initUser()
	}, [])

    const updateUser = (userData: UserData) => {
        const { subscriptions: userSubcriptions, ...userInfo } = userData
		setUser(userInfo)
        setSubscriptions(userSubcriptions)
		setControls({
			removeSubscription,
			addSubscription,
			removeUser,
		})
		localStorage.setItem("user", JSON.stringify(userInfo))
        saveSubscriptions(userSubcriptions)
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				updateUser,
				controls,
				subscriptions,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider
