interface TabsProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    size: string
    className?: string;

}
export default function Tabs({ tabs,activeTab, setActiveTab,size,className }: TabsProps) {
    
    const getSize = () =>{
        switch (size) {
            case "normal":
                return "min-[500px]:text-[18px] text-sm"
            case "small":
                return "min-[500px]:text-base text-xs"
            default:
                return "min-[500px]:text-base text-md"
        }
    }
    return (
        
        <div className="flex items-center justify-between">
            <div className={`flex min-[450px]:gap-5 gap-1`}>
            {tabs.map((tab:string) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2  ${
                    activeTab === tab ? " border-b-2 border-primary font-bold" : ""
                } ${getSize()}`}
                >
                {tab}
                </button>
            ))}
            </div>
        </div>
        
    );
    }