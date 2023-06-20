import Button from "components/ui/Button"
import React from "react"
import { Order } from "models/Base"
import { useAuth } from "features/auth/AuthProvider"
import { OrderStatus } from "types/Enums"
import { useSocket } from "utils/socket/SocketProvider"

const CancelOrderCell = ({order}:{order: Order}) => {
    const {user} = useAuth()
    const socket = useSocket()

    if (!user) {
        return null
    }

    const isOwner = user.uuid === order.userId

    const isCancellable = order.status === OrderStatus.active

    if (!isOwner || !isCancellable) {
        return null
    }

    const handleCancel = () => {
        socket.cancelOrder(order.orderId)
    }

	return (
		<div>
			<Button
				styleType="secondary"
				onClick={handleCancel}
				className="text-xs px-2 py-1"
			>
				Cancel
			</Button>
		</div>
	)
}

export default CancelOrderCell
