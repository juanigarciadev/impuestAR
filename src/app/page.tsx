import Calculator from "@/components/Calculator";
import Header from "@/components/Header";
import Services from "@/components/Services";

export default function Home() {
  return (
    <div className="w-screen flex justify-center items-center">
      <main className="w-[440px] min-h-screen mx-4 flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Header/>
        <Calculator/>
        <Services/>
      </main>
    </div>
  );
}
