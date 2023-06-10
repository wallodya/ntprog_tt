import Header from 'components/layouts/Header'
import React, { ReactNode } from 'react'

const PageLayout = ({children}:{children: ReactNode}) => {
  return (
    <div className='h-screen w-screen grid grid-cols-main bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100'>
        <div className='col-start-2 flex flex-col gap-2 pt-2'>
            <Header/>
            {children}
        </div>
        </div>
  )
}

export default PageLayout