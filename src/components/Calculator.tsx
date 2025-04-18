"use client"
import { FormEvent, useEffect, useMemo, useState } from "react"
import CardIcon from "@/icons/CardIcon";
import CriptoIcon from "@/icons/CriptoIcon";
import BankIcon from "@/icons/BankIcon";
import ChevronDown from "@/icons/ChevronDown";
import CopyButton from "./CopyButton";
import JoystickIcon from "@/icons/JoystickIcon";

export default function Calculator() {

    // Se setean los valores de los dólares
    const [precioDolarInicial, setPrecioDolarInicial] = useState(0);
    const [precioDolar, setPrecioDolar] = useState(0);
    const [precioDolarCripto, setPrecioDolarCripto] = useState(0);
    const [precioEuro, setPrecioEuro] = useState(0)
    // const [precioDolarBlue, setPrecioDolarBlue] = useState(0);

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
            .then(data => setPrecioDolarCripto(data.venta));

        fetch('https://dolarapi.com/v1/cotizaciones/eur')
            .then(response => response.json())
            .then(data => setPrecioEuro(data.venta));
    }, []); // Solo se ejecuta una vez al montar el componente

    // Se recupera el valor del input que el usuario rellena para el cálculo
    const [value, setValue] = useState(0)

    // Se crean los valores de los impuestos basado en el valor ingresado en el input, el precio del dolar y el porcentaje impositivo
    const iva = useMemo(() => {
        return divisaSeleccionada === 'Dólar Cripto' ? 0 : Math.round(value * precioDolar * 0.21)
    }, [value, precioDolar, divisaSeleccionada])

    const ganancias = useMemo(() => {
        return divisaSeleccionada === 'Dólar Cripto' || divisaSeleccionada === 'Dólar MEP' || divisaSeleccionada === 'Videojuegos' ? 0 : Math.round(value * precioDolar * 0.30)
    }, [value, precioDolar, divisaSeleccionada])

    const impuestosTotales = useMemo(() => Math.round(iva + ganancias), [iva, ganancias])
    const totalValue = useMemo(() => Math.round(value * precioDolar + impuestosTotales), [value, precioDolar, impuestosTotales])

    const [dropdownToggle, setDropdownToggle] = useState(false)
    const [dropdownCurrencyToggle, setDropdownCurrencyToggle] = useState(false)
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

    // Se previene el comportamiento por defecto del input
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    const dropdownArrowRotation = dropdownToggle ? 'rotate-[180deg]' : ''

    return (
        <section className="flex flex-col gap-4 w-full">
            <div className="w-full py-2 px-6 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-100 duration-200 relative dark:border-neutral-700 dark:hover:bg-neutral-800" onClick={() => {
                setDropdownToggle(!dropdownToggle)
                setDropdownCurrencyToggle(false)
            }}>
                <span className="text-sm text-neutral-500 select-none">{dropdownTitle}</span>
                <span className={`right-4 top-2 absolute select-none duration-200 dark:text-white ${dropdownArrowRotation}`}>
                    <ChevronDown />
                </span>
                {dropdownToggle ? <div className="z-20 absolute bg-white w-full top-12 left-0 border border-neutral-300 shadow-sm rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                    <div className="inline-flex gap-2 items-center w-full hover:bg-neutral-100 py-4 px-6 select-none dark:hover:bg-neutral-800" onClick={() => updateCurrency('Dólar Tarjeta', precioDolarInicial)}>
                        <CardIcon />
                        <span className="text-sm text-neutral-500">Dólar Tarjeta</span>
                    </div>
                    <div className="inline-flex gap-2 items-center w-full hover:bg-neutral-100 py-4 px-6 select-none dark:hover:bg-neutral-800" onClick={() => updateCurrency('Videojuegos', precioDolarInicial)}>
                        <JoystickIcon />
                        <span className="text-sm text-neutral-500">Videojuegos</span>
                    </div>
                    <div className="inline-flex gap-2 items-center w-full hover:bg-neutral-100 py-4 px-6 select-none dark:hover:bg-neutral-800" onClick={() => updateCurrency('Dólar MEP', precioDolarCripto)}>
                        <BankIcon />
                        <span className="text-sm text-neutral-500">Dólar MEP</span>
                    </div>
                    <div className="inline-flex gap-2 items-center w-full hover:bg-neutral-100 py-4 px-6 select-none dark:hover:bg-neutral-800" onClick={() => updateCurrency('Dólar Cripto', precioDolarCripto)}>
                        <CriptoIcon />
                        <span className="text-sm text-neutral-500">Dólar Cripto</span>
                    </div>
                    {/* <div className="inline-flex gap-2 items-center w-full hover:bg-neutral-100 py-4 px-6 select-none" onClick={()=>updateCurrency('Dólar Blue', precioDolarBlue)}>
                        <span className="text-sm text-neutral-500">Dólar Blue</span>
                    </div> */}
                </div> : null}
            </div>
            <form onSubmit={handleSubmit} className="relative">
                <div className="inline-flex items-center justify-center absolute bg-white border border-neutral-300 w-10 h-6 rounded-lg select-none cursor-pointer right-4 top-[11px] hover:bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-700" onClick={() => {
                    setDropdownCurrencyToggle(!dropdownCurrencyToggle)
                    setDropdownToggle(false)
                }}>
                    {dropdownCurrencyToggle ? <div className="bg-white z-10 border border-neutral-300 rounded-lg absolute right-0 top-7 dark:bg-neutral-900 dark:border-neutral-700">
                        <div className="inline-flex items-center w-full py-1 px-6 select-none hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                            <span className="text-xs text-neutral-500">USD</span>
                        </div>
                        <div className="inline-flex items-center w-full py-1 px-6 select-none hover:bg-neutral-100 cursor-not-allowed dark:bg-neutral-900 dark:hover:bg-neutral-800">
                            <span className="text-xs text-neutral-500">EUR</span>
                        </div>
                        <div className="inline-flex items-center w-full py-1 px-6 select-none hover:bg-neutral-100 cursor-not-allowed dark:bg-neutral-900 dark:hover:bg-neutral-800">
                            <span className="text-xs text-neutral-500">ARS</span>
                        </div>
                    </div> : null}
                    <span className="text-xs text-neutral-500">USD</span>
                </div>
                <input onChange={(e) => setValue(Number(e.target.value))} type="number" maxLength={17}
                    onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        if (input.value.length > 17) {
                            input.value = input.value.slice(0, 17);
                        }
                    }} className="font-medium rounded-full h-12 w-full py-2 px-6 pr-16 border-2 border-neutral-300 hover:border-neutral-400 focus:border-neutral-600 duration-200 dark:bg-neutral-800 dark:border-neutral-700 dark:focus:border-neutral-400 dark:placeholder:text-neutral-500 dark:text-white" placeholder="0.00" />
            </form>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between dark:text-white">
                    <span className="font-medium">IVA 21%</span>
                    <span className="font-medium">{'$' + iva}</span>
                </div>
                <div className="flex justify-between dark:text-white">
                    <span className="font-medium">Ganancias 30%</span>
                    <span className="font-medium">{'$' + ganancias}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between dark:text-white">
                        <span className="font-medium">Sin impuestos</span>
                        <span className="font-medium">{'$' + Math.round(value * precioDolar)}</span>
                    </div>
                    <div className="flex justify-between dark:text-white">
                        <span className="font-medium">Impuestos totales</span>
                        <span className="font-medium">{'$' + impuestosTotales}</span>
                    </div>
                </div>
                <div className="flex justify-between dark:text-white">
                    <span className="font-medium">Total</span>
                    <div className="flex gap-2">
                        <span className="font-bold text-xl">{'$' + totalValue}</span>
                        <CopyButton valueToCopy={totalValue} />
                    </div>
                </div>
            </div>
            <span className="text-sm text-neutral-500">Los precios pueden variar unos centavos debido al redondeo de decimales.</span>
        </section>
    )
}