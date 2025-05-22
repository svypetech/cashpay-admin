export default function Error({ text }: { text: string }) {
  // make a div with a proper height with an image and a text, text will be props, image -> /icons/No data.svg
  return (
    <div className="flex flex-col items-center justify-center h-[500px]">
      <img src="/icons/No data.svg" alt="No data" className="w-1/2 h-1/2" />
      <h1 className="text-2xl font-bold text-gray-700">{text}</h1>
    </div>
  );
}