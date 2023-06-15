import * as AlertDialog from "@radix-ui/react-alert-dialog"
import Button from "components/ui/Button"
import Card from "components/ui/Card"

const UnsubscribeButton = ({
	handleUnsubscribe,
	instrumentName,
}: {
	instrumentName: string
	handleUnsubscribe: () => void
}) => {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild>
                <Button type="tetriary" className="px-2 py-1 text-sm">Unsubscribe</Button>
            </AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed z-40 h-screen w-screen inset-0 bg-gray-950/70" />
				<AlertDialog.Content>
					<div className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none">
						<Card className="pointer-events-auto">
							<AlertDialog.Title className="text-lg font-bold mb-2">Are you sure?</AlertDialog.Title>
							<AlertDialog.Description className="mb-4">
								You wont't be notified about {instrumentName}{" "}
								quote updates
							</AlertDialog.Description>
                            <div className="flex justify-end gap-2">

							<AlertDialog.Cancel asChild>
								<Button type="secondary">Cancel</Button>
							</AlertDialog.Cancel>
							<AlertDialog.Action asChild>
								<Button type="primary" onClick={handleUnsubscribe}>Unscubscribe</Button>
							</AlertDialog.Action>
                            </div>
						</Card>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
}

export default UnsubscribeButton