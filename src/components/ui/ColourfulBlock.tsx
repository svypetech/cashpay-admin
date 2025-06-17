export default function ColourfulBlock({
  text,
  className,
  size = "lg",
}: {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={`font-[700] rounded-[12px] flex justify-center items-center border-box max-w-fit min-w-[90px]  ${
        size === "lg"
          ? "px-[16px] py-[10px] sm:px-[24px] sm:py-[12px] sm:min-w-[120px]   h-[37px] sm:h-[45px]"
          : size === "sm"
          ? "px-[12px] py-[6px]  sm:px-[10px] sm:py-[10px] sm:min-w-[110px]  h-[35px] md:h-[40px]"
          : ""
      } ${className} `}
    >
      {" "}
      {/* Fixed the className placement */}
      {text}
    </span>
  );
}