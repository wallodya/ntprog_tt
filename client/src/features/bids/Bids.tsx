import {
    SortingState,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import Card from "components/ui/Card"
import Decimal from "decimal.js"
import React, { useState } from "react"
import { OrderSide, OrderStatus } from "types/Enums"
import { MOCK_BID_DATA } from "./__mock__"
import moment from "moment"

export type Bid = {
	bid_id: string
	created_at: number
	updated_at: number
	status: OrderStatus
	side: OrderSide
	price: Decimal
	amount: number
	instrument: string
}

const IDCell = ({id}: {id: string}) => {
    return (
		<div className="relative z-20 w-full max-w-[4rem] truncate hover:overflow-visible">
			<span className="rounded p-1 bg-neutral-100  hover:bg-neutral-200 transition-all">
				{id}
			</span>
		</div>
	)
}

const TimeCell = ({timestamp}: {timestamp: number}) => {
    const date = moment(timestamp).format("MMM, D YYYY")
    const time = moment(timestamp).format("H:mm:ss")
    const timeMs = moment(timestamp).format("SSS")
    return (
        <div className="relative w-full flex flex-col items-center text-sm z-10">
            <div className="">{date}</div>
            <div className="">{time}<span className="text-neutral-900/50">.{timeMs}</span></div>
        </div>
    )
}

const PriceCell = ({dec, side}: {dec: Decimal, side: OrderSide}) => {
    const textColor = side === OrderSide.buy ? "text-red-600" : "text-green-600"
    const format = Intl.NumberFormat("us", {
		style: "currency",
		currency: "USD",
		currencyDisplay: "narrowSymbol",
	}).format
    return (
        <div className={`w-full text-right font-semibold ${textColor}`}>{format(dec.toNumber())}</div>
    )
}

const SideCell = ({side}:{side: OrderSide}) => {
    const bgColor = side === OrderSide.buy ? "bg-red-600" : "bg-green-600"
    const text = side === OrderSide.buy ? "Buy" : "Sell"
    return (
		<div className="w-full flex items-center justify-center">
			<span
				className={`px-2 py-1 text-sm font-bold text-neutral-100 rounded-md ${bgColor}`}
			>
				{text}
			</span>
		</div>
	)
}

const StatusCell = ({status}: {status: OrderStatus}) => {
    let textColor
    let text
    switch (status) {
        case OrderStatus.active: {
            text = "Active"
            textColor = "text-blue-600"
            break
        }
        case OrderStatus.filled: {
            text = "Filled"
            textColor = "text-green-600"
            break
        }
        case OrderStatus.rejected: {
            text = "Rejected"
            textColor = "text-red-600"
            break
        }
        case OrderStatus.cancelled: {
            text = "Cancelled"
            textColor = "text-orange-600"
            break
        }
    }

    return (
        <div className={`w-full font-semibold text-center ${textColor}`}>{text}</div>
    )
}

const AmountCell = ({amount, side}: {amount: number, side: OrderSide}) => {
    const format = new Intl.NumberFormat().format

    const textColor = side === OrderSide.buy ? "text-red-600" : "text-green-600"
    return (
        <div className={`w-full text-right ${textColor}`}>{format(amount)}</div>
    )
}

const InstrumentCell = ({instrument}: {instrument: string}) => {
    return (
        <div className="w-full text-left ">{instrument}</div>
    )
}

const columnHelper = createColumnHelper<Bid>()

const columns = [
	columnHelper.accessor("bid_id", {
        header: () => <div className="w-full text-center">ID</div>,
		cell: info => <IDCell id={info.getValue()}/>,
        enableSorting: false,
	}),
	columnHelper.accessor("created_at", {
        header: "Creation time",
		cell: info => <TimeCell timestamp={info.getValue()}/>,
	}),
	columnHelper.accessor("updated_at", {
        header: "Change time",
        cell: info => <TimeCell timestamp={info.getValue()}/>,
	}),
	columnHelper.accessor("status", {
        header: "Status",
		cell: props => <StatusCell status={props.getValue()}/>,
        enableSorting: false,
	}),
	columnHelper.accessor("side", {
        header: "Side",
		cell: info => <SideCell side={info.getValue()}/>,
        enableSorting: false,
	}),
    columnHelper.accessor("amount", {
        header: () => <div className="w-full text-right">Amount</div>,
        cell: info => <AmountCell amount={info.getValue()} side={info.row.original.side}/>,
    }),
	columnHelper.accessor("price", {
        header: () => <div className="w-full text-right">Price</div>,
		cell: info => <PriceCell side={info.row.original.side} dec= {info.getValue()}/>,
	}),
	columnHelper.accessor("instrument", {
        header: () => <div className="w-full text-left">Instrument</div>,
		cell: info => <InstrumentCell instrument={info.getValue()}/>,
	}),
]

//TODO Sorting and filtering
const Bids = () => {
	const data = MOCK_BID_DATA

    const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data,
		columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
	})

	return (
		<Card>
			<table className="w-full">
				<thead className="">
					{table.getHeaderGroups().map(headerGroup => (
						<tr key={headerGroup.id} className="">
							{headerGroup.headers.map(header => (
								<th key={header.id} className="pb-4 pr-2">
									<div>
										{!header.isPlaceholder &&
											flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
										{header.column.getCanSort() && (
											<div
												className="text-sm font-semibold text-neutral-900/50 cursor-pointer"
												onClick={header.column.getToggleSortingHandler()}
											>
												{{
                                                    false: "Sort desc.",
													asc: "Remove",
													desc: "Sort asc",
												}[
													String(header.column.getIsSorted())
												]}
											</div>
										)}
									</div>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className="relative">
					{table.getRowModel().rows.map(row => (
						<tr key={row.id} className="border-b">
							{row.getVisibleCells().map(cell => (
								<td key={cell.id} className="pr-2">
									{flexRender(
										cell.column.columnDef.cell,
										cell.getContext()
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</Card>
	)
}

export default Bids
