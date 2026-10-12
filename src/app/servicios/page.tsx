'use client'

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import SERVICES from "../mocks/servicesMock"
import ServiceModal, { Service } from "@/components/ServiceModal";
import ServiceCard from "@/components/ServiceCard";
import TaxBadges from "@/components/TaxBadges";
import { useSubscriptions } from "@/app/context/SubscriptionsProvider";

export default function Servicios() {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const { items } = useSubscriptions();

    return (
        <section className="flex flex-col gap-3 w-full animate-fade-up">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-lg dark:text-white">Suscripciones con impuestos</h1>
                <ButtonLink href="/" color="secondary" icon={<ArrowLeft size={16} />}>Calculadora</ButtonLink>
            </div>
            <TaxBadges />
            <ButtonLink href="/mis-suscripciones" color="secondary" icon={<Bookmark size={16} />}>
                Mis suscripciones{items.length ? ` (${items.length})` : ""}
            </ButtonLink>
            <div className="flex flex-col gap-2">
                {SERVICES.map((service) => (
                    <ServiceCard key={service.name} service={service} onSelect={setSelectedService} />
                ))}
            </div>
            <span className="text-xs text-neutral-500">
                Los nombres y logos pertenecen a sus respectivos titulares y se usan solo para identificar cada servicio. impuestAR no está afiliado a ellos. Los precios son de referencia: <Link href="/legal" className="underline underline-offset-2">más información</Link>.
            </span>
            {selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />}
        </section>
    )
}
