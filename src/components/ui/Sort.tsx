
export default function Sort({className,title}:{className:string,title:string}){
    
    return (
        <div className={`flex items-center gap-4  col-span-1 ${className} `}>
            <button className="w-full flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
              <span>{title}</span>
              <img src="/icons/dropdownIcon.svg" alt="Arrow right" className="min-[400px]:w-[24px] min-[400px]:h-[24px] w-[16px] h-[16px]" />
            </button>
          </div>
    )
}