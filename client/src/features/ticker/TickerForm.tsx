import { zodResolver } from "@hookform/resolvers/zod"
import Button from "components/ui/Button"
import FormInput from "components/ui/FormInput"
import Decimal from "decimal.js"
import { useRef, useState } from "react"
import {
    FieldError,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
} from "react-hook-form"
import { OrderSide } from "types/Enums"
import PriceInput from "./PriceInput"
import { TickerFormData, tickerSchema } from "./ticker.schema"
import Card from "components/ui/Card"

const PriceSell = () => {
	return (
		<div className="mb-2 flex justify-evenly items-baseline text-gray-100">
			<p className="text-sm font-bold">8</p>
			<span className="text-xl font-bold">.55</span>
			<p className="ml-1 text-sm font-bold">8</p>
		</div>
	)
}

const PriceBuy = () => {
	return (
		<div className="mb-2 flex justify-evenly items-baseline text-gray-100">
			<p className="text-sm font-bold">8</p>
			<span className="text-xl font-bold">.55</span>
			<p className="ml-1 text-sm font-bold">8</p>
		</div>
	)
}

const AmountFieldError = ({ err }: { err: FieldError | undefined }) => {
	return (
		<p
			className={`relative text-xs mb-2 font-semibold text-red-600 ${
				!err && "text-transparent"
			} transition`}
		>
			{err ? `*${err.message}` : "*"}
		</p>
	)
}

const MarketQuotes = () => {
    return (
		<Card className="mb-6">
			<h3 className="mb-2 font-semibold text-gray-200 text-lg">Market quotes</h3>
			<div className="flex justify-evenly">
				<div className="flex flex-col">
					<PriceBuy />
                    <p className="font-semibold text-red-600/70 self-start">Buy</p>
				</div>
				<div className="rounded-lg border-l border-gray-700/50"></div>
				<div className="flex flex-col">
					<PriceSell />
                    <p className="font-semibold text-green-600/70 self-end">Sell</p>
				</div>
			</div>
		</Card>
	)
}

const TickerForm = () => {
	const form = useRef<HTMLFormElement | null>(null)
	const [price, setPrice] = useState<Decimal>(new Decimal(0))

	const {
		register,
		handleSubmit,
		setValue,
		formState: {
			errors: { amount: amounFieldError },
		},
	} = useForm<TickerFormData>({
		resolver: zodResolver(tickerSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
	})

	const onSubmit: SubmitHandler<TickerFormData> = data => {
		console.log("data: ")
		console.log(data)
	}

	const onError: SubmitErrorHandler<TickerFormData> = error => {
		console.log("err: ", error)
	}

	const handlePlaceOrder = (orderSide: "buy" | "sell") => {
		if (orderSide === "buy") {
			setValue("side", OrderSide.buy)
		} else {
			setValue("side", OrderSide.sell)
		}
        setValue("price", price.toNumber())
	}

	return (
		<form
			ref={form}
			className="flex flex-col"
			id="ticker-form"
			onSubmit={handleSubmit(onSubmit, onError)}
		>
			<select
				{...register("instrument")}
				className="px-5 py-3 mb-6 rounded-lg border-none text-slate-100 bg-gray-700"
			>
				<option value={"CHN/RUB"}>CHN/RUB</option>
				<option value={"EUR/RUB"}>EUR/RUB</option>
				<option value={"EUR/USD"}>EUR/USD</option>
				<option value={"USD/RUB"}>USD/RUB</option>
				<option value={"BYN/RUB"}>BYN/RUB</option>
			</select>

			<AmountFieldError err={amounFieldError} />
			<FormInput
				placeholder="Amount"
				{...register("amount")}
				className="mb-6"
			/>

			<MarketQuotes />

			<PriceInput price={price} setPrice={setPrice} />
			<div className="flex gap-2">
				<Button
					onClick={() => handlePlaceOrder("buy")}
					role="none"
					type="primary"
					className="w-full bg-red-600/70 border-red-600 hover:text-red-600/70 text-red-200"
				>
					Buy
				</Button>
				<Button
					onClick={() => handlePlaceOrder("sell")}
					role="none"
					type="primary"
					className="w-full bg-green-600/70 border-green-600 hover:text-green-600/70 text-green-200"
				>
					Sell
				</Button>
			</div>
		</form>
	)
}

export default TickerForm
