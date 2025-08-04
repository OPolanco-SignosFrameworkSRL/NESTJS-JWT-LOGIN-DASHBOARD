import React from 'react'

type ContainerProps = {
    children?: React.ReactNode,
    className?: string,
    onTouchStart?: () => void,
}

const Container = ({ children, className, onTouchStart }: ContainerProps) => {

  return (
    <div className={`${className}`} onTouchStart={onTouchStart}>
        {children}
    </div>
  )
}

export default Container
