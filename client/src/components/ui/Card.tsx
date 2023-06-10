import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

const Card = ({ children, className }: { children: ReactNode, className?: string }) => {
	return (
		<div
			className={twMerge(
				"p-4 rounded-lg bg-gray-800/50 shadow",
				className ?? ""
			)}
		>
			{children}
		</div>
	)
}

export default Card
