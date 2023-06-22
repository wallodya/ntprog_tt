import { Table } from "@tanstack/react-table"
import Button from "components/ui/Button"
import { Order } from "models/Base"
import React from "react"

const OrdersPaginationControls = ({ table }: { table: Table<Order> }) => {
	const currentPage = table.getState().pagination.pageIndex + 1
	const pageCount = table.getPageCount()

	return (
		<div className="mt-6 flex justify-center items-center gap-4">
			{table.getCanPreviousPage() && (
				<Button styleType="primary" onClick={() => table.setPageIndex(0)}>
					First
				</Button>
			)}
			{table.getCanPreviousPage() && (
				<Button styleType="primary" onClick={table.previousPage}>
					{"<"}
				</Button>
			)}
			<p className="text-sm font-semibold text-neutral-900/50">
				Page {currentPage} of {pageCount}
			</p>
			{table.getCanNextPage() && (
				<Button styleType="primary" onClick={table.nextPage}>
					{">"}
				</Button>
			)}
			{table.getCanNextPage() && (
				<Button
					styleType="primary"
					onClick={() => table.setPageIndex(table.getPageCount() + 1)}
				>
					Last
				</Button>
			)}
		</div>
	)
}

export default OrdersPaginationControls
