import React, { HTMLAttributes, LegacyRef, ReactNode, forwardRef } from "react"
import { twMerge } from "tailwind-merge"

type ButtonType = "primary" | "secondary" | "text"

type ButtonProps = {
	children: ReactNode
	type: ButtonType
} & HTMLAttributes<HTMLButtonElement>

const useDefaultButtonClasses = (type: ButtonType) => {
	const baseClasses = "px-4 py-2 rounded-lg text-sma font-semibold transition "
	switch (type) {
		case "primary": {
			return (
				baseClasses +
				"border border-gray-100  bg-gray-100 text-gray-700 hover:bg-transparent hover:text-gray-100"
			)
		}
		case "secondary": {
			return baseClasses + "border border-gray-100 text-gray-100 hover:bg-gray-100 hover:text-gray-700"
		}
		case "text": {
			return baseClasses + ""
		}
	}
}

const Button = forwardRef(({ children, className, type, ...props }: ButtonProps, ref) => {
	const defaultClasses = useDefaultButtonClasses(type)
	return (
		<button
			ref={ref as LegacyRef<HTMLButtonElement>}
			className={twMerge(defaultClasses, className)}
			{...props}
		>
			{children}
		</button>
	)
})

export default Button
