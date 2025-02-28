import { useEffect } from "react";
import NavBar from './NavBar'
import ItemProduct from './ItemProduct';
import { Link, useLocation } from "react-router-dom";
import Footer from "./Footer";

const logos = [
    { id: 1, src: "/src/assets/logo_gucci.png", alt: "Gucci" },
    { id: 2, src: "/src/assets/logo_Chanel.png", alt: "Chanel" },
    { id: 3, src: "/src/assets/logo_burberry.png", alt: "Burberry" },
    { id: 4, src: "/src/assets/logo_cartier.png", alt: "Cartier" },
    { id: 5, src: "/src/assets/logo_Prada.png", alt: "Prada" },
];

const products = [
    { id: 1, img: "/src/assets/body_micromorley.jpg", title: "Body micromorley", description: '(disponible en blanco y rojo)', price: 15500, stock: 5, category: 'bodies' },
    { id: 2, img: "/src/assets/body_lentejuelas.jpg", title: "Body lentejuelas", description: '(disponible en cobre y plateado)', price: 16000, stock: 2, category: 'bodies' },
    { id: 3, img: "/src/assets/body_bretel.jpg", title: "Body bretel", description: 'Escote pinzado con abertura microfibra (disponible en negro)', price: 14800, stock: 10, category: 'bodies' },
    { id: 4, img: "/src/assets/cintos_elastizados_dorados.jpg", title: "Cintos elastizados", description: 'Dorados', price: 6000, stock: 5, category: 'cintos' },
    { id: 5, img: "/src/assets/cintos_elastizados_plateados.jpg", title: "Cintos elastizados", description: 'Plateados', price: 7000, stock: 6, category: 'cintos' },
    { id: 6, img: "/src/assets/short_jean.jpg", title: "Short jean", description: 'Blanco ( disponible en talle 40)', price: 10000, stock: 1, category: 'shorts' },
    { id: 7, img: "/src/assets/top_push_up_lentejuelas.jpg", title: "Top push up", description: 'Lazo en la espalda para atar (disponible en plateado)', price: 12000, stock: 12, category: 'tops' },
    { id: 8, img: "/src/assets/bando_de_lentejuelas.jpg", title: "Bando de lentejuelas", description: '(disponible los tres colores)', price: 14000, stock: 4, category: 'tops' },
    { id: 9, img: "/src/assets/pollera_frunce_microfibra.jpg", title: "Pollera frunce microfibra", description: '(disponible en negro blanco y rojo)', price: 16000, stock: 9, category: 'polleras' },
    { id: 10, img: "/src/assets/vestido_un_hombro.jpg", title: "Vestido un hombro", description: 'Abertura en la cintura (disponible en negro)', price: 19500, stock: 6, category: 'vestidos' },
    { id: 11, img: "/src/assets/pollera_de_jean_cargo.jpg", title: "Pollera de jean cargo", description: '(disponible en talle 38 y 40)', price: 17500, stock: 8, category: 'polleras' },
];

const groupedProducts = products.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
}, {});

const Home = () => {

    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
        const id = location.hash.replace("#", "");
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.scrollIntoView({ behavior: "smooth" });
        }
        }
    }, [location]);

    return (

        <>

            <div className="homeContainer">
                <NavBar/>

                <div className="homeContainer__gridOffer">

                    <div className="homeContainer__gridOffer__offerContainer">

                        <div className="homeContainer__gridOffer__offerContainer__offerUp">Renueva tu estilo con lo último en moda</div>

                        <div className="homeContainer__gridOffer__offerContainer__offerDown">¡Compra hoy y marca tendencia!</div>

                        <div className="homeContainer__gridOffer__offerContainer__btnContainer">
                            <Link to={"/#catalog"} className='homeContainer__gridOffer__offerContainer__btnContainer__btn'>
                                COMPRAR AHORA   
                            </Link>
                        </div>

                    </div>

                </div>

            </div>

            <div className="slider-logos">

                <div className="slider-logos__logo-slider">
                    <div className="slider-logos__logo-slider__slider-track">
                        {logos.concat(logos).map((logo, index) => (
                        <div key={index} className="slider-logos__logo-slider__slider-track__slide">
                            <img className="slider-logos__logo-slider__slider-track__slide__img" src={logo.src} alt={logo.alt} />
                        </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className='catalogContainer' id='catalog'>

                <div className="catalogContainer__titleContainer">
                    <div className='catalogContainer__titleContainer__title'>
                        <div className='catalogContainer__titleContainer__title__prop'>CATÁLOGO</div>
                    </div>
                </div>

                <div className="catalogContainer__grid">
                    
                    <div className="catalogContainer__grid__catalog">

                        {Object.entries(groupedProducts).map(([category, items]) => (

                            <div className='catalogContainer__grid__catalog__categorieContainer' key={category}>

                                <div className='catalogContainer__grid__catalog__categorieContainer__title'>
                                    <h2 className='catalogContainer__grid__catalog__categorieContainer__title__prop'>{category}</h2>
                                </div>

                                <div className='catalogContainer__grid__catalog__categorieContainer__productsContainer'>

                                    {items.map((product) => (
                                        <ItemProduct
                                        id={product.id}
                                        img={product.img}
                                        title={product.title}
                                        description={product.description}
                                        price={product.price}
                                        />
                                    ))}

                                </div>

                            </div>

                        ))}
                        
                    </div>

                </div>

            </div>

            <Footer/>
            
        </>

    )
    
}

export default Home