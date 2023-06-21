import { Table } from "@tanstack/react-table"
import { Order } from "models/Base"
import { useEffect, useState } from "react"

type OrdersSortingState =
	| "none"
	| "priceAsc"
	| "priceDesc"
	| "amountAsc"
	| "amountDesc"
	| "instrumentAsc"
	| "instrumentDesc"
	| "createdAtAsc"
	| "createdAtDesc"
	| "updatedAtAsc"
	| "updatedAtDesc"

const useOrdersSorting = (table: Table<Order>) => {
	const sortPrice =
		table.getFlatHeaders().find(h => h.id === "price")?.column
			.toggleSorting ?? (() => {})
	const sortAmount =
		table.getFlatHeaders().find(h => h.id === "amount")?.column
			.toggleSorting ?? (() => {})
	const sortInstrument =
		table.getFlatHeaders().find(h => h.id === "instrument")?.column
			.toggleSorting ?? (() => {})
	const sortCreatedAt =
		table.getFlatHeaders().find(h => h.id === "createdAt")?.column
			.toggleSorting ?? (() => {})
	const sortUodatedAt =
		table.getFlatHeaders().find(h => h.id === "updatedAt")?.column
			.toggleSorting ?? (() => {})
	const removeSorting = table.resetSorting

	const handleSort = (state: OrdersSortingState) => {
		switch (state) {
			case "none": {
				removeSorting()
				break
			}
			case "priceAsc": {
				sortPrice(false)
				break
			}
			case "priceDesc": {
				sortPrice(true)
				break
			}
			case "amountAsc": {
				sortAmount(false)
				break
			}
			case "amountDesc": {
				sortAmount(true)
				break
			}
			case "instrumentAsc": {
				sortInstrument(false)
				break
			}
			case "instrumentDesc": {
				sortInstrument(true)
				break
			}
			case "createdAtAsc": {
				sortCreatedAt(false)
				break
			}
			case "createdAtDesc": {
				sortCreatedAt(true)
				break
			}
			case "updatedAtAsc": {
				sortUodatedAt(false)
				break
			}
			case "updatedAtDesc": {
				sortUodatedAt(true)
				break
			}
		}
	}

	return handleSort
}

const OrdersSorting = ({ table }: { table: Table<Order> }) => {
	const handleSort = useOrdersSorting(table)

	return (
		<select
			defaultValue={"none"}
			className="px-4 py-2 rounded-lg border border-neutral-900 bg-neutral-100"
			onChange={event => {
				handleSort(event.target.value as OrdersSortingState)
			}}
		>
			<option value={"none"}>Off</option>

			<option value={"priceAsc"}>Price (asc.)</option>
			<option value={"priceDesc"}>Price (desc.)</option>

			<option value={"amountAsc"}>Amount (asc.)</option>
			<option value={"amountDesc"}>Amount (desc.)</option>

			<option value={"instrumentAsc"}>Instrument (asc.)</option>
			<option value={"instrumentDesc"}>Instrument (desc.)</option>

			<option value={"createdAtAsc"}>Creation time(asc.)</option>
			<option value={"createdAtDesc"}>Creation time (desc.)</option>

			<option value={"updatedAtAsc"}>Change time (asc.)</option>
			<option value={"updatedAtDesc"}>Change time (desc.)</option>
		</select>
	)
}

export default OrdersSorting
