import { useQuery } from "@tanstack/react-query"
import {
    SortingState,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import { isServerHttpException } from "features/auth/types/auth.types"
import { Order } from "models/Base"
import { ExecutionReport } from "models/ServerMessages"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useSocket } from "utils/socket/SocketProvider"

import columns from "./orders-table-columns"
import { useOrdersTablePagination } from "./pagination/orders-pagination.hooks"
import { ordersDataSchema } from "utils/validation/schemas/order.schema"

const fetchOrders = async (page: number) => {

	const url = process.env["REACT_APP_SERVER_URL"]

	if (!url) {
		return []
	}

	const response = await fetch(`${url}/orders?page=${page > 0 ? Math.floor(page) : 1}`, {
		method: "GET",
		credentials: "include",
	})

	const resData = await response.json()

	if (![200, 201].includes(response.status)) {
		if (isServerHttpException(resData)) {
			if (typeof resData.detail === "string") {
				toast.error(resData.detail)
				return []
			}

			console.log(resData.detail)
		}

		return []
	}

	const ordersData = ordersDataSchema.safeParse(resData)

	if (ordersData.success) {
		return ordersData.data
	}

	return []
}

export const useOrdersTable = () => {
	const socket = useSocket()
	const [data, setData] = useState<Order[]>([])
    
	const [sorting, setSorting] = useState<SortingState>([])
    const { pagination, setPagination, pageCount} = useOrdersTablePagination()
    
	useQuery(["orders", pagination.pageIndex], () => fetchOrders(pagination.pageIndex + 1), {
        onSuccess: (data) => {
            setData(data)
        },
        keepPreviousData: true
    })

	const table = useReactTable({
		data,
		columns,
        pageCount,
		state: {
			sorting,
            pagination
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        onPaginationChange: setPagination
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
		return () => {
			socket.removeListener(eventName, onExecutionReport)
		}
	})

	return table
}
