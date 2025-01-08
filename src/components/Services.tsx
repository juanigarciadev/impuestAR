"use client";
import React, { useRef, useState } from "react";

export default function Services() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    name: string;
    price: number;
    logo: string;
    duration: string;
  } | null>(null);

  const SERVICES = [
    {
      name: "YouTube",
      price: 1899,
      logo: "https://cdn.iconscout.com/icon/free/png-256/free-youtube-104-432560.png?f=webp",
      duration: "/m",
    },
    {
      name: "Spotify",
      price: 2499,
      logo: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png",
      duration: "/m",
    },
    {
      name: "Crunchyroll",
      price: 3499,
      logo: "https://static.crunchyroll.com/cxweb/assets/img/og-image.png",
      duration: "/m",
    },
    {
        name: "Netflix",
        price: 5173,
        logo: "https://cdn-icons-png.flaticon.com/512/732/732228.png",
        duration: "/m",
      },
  ];

  const handleOpenModal = (service: {
    name: string;
    price: number;
    logo: string;
    duration: string;
  }) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setOpenModal(false);
  };

  return (
    <section className="flex flex-col w-full gap-2">
      <h3 className="font-bold text-xl text-center dark:text-white">Precios de suscripciones con impuestos</h3>
      <div className="w-full grid grid-cols-2 rounded-lg gap-2 xs:flex xs:flex-col">
        {SERVICES.map((service) => (
          <article
            key={service.name}
            className="flex w-full h-auto border border-neutral-300 rounded px-6 py-4 gap-4 select-none cursor-pointer hover:bg-neutral-100 duration-200 xxs:flex-col dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-900"
            onClick={() => handleOpenModal(service)}
          >
            <div className="inline-flex gap-2 items-center">
              <img src={service.logo} className="w-5" alt={service.name} />
            </div>
            <div className="flex flex-col">
              <div>
                <p className="font-medium dark:text-white">{service.name}</p>
              </div>
              <div className="inline-flex items-end">
                <p className="font-medium text-lg text-neutral-700 dark:text-neutral-400">
                  ${Math.round(service.price * 1.51)}
                </p>
                <span className="text-sm text-neutral-500">{service.duration}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="w-full border border-neutral-300 rounded-lg py-4 text-center select-none hover:bg-neutral-100 duration-200 cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-900">
        <span className="text-sm text-neutral-500">Ver todas las suscripciones</span>
      </div>

      {openModal && selectedService && (
        <div className="flex items-center justify-center w-screen h-screen bg-black/40 fixed top-0 left-0 p-4">
          <div className="bg-white rounded-lg w-[440px] p-10 border border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-6 w-full">
                <div className="inline-flex gap-2 items-center">
                    <img src={selectedService.logo} alt={selectedService.name} className="h-5"/>
                    <h3 className="text-xl font-bold dark:text-white">{selectedService.name}</h3>
                </div>
                <div>
                    <button onClick={handleCloseModal} className="w-full border text-neutral-500 text-sm px-4 py-2 rounded hover:bg-neutral-100 duration-200 select-none dark:border-neutral-700 dark:hover:bg-neutral-800">X</button>
                </div>
            </div>
            <section className="flex flex-col gap-1">
                <div className="inline-flex justify-between w-full dark:text-white">
                    <p className="font-medium">Sin impuestos</p>
                    <p className="font-medium">${Math.round(selectedService.price)}</p>
                </div>
                <div className="inline-flex justify-between w-full dark:text-white">
                    <p className="font-medium">Impuestos</p>
                    <p className="font-medium">${Math.round(selectedService.price*0.51)}</p>
                </div>
                <div className="inline-flex justify-between w-full dark:text-white">
                    <p className="font-medium">Total</p>
                    <p className="font-medium text-xl">${Math.round(selectedService.price * 1.51)}</p>
                </div>
                <span className="text-sm text-neutral-500 mt-4">Los precios pueden variar unos centavos debido al redondeo de decimales.</span>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}