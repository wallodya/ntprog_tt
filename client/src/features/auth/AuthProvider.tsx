import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { User, isUserType } from "./types/auth.types"
import { UserData } from "../../utils/validation/schemas/user-data.schema"

export type AuthContextValue = {
	user: User | null
    removeUser: () => void
	updateUser: (userData: UserData) => void
}

const initialContext: AuthContextValue = {
	user: null,
    removeUser: () => {},
    updateUser: () => {},
}

const AuthContext = createContext<AuthContextValue>(initialContext)

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }: { children: ReactNode }) => {

	const [user, setUser] = useState<User | null>(null)
    
	const removeUser = () => {
        setUser(null)
		localStorage.removeItem("user")
	}

	const initUser = () => {
		const userDataLS = localStorage.getItem("user")
		if (!userDataLS) {
			return
		}
		const parsedUserData = JSON.parse(userDataLS)

		if (isUserType(parsedUserData)) {
			setUser(parsedUserData)
		}
	}

	useEffect(() => {
		initUser()
	}, [])

    const updateUser = (userData: UserData) => {
        const { subscriptions, ...userInfo } = userData
		setUser(userInfo)
		localStorage.setItem("user", JSON.stringify(userInfo))
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				updateUser,
                removeUser
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider
