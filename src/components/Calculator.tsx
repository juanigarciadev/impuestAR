"use client"
import { useState } from "react"
import CopyIcon from "../icons/CopyIcon"

export default function Calculator() {

    const [precioDolar, setPrecioDolar] = useState(0)

    fetch('https://dolarapi.com/v1/dolares/oficial')
    .then(response => response.json())
    .then(data => setPrecioDolar(data.compra))


    const [value, setValue] = useState(0)

    const iva = value*precioDolar*0.21
    const ganancias = value*precioDolar*0.30
    const impuestosTotales = iva + ganancias

    const totalValue = (value: number)=> {
        return value*precioDolar + iva + ganancias
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return(
        <section className="flex flex-col gap-4 w-full">
            <input onChange={(e)=>setValue(Number(e.target.value))} type="number" className="font-medium rounded-full h-12 w-full py-2 px-6 border-2 border-neutral-300 hover:border-neutral-400 focus:border-neutral-600" placeholder="0.00"/>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <span className="font-medium">IVA 21%</span>
                    <span>{'$' + value*precioDolar*0.21}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Ganancias 30%</span>
                    <span className="font-medium">{'$' + value*precioDolar*0.30}</span>
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
                        <span className="font-bold text-xl">{'$' + totalValue(value)}</span>
                        <button className="inline-flex items-center justify-center h-full w-10 rounded-full bg-neutral-200 hover:bg-neutral-300 cursor-pointer" onClick={()=>copyToClipboard(totalValue(value).toString())}><CopyIcon/></button>
                    </div>
                </div>
            </div>
        </section>

    )
}