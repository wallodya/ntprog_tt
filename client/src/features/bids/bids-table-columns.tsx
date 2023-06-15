import { createColumnHelper } from "@tanstack/react-table"
import { Order } from "./Bids"
import AmountCell from "./cells/AmountCell"
import IDCell from "./cells/IDCell"
import InstrumentCell from "./cells/InstrumentCell"
import PriceCell from "./cells/PriceCell"
import SideCell from "./cells/SideCell"
import StatusCell from "./cells/StatusCell"
import TimeCell from "./cells/TimeCell"
import CancelOrderCell from "./cells/CancelOrderCell"

export const columnHelper = createColumnHelper<Order>()

const columns = [
	columnHelper.accessor("orderId", {
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

export default columns