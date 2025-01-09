import SERVICES from "../mocks/servicesMock"

export default function servicios() {
    return(
        <section className="flex flex-col gap-2 w-full">
        {
            SERVICES.map((service)=>{
                return(
                    <article className="flex w-full h-auto border border-neutral-300 rounded px-6 py-4 gap-4 select-none cursor-pointer hover:bg-neutral-100 duration-200 xxs:flex-col dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-900" key={service.name}>
                        <div className="inline-flex gap-2 items-center">
                            <img src={service.logo} className="w-5 rounded" alt={service.name} />
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
                )
            })
        }
    </section>
    )
}