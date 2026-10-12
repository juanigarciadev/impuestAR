// Precios en pesos argentinos SIN impuestos, por mes, salvo que el plan indique otra cosa.
// Los planes con currency "USD" se convierten con el dólar oficial en la app.
// `verifiedAt` es la fecha en que se contrastó cada servicio con su página oficial (sin fecha = sin verificar).
// Fuentes: docs/VERIFICACION.md.
const SERVICES = [
    {
        name: "YouTube Premium",
        logo: "https://cdn.iconscout.com/icon/free/png-256/free-youtube-104-432560.png?f=webp",
        duration: "/m",
        plans: [
            { name: "Individual", price: 1899 },
        ],
    },
    {
        name: "Spotify",
        logo: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png",
        duration: "/m",
        verifiedAt: "2026-10-12",
        plans: [
            { name: "Estudiantes", price: 2299, note: "Requiere matrícula en una institución de educación superior", restricted: true },
            { name: "Individual", price: 4499, note: "1 cuenta Premium" },
            { name: "Duo", price: 5999, note: "2 cuentas, mismo domicilio" },
            { name: "Familiar", price: 7599, note: "Hasta 6 cuentas, mismo domicilio" },
        ],
    },
    {
        name: "Crunchyroll",
        logo: "https://static.crunchyroll.com/cxweb/assets/img/og-image.png",
        duration: "/m",
        verifiedAt: "2026-10-12",
        plans: [
            { name: "Fan", price: 5199, note: "1 dispositivo a la vez" },
            { name: "Mega Fan", price: 6099, note: "4 dispositivos a la vez, descargas y Game Vault" },
        ],
    },
    {
        name: "Netflix",
        logo: "https://cdn-icons-png.flaticon.com/512/732/732228.png",
        duration: "/m",
        verifiedAt: "2026-10-12",
        plans: [
            { name: "Básico", price: 8999 },
            { name: "Estándar", price: 14999 },
            { name: "Premium", price: 19999 },
        ],
    },
    {
        name: "Disney+",
        logo: "https://res.cloudinary.com/diruiumfk/image/upload/c_crop,w_175,h_175/v1739337077/disney_plus_icon_161064_w5nfjt.png",
        duration: "/m",
        verifiedAt: "2026-10-12",
        plans: [
            { name: "Estándar con anuncios", price: 9916.53 },
            { name: "Estándar", price: 12891.74 },
            { name: "Premium", price: 19833.88, note: "4K y 4 dispositivos a la vez" },
            { name: "Estándar anual", price: 107437.19, duration: "/año" },
            { name: "Premium anual", price: 165288.43, duration: "/año" },
        ],
    },
    {
        name: "Amazon Prime Video",
        logo: "https://store-images.s-microsoft.com/image/apps.49860.14618985536919905.3e754390-a812-43d7-87fc-335159cd867b.9f1b702c-2a8b-4fdc-b65b-8a6c4e49b55f",
        duration: "/m",
        plans: [
            { name: "Mensual", price: 3999 },
        ],
    },
    {
        name: "Apple TV",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/AppleTVLogo.svg/250px-AppleTVLogo.svg.png",
        duration: "/m",
        verifiedAt: "2026-10-12",
        plans: [
            { name: "Apple TV", price: 14.99, currency: "USD", note: "Sin anuncios" },
            { name: "Apple TV + Peacock Premium", price: 17.99, currency: "USD", note: "Peacock con anuncios. Desde ese precio" },
            { name: "Apple TV + Peacock Premium Plus", price: 22.99, currency: "USD", note: "Peacock sin anuncios" },
        ],
    },
    {
        name: "Hulu",
        logo: "https://eldiariony.com/wp-content/uploads/sites/2/2017/09/hulu-interactive-rgb-1.png?w=1200",
        duration: "/m",
        verifiedAt: "2026-10-12",
        plans: [
            { name: "Hulu (con anuncios)", price: 12.49, currency: "USD" },
            { name: "Disney+ y Hulu (con anuncios)", price: 12.99, currency: "USD" },
            { name: "Hulu Premium (sin anuncios)", price: 21.49, currency: "USD" },
            { name: "Disney+ y Hulu Premium (sin anuncios)", price: 21.99, currency: "USD" },
            { name: "Disney+, Hulu y ESPN Select", price: 21.99, currency: "USD" },
            { name: "Disney+, Hulu y HBO Max (con anuncios)", price: 21.99, currency: "USD" },
            { name: "Disney+, Hulu y ESPN Select Premium", price: 32.99, currency: "USD" },
            { name: "Disney+, Hulu y HBO Max (sin anuncios)", price: 34.99, currency: "USD" },
            { name: "Disney+, Hulu y ESPN Unlimited", price: 35.99, currency: "USD" },
            { name: "Disney+, Hulu y ESPN Unlimited Premium", price: 44.99, currency: "USD" },
            { name: "Hulu (con anuncios) anual", price: 124.99, currency: "USD", duration: "/año" },
        ],
    },
    {
        name: "Paramount",
        logo: "https://play-lh.googleusercontent.com/oi4GE8ulxHp4Y2xVzKu_WAMrgE4Jj4Kbdd7hAWLeoZTsMtC5bYTd2xcYhlvMk69pTFY",
        duration: "/m",
        verifiedAt: "2026-10-12",
        plans: [
            { name: "Estándar", price: 5578.51, note: "Full HD y 2 transmisiones simultáneas" },
            { name: "Premium", price: 7768.6, note: "4K UHD y 4 transmisiones simultáneas" },
        ],
    },
];

export default SERVICES
