

interface TextProps {
    children?: React.ReactNode
    className?: string
    text: string | number
    variant?: 'title' | 'subtitle' | 'body' | 'footer' | 'none'
}

const Text: React.FC<TextProps> = ({
    children,
    className = '',
    text,
    variant = 'body'
}) => {
    const variantClasses = {
        title: 'text-sm sm:text-base text-white',
        subtitle: 'mt-2 text-white font-bold text-2xl',
        body: 'text-sm sm:text-base text-gray-500',
        footer: 'flex flex-row items-center text-sm opacity-80 gap-1',
        none: ""
    }

    return (
        <p className={`${variantClasses[variant]} ${className}`}>
            {children}
            {text}
        </p>
    )
}

export default Text