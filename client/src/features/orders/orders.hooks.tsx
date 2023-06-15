import {
    SortingState,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Order } from "./Orders"
import { MOCK_BID_DATA } from "./__mock__"
import columns from "./orders-table-columns"
import { useSocket } from "utils/socket/SocketProvider"
import { ExecutionReport } from "models/ServerMessages"

export const useOrdersTable = () => {
	//TODO need to fetch this from server
    const socket = useSocket()
	const [data, setData] = useState<Order[]>(MOCK_BID_DATA)

	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	})

    const onExecutionReport = (message: ExecutionReport) => {
        setData(data =>
            data.map(order =>
                order.orderId === message.orderId
                    ? { ...order, status: message.orderStatus }
                    : order
            )
        )
    }

    useEffect(() => {
        const eventName = "execution-report"
        socket.on(eventName, onExecutionReport)
        return () => {socket.removeListener(eventName, onExecutionReport)}
    })


	return table
}
