import {
    SortingState,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { Order } from "./Bids"
import { MOCK_BID_DATA } from "./__mock__"
import columns, { columnHelper } from "./bids-table-columns"
import CancelOrderCell from "./cells/CancelOrderCell"

export const useBidsTable = () => {
	//TODO need to fetch this from server
	const [data, setData] = useState<Order[]>(MOCK_BID_DATA)

	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data,
		columns: [
			...columns,
			columnHelper.display({
				id: "cancel-action",
				cell: props => <CancelOrderCell order={props.row.original} />,
			}),
		],
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	})

	const removeOrder = (id: string) => {
		setData(data => data.filter(o => o.orderId !== id))
	}

	return table
}
