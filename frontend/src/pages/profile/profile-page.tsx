import React from 'react'

interface Props {
  className?: string
}

export const ProfilePage: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <h1>Profile Page</h1>
    </div>
  )
}
