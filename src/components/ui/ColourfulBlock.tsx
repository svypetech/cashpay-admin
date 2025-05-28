export default function ColourfulBlock({ text, className }: { text: string; className?: string; }){
    return (
        <span className={`font-[700] rounded-[12px] px-[20px] py-[12px] sm:px-[24px] sm:py-[12px] sm:w-[120px] w-[100px] h-[40px] sm:h-[45px] flex justify-center items-center border-box ${className}`}>  {/* Fixed the className placement */}
                    {text}
                    </span>
    )
}