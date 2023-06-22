import { Row, createColumnHelper } from "@tanstack/react-table"
import { Order } from "models/Base"
import AmountCell from "./cells/AmountCell"
import IDCell from "./cells/IDCell"
import InstrumentCell from "./cells/InstrumentCell"
import PriceCell from "./cells/PriceCell"
import SideCell from "./cells/SideCell"
import StatusCell from "./cells/StatusCell"
import TimeCell from "./cells/TimeCell"
import CancelOrderCell from "./cells/CancelOrderCell"
import Decimal from "decimal.js"

export const columnHelper = createColumnHelper<Order>()

const columns = [
	columnHelper.accessor("orderId", {
        header: () => <div className="w-full text-center">ID</div>,
		cell: info => <IDCell id={info.getValue()}/>,
        enableSorting: false,
	}),
	columnHelper.accessor("createdAt", {
        header: "Creation time",
		cell: info => <TimeCell timestamp={info.getValue()}/>,
	}),
	columnHelper.accessor("updatedAt", {
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
        sortingFn: (rowA: Row<Order>, rowB : Row<Order>) => {
            const valA = rowA.getValue<Decimal>("price")
            const valB = rowB.getValue<Decimal>("price")
            return valA.greaterThan(valB) ? 1 : -1
        }
	}),
	columnHelper.accessor("instrument", {
        header: () => <div className="w-full text-left">Instrument</div>,
		cell: info => <InstrumentCell instrument={info.getValue()}/>,
	}),
    columnHelper.display({
        id: "cancel-action",
        cell: props => <CancelOrderCell order={props.row.original} />,
    }),
]

export default columns