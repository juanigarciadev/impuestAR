import Calculator from "@/components/Calculator";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="w-screen flex justify-center items-center">
      <main className="w-[440px] mx-4 flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Header/>
        <Calculator/>
      </main>
    </div>
  );
}
