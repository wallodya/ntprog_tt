import { zodResolver } from "@hookform/resolvers/zod"
import Button from "components/ui/Button"
import FormFieldError from "components/ui/FormFieldError"
import { useDialogContext } from "components/ui/dialog/DialogContainer"
import { useAuth } from "features/auth/AuthProvider"
import { useInstruments } from "features/instruments/InstrumentsProvider"
import { useSubscriptions } from "features/subscriptions/SubscriptionsProvider"
import React from "react"
import { useForm } from "react-hook-form"
import { useSocket } from "utils/socket/SocketProvider"
import { z } from "zod"

const subcribeMarketSchema = z.object({
    instrumentId: z.string().transform(Number)
})

type SubscribeMarketDataIn = z.infer<typeof subcribeMarketSchema>

const NewSubscriptionForm = () => {

    const {
		register,
        handleSubmit,
		formState: {
			errors: { instrumentId: instrumentFieldError },
		},
	} = useForm<SubscribeMarketDataIn>({
		resolver: zodResolver(subcribeMarketSchema),
	})

    const { user } = useAuth()
    const { setOpen } = useDialogContext()
    const { subscribe, subscriptions } = useSubscriptions()

    const onSubmit = (data: SubscribeMarketDataIn) => {
        if (!user) {
            return
        }
        subscribe(data.instrumentId)
        setOpen(false)
    }

    const instruments = useInstruments()

	return (
		<form className="flex flex-col w-64" onSubmit={handleSubmit(onSubmit)}>
			<label
				htmlFor="instrument"
				className="font-semibold text-neutral-900/50"
			>
				Choose instrument
			</label>
			<FormFieldError err={instrumentFieldError} />
			<select
				{...register("instrumentId")}
				className="px-5 py-3 w-full mb-12 rounded-lg border border-neutral-500/50 text-neutral-900 bg-transparent"
			>
				{instruments.map(
					i => 
						!subscriptions.find(
							sub =>
								sub.instrument.instrumentId === i.instrumentId
						) && (
							<option key={i.instrumentId} value={i.instrumentId}>
								{i.name}
							</option>
						)
				)}
			</select>

			<Button styleType="primary">Subscribe</Button>
		</form>
	)
}

export default NewSubscriptionForm
