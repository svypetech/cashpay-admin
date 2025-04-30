import Image from "next/image"
export default function Search({className,onSearch}:{className:string,onSearch:(value:string)=>void}){
    return(
        <div className={`relative ${className}`}>
                <input
                type="text"
                placeholder="Search..."
                onChange={(e)=>{
                    onSearch(e.target.value)
                }}
                className={`w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-primary focus:border-transparent`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <img src="/icons/search.svg" alt="Search"  className="min-[400px]:w-[24px] min-[400px]:h-[24px] w-[10px] h-[10px]"/>
              </div>
            </div>


              )}

          
        
    
