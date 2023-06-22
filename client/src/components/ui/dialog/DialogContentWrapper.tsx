import React, { ReactNode } from "react"
import Card from "../Card"

const DialogContentWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<div className="fixed z-30 inset-0 flex items-center justify-center pointer-events-none">
			<Card className="bg-neutral-100 pointer-events-auto py-6 px-8">
				{children}
			</Card>
		</div>
	)
}

export default DialogContentWrapper
