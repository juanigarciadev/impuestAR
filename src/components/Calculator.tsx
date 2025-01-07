"use client"
import { useEffect, useMemo, useState } from "react"
import CopyIcon from "../icons/CopyIcon"
import CardIcon from "@/icons/CardIcon";
import CryptoIcon from "@/icons/CryptoIcon";
import BankIcon from "@/icons/BankIcon";

export default function Calculator() {

    // Se setean los valores de los dólares
    const [precioDolarInicial, setPrecioDolarInicial] = useState(0);
    const [precioDolar, setPrecioDolar] = useState(0);
    // const [precioDolarBlue, setPrecioDolarBlue] = useState(0);
    const [precioDolarCrypto, setPrecioDolarCrypto] = useState(0);

    // Estado para la divisa seleccionada
    const [divisaSeleccionada, setDivisaSeleccionada] = useState('Dólar Tarjeta');

    useEffect(() => {
        fetch('https://dolarapi.com/v1/dolares/oficial')
            .then(response => response.json())
            .then(data => {
                setPrecioDolar(data.venta);
                setPrecioDolarInicial(data.venta);
            });

        // fetch('https://dolarapi.com/v1/dolares/blue')
        //     .then(response => response.json())
        //     .then(data => setPrecioDolarBlue(data.venta));

        fetch('https://dolarapi.com/v1/dolares/cripto')
            .then(response => response.json())
            .then(data => setPrecioDolarCrypto(data.venta));
    }, []); // Solo se ejecuta una vez al montar el componente

    // Se recupera el valor del input que el usuario rellena para el cálculo
    const [value, setValue] = useState(0)

    // Se crean los valores de los impuestos basado en el valor ingresado en el input, el precio del dolar y el porcentaje impositivo
    const iva = useMemo(()=> {
        return divisaSeleccionada === 'Dólar Crypto' ? 0 : Math.round(value * precioDolar * 0.21)
    }, [value, precioDolar, divisaSeleccionada])

    const ganancias = useMemo(()=> {return divisaSeleccionada === 'Dólar Crypto' || 'Dólar MEP' ? 0 : Math.round(value * precioDolar * 0.21)
    }, [value, precioDolar, divisaSeleccionada])

    const impuestosTotales = useMemo(()=> Math.round(iva + ganancias), [iva, ganancias])
    const totalValue = useMemo(()=> value*precioDolar + impuestosTotales, [value, precioDolar, impuestosTotales])

    const [dropdownToggle, setDropdownToggle] = useState(false)
    const [dropdownTitle, setDropdownTitle] = useState('Dólar Tarjeta')
    
    function updateCurrency(currencyName: string, currencyValue: number): void {
        setDropdownTitle(currencyName);
        setDivisaSeleccionada(currencyName);
        if (currencyName === 'Dólar Tarjeta') {
          setPrecioDolar(precioDolarInicial);
        } else {
          setPrecioDolar(currencyValue);
        }
      }

    useEffect(() => {
        console.log(precioDolar);
    }, [precioDolar]);
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }
    
    return(
        <section className="flex flex-col gap-4 w-full">
            <div className="w-full py-2 px-6 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-100 duration-200 relative " onClick={()=>setDropdownToggle(!dropdownToggle)}>
                <span className="text-sm text-neutral-500 select-none">{dropdownTitle}</span>
                {dropdownToggle ? <div className="absolute bg-white w-full top-12 left-0 border border-neutral-300 shadow-sm rounded-lg">
                    <div className="inline-flex gap-2 items-center w-full hover:bg-neutral-100 py-4 px-6 select-none" onClick={()=>updateCurrency('Dólar Tarjeta', precioDolarInicial)}>
                        <CardIcon/>
                        <span className="text-sm text-neutral-500">Dólar Tarjeta</span>
                    </div>
                    <div className="inline-flex gap-2 items-center w-full hover:bg-neutral-100 py-4 px-6 select-none" onClick={()=>updateCurrency('Dólar MEP', precioDolarCrypto)}>
                        <BankIcon/>
                        <span className="text-sm text-neutral-500">Dólar MEP</span>
                    </div>
                    <div className="inline-flex gap-2 items-center w-full hover:bg-neutral-100 py-4 px-6 select-none" onClick={()=>updateCurrency('Dólar Crypto', precioDolarCrypto)}>
                        <CryptoIcon/>
                        <span className="text-sm text-neutral-500">Dólar Crypto</span>
                    </div>
                    {/* <div className="inline-flex gap-2 items-center w-full hover:bg-neutral-100 py-4 px-6 select-none" onClick={()=>updateCurrency('Dólar Blue', precioDolarBlue)}>
                        <span className="text-sm text-neutral-500">Dólar Blue</span>
                    </div> */}
                </div> : null}
            </div>
            <input onChange={(e)=>setValue(Number(e.target.value))} type="number" className="calculatorInput font-medium rounded-full h-12 w-full py-2 px-6 border-2 border-neutral-300 hover:border-neutral-400 focus:border-neutral-600 duration-200" placeholder="0.00"/>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <span className="font-medium">IVA 21%</span>
                    <span>{'$' + iva}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Ganancias 30%</span>
                    <span className="font-medium">{'$' + ganancias}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span className="font-medium">Sin impuestos</span>
                        <span className="font-medium">{'$' + value*precioDolar}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Impuestos totales</span>
                        <span className="font-medium">{'$' + impuestosTotales}</span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <div className="flex gap-2">
                        <span className="font-bold text-xl">{'$' + totalValue}</span>
                        <button className="inline-flex items-center justify-center h-full w-10 border border-neutral-300 rounded-full hover:bg-neutral-100 cursor-pointer duration-200" onClick={()=>copyToClipboard(totalValue.toString())}><CopyIcon/></button>
                    </div>
                </div>
            </div>
            <span className="text-sm text-neutral-500">Los precios pueden variar unos centavos debido al redondeo de decimales.</span>
        </section>
    )
}