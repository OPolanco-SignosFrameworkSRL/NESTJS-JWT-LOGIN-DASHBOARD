import React from 'react'

type ContainerProps = {
    children?: React.ReactNode,
    className?: string,
    onClick?: () => void,
    style?: React.CSSProperties,
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  onClick,
  style,
}) => {
  return (
    <div className={`${className}`} onClick={onClick} style={style}>
        {children}
    </div>
  )
}

export default Container
