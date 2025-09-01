

type TitleProps = {
    className?: string
    text: string
    isTitle?: boolean
    isH3?: boolean

}

const Title: React.FC<TitleProps> = ({
    className= '',
    text,
    isTitle = true,
    isH3 = false
}) => {

    if(isTitle) {
        return (
            <h1 className={`text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-emerald-500 font-bold ${className}`}>
                {text}
            </h1>
        )
    } else if (isH3) {
        return (
            <h3 className={`text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl text-emerald-500 font-bold ${className}`}>
                {text}
            </h3>
        )
    } else {
        return (
            <p className={`text-sm sm:text-base text-gray-500 ${className}`}>
                {text}
            </p>
        )
    }
}

export default Title