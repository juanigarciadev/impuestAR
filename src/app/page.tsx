import Calculator from "@/components/Calculator";
import Services from "@/components/Services";
import HomeInfo from "@/components/HomeInfo";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
        {/* Invisible a la vista: da a la home su <h1> para buscadores y lectores de pantalla */}
        <h1 className="sr-only">impuestAR: calculadora del precio final de tus compras en dólares con impuestos</h1>
        <Calculator/>
        <Services/>
        <HomeInfo/>
    </div>
  );
}
