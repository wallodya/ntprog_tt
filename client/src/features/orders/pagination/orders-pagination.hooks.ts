import { useQuery } from "@tanstack/react-query"
import { PaginationState } from "@tanstack/react-table"
import { isServerHttpException } from "features/auth/types/auth.types"
import { useState, useMemo } from "react"
import { toast } from "react-toastify"

const fetchPageCount = async () => {
    const url = process.env["REACT_APP_SERVER_URL"]

	if (!url) {
		return 1
	}

	const response = await fetch(`${url}/orders/page-count`, {
		method: "GET",
		credentials: "include",
	})

	const resData = await response.json()

	if (![200, 201].includes(response.status)) {
		if (isServerHttpException(resData)) {
			if (typeof resData.detail === "string") {
				toast.error(resData.detail)
				return 1
			}

			console.log(resData.detail)
		}

		return 1
	}

    const count = Number(resData)

    if (isNaN(count)) {
        return 1
    }

    return count
}

export const useOrdersTablePagination = () => {

    const [{ pageIndex, pageSize }, setPagination]= useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20
    })

    const pagination = useMemo(() => ({
        pageIndex,
        pageSize
    }),[pageIndex, pageSize])

    const { data } = useQuery(["orders", "page-count"], fetchPageCount)

    return {
        pagination,
        setPagination,
        pageCount: data ?? 1
    }
}