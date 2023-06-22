import * as Dialog from "@radix-ui/react-dialog"
import { ReactNode, Children, useState, createContext, useContext } from "react"
import DialogContentWrapper from "./DialogContentWrapper"

type DialogContextValue = {
    setOpen: (open: boolean) => void
}

const initialContext = {
    setOpen: () => {}
}

const DialogContext = createContext<DialogContextValue>(initialContext)

export const useDialogContext = () => useContext(DialogContext)

const DialogContainer = ({ children }: { children: ReactNode }) => {
	if (Children.count(children) !== 2) {
		throw new Error(
			"DialogContainer requires exactly 2 children (trigger, content)"
		)
	}

    const [open, setOpen] = useState(false)

	return (
		<DialogContext.Provider value={{setOpen}}>
			<Dialog.Root open={open} onOpenChange={setOpen}>
				<Dialog.Trigger asChild>
					{Children.toArray(children)[0]}
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed z-20 h-screen w-screen inset-0 bg-gray-950/70" />
					<Dialog.Content>
						<DialogContentWrapper>
							{Children.toArray(children)[1]}
						</DialogContentWrapper>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</DialogContext.Provider>
	)
}

export default DialogContainer