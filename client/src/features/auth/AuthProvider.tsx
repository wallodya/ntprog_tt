import { ReactNode } from 'react'

const AuthProvider = ({children}:{children: ReactNode}) => {
  return (
    <div>{children}</div>
  )
}

export default AuthProvider