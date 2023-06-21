import {
    flexRender
} from "@tanstack/react-table"
import Card from "components/ui/Card"
import OrdersSorting from "./OrdersSorting"
import { useOrdersTable } from "./orders.hooks"
import DownloadOrders from "./DownloadOrders"

const Orders = () => {

    const table = useOrdersTable()
	return (
		<Card>
            <div className="w-full mb-4 flex justify-between items-center">
                <DownloadOrders/>
                <div className="flex gap-2 items-baseline">
                    <p className="font-semibold text-neutral-900/50">Sorting: </p>
                    <OrdersSorting table={table}/>
                </div>
            </div>
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
