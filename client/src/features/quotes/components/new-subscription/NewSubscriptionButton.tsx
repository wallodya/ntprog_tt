import Button from "components/ui/Button"
import DialogContainer from "components/ui/dialog/DialogContainer"
import React from "react"
import NewSubscriptionForm from "./NewSubscriptionForm"

const NewSubscriptionButton = () => {
	return (
        <DialogContainer>
			<Button styleType="primary">New subscription</Button>
            <NewSubscriptionForm/>
        </DialogContainer>
    )
}

export default NewSubscriptionButton
