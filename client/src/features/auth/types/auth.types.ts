export type User = {
    login: string,
    uuid: string,
    createdAt: number
}

export type UserDataResponse = {
    login: string,
    uuid: string,
    created_at: number,

}

type ServerHttpException = {
    detail: string | object
}

export const isServerHttpException = (obj: unknown): obj is ServerHttpException => {
    return (
		typeof obj === "object" &&
		obj !== null &&
		"detail" in obj &&
		(typeof obj.detail === "string" || typeof obj.detail === "object")
	)
}

export const isUserDataResponseType = (obj: unknown): obj is UserDataResponse => {
    return (
		typeof obj === "object" &&
		obj !== null &&
		"login" in obj &&
		typeof obj.login === "string" &&
		"uuid" in obj &&
        typeof obj.uuid === "string" &&
        "created_at" in obj && 
        typeof obj.created_at === "number"
	)
}

export const isUserType = (obj: unknown): obj is User => {
    return (
		typeof obj === "object" &&
		obj !== null &&
		"login" in obj &&
		typeof obj.login === "string" &&
		"uuid" in obj &&
        typeof obj.uuid === "string" &&
        "createdAt" in obj && 
        typeof obj.createdAt === "number"
	)
}
