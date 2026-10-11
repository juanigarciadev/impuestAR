import Calculator from "@/components/Calculator";
import Services from "@/components/Services";
import HomeInfo from "@/components/HomeInfo";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
        <h1 className="font-bold text-lg dark:text-white">Calculá el precio final de tus compras en dólares</h1>
        <Calculator/>
        <Services/>
        <HomeInfo/>
    </div>
  );
}
