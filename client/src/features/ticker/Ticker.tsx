import Card from 'components/ui/Card'
import React from 'react'
import TickerForm from './TickerForm'

const Ticker = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center pointer-events-none'>
        <Card className='bg-gray-900 pointer-events-auto py-6 px-8'>
            <h2 className='mb-6 text-gray-100 font-bold text-xl'>New ticker</h2>
            <TickerForm/>
        </Card>
    </div>
  )
}

export default Ticker