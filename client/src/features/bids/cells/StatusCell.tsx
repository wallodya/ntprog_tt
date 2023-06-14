import { OrderStatus } from "types/Enums"

const useStatusText = (status: OrderStatus) => {
	switch (status) {
		case OrderStatus.active: {
			return "Active"
		}
		case OrderStatus.filled: {
			return "Filled"
		}
		case OrderStatus.rejected: {
			return "Rejected"
		}
		case OrderStatus.cancelled: {
			return "Cancelled"
		}
	}
}

const useStatusTextColor = (status: OrderStatus) => {
	switch (status) {
		case OrderStatus.active: {
			return "text-blue-600"
		}
		case OrderStatus.filled: {
			return "text-green-600"
		}
		case OrderStatus.rejected: {
			return "text-red-600"
		}
		case OrderStatus.cancelled: {
			return "text-orange-600"
		}
	}
}

const StatusCell = ({ status }: { status: OrderStatus }) => {
	const textColor = useStatusTextColor(status)
	const  text = useStatusText(status)

	return (
		<div className={`w-full font-semibold text-center ${textColor}`}>
			{text}
		</div>
	)
}

export default StatusCell
