import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useAuth } from "../AuthProvider"
import { isServerHttpException } from "../types/auth.types"
import userSchema from "../../../utils/validation/schemas/user-data.schema"
import { LoginData } from "./login.schema"
import { RegisterData } from "./register.schema"
import { useSubscriptions } from "features/subscriptions/SubscriptionsProvider"

export const useAuthFetch = (endpoint: "login" | "register") => {

    const { updateUser } = useAuth()
    const { setSubscriptions } = useSubscriptions()

    const fetchRegister = async (data: RegisterData | LoginData) => {
        const url = process.env["REACT_APP_SERVER_URL"]
    
        if (!url) {
            return
        }
    
        const response = await fetch(
			`${url}/auth/${endpoint}`,
			{
				method: "POST",
				body: JSON.stringify({
					login: data.login,
					password: data.password,
				}),
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}
		)
    
        const resData = await response.json()

        if (![200, 201].includes(response.status)) {

            if (isServerHttpException(resData)) {
                if (typeof resData.detail === "string") {
                    toast.error(resData.detail)
                    return
                }
                
                console.log(resData.detail)

            }

            return
        }

        const userData = userSchema.safeParse(resData)

        if (userData.success) {
            updateUser(userData.data)
            setSubscriptions(
                userData.data.subscriptions.map(sub => ({
                    ...sub,
                    quotes: []
                }))
            )
            return
        }

    }

    const mutation = useMutation(fetchRegister)

    return mutation
}