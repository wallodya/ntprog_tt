import {
    flexRender
} from "@tanstack/react-table"
import Card from "components/ui/Card"
import OrdersSorting from "./OrdersSortingControls"
import { useOrdersTable } from "./orders-table.hooks"
import DownloadOrders from "./OrdersDownloadButton"
import OrdersPaginationControls from "./pagination/OrdersPaginationControls"
import Button from "components/ui/Button"
import DialogContainer from "components/ui/dialog/DialogContainer"
import NewOrder from "./form/NewOrder"
import { useAuth } from "features/auth/AuthProvider"

const NewOrderButton = () => {
	return (
		<DialogContainer>
			<Button styleType="primary">New order</Button>
			<NewOrder />
		</DialogContainer>
	)
}

const Orders = () => {

    const table = useOrdersTable()

    const { user } = useAuth()

	return (
		<Card>
			<div className="w-full mb-4 flex gap-4 items-center">
				{user && <NewOrderButton />}
				<DownloadOrders />
				<div className="ml-auto flex gap-2 items-baseline">
					<p className="font-semibold text-neutral-900/50">
						Sorting:{" "}
					</p>
					<OrdersSorting table={table} />
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
			<OrdersPaginationControls table={table} />
		</Card>
	)
}

export default Orders
