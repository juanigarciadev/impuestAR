import Calculator from "@/components/Calculator";
import Header from "@/components/Header";
import Services from "@/components/Services";
import SupportBanner from "@/components/Support";
import UpdateRequest from "@/components/UpdateRequest";

export default function Home() {
  return (
    <div className="w-screen flex justify-center items-center dark:bg-neutral-900">
      <main className="w-[440px] min-h-screen pb-4 mx-4 flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Header/>
        <Calculator/>
        <Services/>
        <div className="flex flex-col w-full gap-3">
          <SupportBanner/>
          <UpdateRequest/>
        </div>
      </main>
    </div>
  );
}
