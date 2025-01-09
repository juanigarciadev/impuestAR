import Calculator from "@/components/Calculator";
import Services from "@/components/Services";


export default function Home() {
  return (
    <div className="flex flex-col gap-4">
        <Calculator/>
        <Services/>
    </div>
  );
}
