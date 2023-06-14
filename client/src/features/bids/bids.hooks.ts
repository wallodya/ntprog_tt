import { SortingState, useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table"
import { useState } from "react"
import { MOCK_BID_DATA } from "./__mock__"
import columns from "./bids-table-columns"

export const useBidsTable = () => {
    //TODO need to fetch this from server
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

    return table
}