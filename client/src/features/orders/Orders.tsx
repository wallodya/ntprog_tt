import {
    flexRender
} from "@tanstack/react-table"
import Card from "components/ui/Card"
import Decimal from "decimal.js"
import { OrderSide, OrderStatus } from "types/Enums"
import { useOrdersTable } from "./orders.hooks"

//TODO Sorting and filtering
const Orders = () => {

    const table = useOrdersTable()

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

export default Orders
