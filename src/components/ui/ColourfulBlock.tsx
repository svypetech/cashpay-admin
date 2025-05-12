export default function ColourfulBlock({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`font-[700] rounded-[12px] px-[16px] py-[10px] inline-flex justify-center items-center w-[100px] min-w-[100px] h-[45px] box-border overflow-hidden whitespace-nowrap text-ellipsis ${className}`}
    >
      {text}
    </span>
  );
}