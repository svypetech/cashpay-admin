export default function Search({
  className,
  onSearch,
}: {
  className?: string;
  onSearch: (value: string) => void;
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => {
          onSearch(e.target.value);
        }}
        className={`w-full pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring focus:ring-primary shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)] bg-white`}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <img
          src="/icons/search.svg"
          alt="Search"
          className="min-[400px]:w-[24px] min-[400px]:h-[24px] w-[15px] h-[15px]"
        />
      </div>
    </div>
  );
}