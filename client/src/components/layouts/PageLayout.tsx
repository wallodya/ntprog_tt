import Header from 'components/layouts/Header'
import React, { ReactNode } from 'react'

const PageLayout = ({children}:{children: ReactNode}) => {
  return (
    <div className='min-h-screen w-screen grid grid-cols-main bg-neutral-200 text-neutral-900'>
        <div className='col-start-2 flex flex-col gap-2 pt-2'>
            <Header/>
            {children}
        </div>
        </div>
  )
}

export default PageLayout