export default function ColourfulBlock({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`font-[700] rounded-[12px] px-[16px] py-[10px] sm:px-[24px] sm:py-[12px] sm:min-w-[120px] max-w-fit min-w-[80px] h-[35px] sm:h-[45px] flex justify-center items-center border-box ${className}`}
    >
      {" "}
      {/* Fixed the className placement */}
      {text}
    </span>
  );
}