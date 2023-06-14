import Card from 'components/ui/Card'
import React from 'react'
import TickerForm from './form/TickerForm'
import TickerFormProvider from './form/TickerFormProvider'

const Ticker = () => {
  return (
		<div className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none">
			<Card className="bg-neutral-100 pointer-events-auto py-6 px-8">
				<h2 className="mb-6 text-neutral-900 font-bold text-2xl">
					New ticker
				</h2>
				<TickerFormProvider>
					<TickerForm />
				</TickerFormProvider>
			</Card>
		</div>
  )
}

export default Ticker