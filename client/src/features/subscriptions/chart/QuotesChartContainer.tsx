import Card from 'components/ui/Card'
import { Quote } from 'models/Base'
import React from 'react'
import LineChart from './LineChart'

const ChartContainer = ({quotes}:{quotes: Quote[] | null}) => {
  return (
		<Card className="h-fit md:h-[40vh] flex flex-col border-2 border-neutral-900">
			{quotes ? (
				<LineChart quotes={quotes} />
			) : (
				<p className='my-auto'>
					Press "Show on chart" on instruments ticker<br/>
                    to display quotes dynamics
				</p>
			)}
		</Card>
  )
}

export default ChartContainer