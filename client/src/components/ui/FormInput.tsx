import React, { HTMLAttributes, LegacyRef, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type FormInputProps = HTMLAttributes<HTMLInputElement>

const FormInput = forwardRef(({className, ...props}: FormInputProps, ref) => {
  return (
		<input
			ref={ref as LegacyRef<HTMLInputElement>}
			{...props}
			className={twMerge(
				"px-5 py-3 rounded-lg border border-neutral-500/50 text-neutral-900 bg-transparent",
				className
			)}
		/>
  )
})

export default FormInput