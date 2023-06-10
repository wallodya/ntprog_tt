import { ReactNode } from "react"

const Card = ({ children }: { children: ReactNode }) => {
	return <div className="p-4 rounded-lg bg-gray-800/50 shadow">{children}</div>
}

export default Card
