import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center p-24 flex-col">
      <div className="text-3xl font-bold mb-8">
        Strandimization
      </div>
      <div className="flex flex-col mb-8">
        <div className="font-bold mb-4">Your Theme</div>
        <div>Theme</div>
      </div>
      <div className="grid grid-cols-6 grid-rows-8 gap-4">
        {Array.from({ length: 48 }, (_, index) => (
          <div key={index} className="bg-gray-200 p-4 flex justify-center items-center">
            A
          </div>
        ))}
      </div>
    </main>
  );
}
