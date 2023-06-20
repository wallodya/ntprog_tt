import React, { ButtonHTMLAttributes, HTMLAttributes, LegacyRef, ReactNode, forwardRef } from "react"
import { twMerge } from "tailwind-merge"

type ButtonType = "primary" | "secondary" | "tetriary"

type ButtonProps = {
	children: ReactNode
	styleType: ButtonType
} & ButtonHTMLAttributes<HTMLButtonElement>

const useDefaultButtonClasses = (type: ButtonType) => {
	const baseClasses = "px-4 py-2 rounded-lg text-sma font-semibold transition "
	switch (type) {
		case "primary": {
			return (
				baseClasses +
				"border border-neutral-900 bg-neutral-900 text-neutral-100 hover:bg-transparent hover:text-neutral-900"
			)
		}
		case "secondary": {
			return baseClasses + "border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-neutral-100"
		}
		case "tetriary": {
			return baseClasses + "border border-neutral-900 text-neutral-900 hover:border-neutral-900/50 hover:text-neutral-900/50"
		}
	}
}

const Button = forwardRef(({ children, className, styleType, ...props }: ButtonProps, ref) => {
	const defaultClasses = useDefaultButtonClasses(styleType)
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
