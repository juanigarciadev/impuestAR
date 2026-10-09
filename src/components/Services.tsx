"use client";
import { useState } from "react";
import SERVICES from "../app/mocks/servicesMock"
import Link from "next/link";
import ServiceModal, { Service } from "./ServiceModal";
import ServiceCard from "./ServiceCard";
import TaxBadges from "./TaxBadges";

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section className="flex flex-col w-full gap-3 animate-fade-up [animation-delay:100ms]">
      <h2 className="font-bold text-lg dark:text-white">Suscripciones con impuestos</h2>
      <TaxBadges />
      <div className="w-full flex flex-col gap-2">
        {SERVICES.slice(0, 6).map((service) => (
          <ServiceCard key={service.name} service={service} onSelect={setSelectedService} />
        ))}
      </div>
      <Link href="/servicios" className="w-full border border-neutral-200 rounded-xl py-4 text-center text-sm text-neutral-500 select-none hover:bg-neutral-100 duration-200 dark:border-neutral-700 dark:hover:bg-neutral-800">
        Ver todas las suscripciones
      </Link>

      {selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />}
    </section>
  );
}
