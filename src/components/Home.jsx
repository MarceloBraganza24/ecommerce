import { useEffect,useState,useContext } from "react";
import NavBar from './NavBar'
import ItemProduct from './ItemProduct';
import { Link, useLocation,useNavigate } from "react-router-dom";
import Footer from "./Footer";
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination,Autoplay  } from "swiper/modules";

const logos = [
    { id: 1, src: "/src/assets/logo_gucci.png", alt: "Gucci" },
    { id: 2, src: "/src/assets/logo_Chanel.png", alt: "Chanel" },
    { id: 3, src: "/src/assets/logo_burberry.png", alt: "Burberry" },
    { id: 4, src: "/src/assets/logo_cartier.png", alt: "Cartier" },
    { id: 5, src: "/src/assets/logo_Prada.png", alt: "Prada" },
];

const products = [
    { id: 1, images: ["/src/assets/body_micromorley.jpg"], title: "Body micromorley", description: '(disponible en blanco y rojo)', price: 15500, stock: 5, color: ["blanco","rojo"], size: ["1","2","3"], category: 'bodies', state: ["nuevo"] },
    { id: 2, images: ["/src/assets/body_lentejuelas.jpg"], title: "Body lentejuelas", description: '(disponible en cobre y plateado)', price: 16000, stock: 2, color: ["cobre","plateado"], size: ["2","3"], category: 'bodies', state: ["nuevo"] },
    { id: 3, images: ["/src/assets/body_bretel.jpg"], title: "Body bretel", description: 'Escote pinzado con abertura microfibra (disponible en negro)', price: 14800, stock: 10, color: ["negro"], size: ["3"], category: 'bodies', state: ["nuevo"] },
    { id: 4, images: ["/src/assets/cintos_elastizados_dorados.jpg"], title: "Cintos elastizados", description: 'Dorados', price: 6000, stock: 5, color: ["único"], size: ["único"], category: 'cintos', state: ["nuevo"] },
    { id: 5, images: ["/src/assets/cintos_elastizados_plateados.webP"], title: "Cintos elastizados", description: 'Plateados', price: 7000, stock: 6, color: ["único"], size: ["único"], category: 'cintos', state: ["nuevo"] },
    { id: 6, images: ["/src/assets/short_jean_1.webP","/src/assets/short_jean_2.webP","/src/assets/short_jean_3.webP","/src/assets/short_jean_1.webP","/src/assets/short_jean_2.webP","/src/assets/short_jean_3.webP"], title: "Short jean", description: 'Blanco ( disponible en talle 40)', price: 10000, stock: 1, color: ["único"], size: ["40"], category: 'shorts', state: ["nuevo"] },
    { id: 7, images: ["/src/assets/top_push_up_lentejuelas.jpg"], title: "Top push up", description: 'Lazo en la espalda para atar (disponible en plateado)', price: 12000, stock: 12, color: ["plateado"], size: ["único"], category: 'tops', state: ["nuevo"] },
    { id: 8, images: ["/src/assets/bando_de_lentejuelas.jpg"], title: "Bando de lentejuelas", description: '(disponible los tres colores)', price: 14000, stock: 4, color: ["negro","rojo","plateado"], size: ["1","2","3"], category: 'tops', state: ["nuevo"] },
    { id: 9, images: ["/src/assets/pollera_frunce_microfibra.jpg"], title: "Pollera frunce microfibra", description: '(disponible en negro blanco y rojo)', price: 16000, stock: 9, color: ["negro","blanco","rojo"], size: ["2","3"], category: 'polleras', state: ["nuevo"] },
    { id: 10, images: ["/src/assets/vestido_un_hombro.jpg"], title: "Vestido un hombro", description: 'Abertura en la cintura (disponible en negro)', price: 19500, stock: 6, color: ["negro"], size: ["1","2"], category: 'vestidos', state: ["nuevo"] },
    { id: 11, images: ["/src/assets/pollera_de_jean_cargo.jpg","/src/assets/pollera_de_jean_cargo_1.jpg"], title: "Pollera de jean cargo", description: '(disponible en talle 38 y 40)', price: 17500, stock: 8, color: ["único"], size: ["38","40"], category: 'polleras', state: ["nuevo"] },
    { id: 12, images: ["/src/assets/bodies_especial.png"], title: "Body especial", description: '(disponible en talle 38 y 40)', price: 15500, stock: 3, color: ["blanco","rojo","negro"], size: ["38","40"], category: 'bodies', state: ["nuevo"] },
    { id: 12, images: ["/src/assets/bodies_tradicional.png"], title: "Body tradicional", description: '(disponible en talle 38 y 40)', price: 12500, stock: 5, color: ["blanco","negro","marrón"], size: ["38","40"], category: 'bodies', state: ["nuevo"] },
];

const groupedProducts = products.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
}, {});

const Home = () => {
    const [user, setUser] = useState('');
    const [products, setProducts] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function fetchProductsData() {
            try {
                const response = await fetch(`http://localhost:8081/api/products`)
                const productsAll = await response.json();
                if(!response.ok) {
                    toast('No se pudieron obtener los productos, contacte al administrador', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        className: "custom-toast",
                    });
                } else { 
                    setProducts(productsAll.data)
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            } finally {
                setIsLoadingProducts(false);
            }
        }
        fetchProductsData();
        const getCookie = (name) => {
            const cookieName = name + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieArray = decodedCookie.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
            }
            return "";
        };
        const cookieValue = getCookie('TokenJWT');
        const fetchUser = async () => {
            try {
              const response = await fetch(`http://localhost:8081/api/sessions/current?cookie=${cookieValue}`)
              const data = await response.json();
              if(data.error === 'jwt expired') {
                logout();
                navigate("/login");
              } else {
                const user = data.data
                if(user) {
                    setUser(user)
                }
                setIsLoading(false)
              }
            } catch (error) {
              console.error('Error:', error);
            }
          };
        fetchUser();
        if(cookieValue) {
            login()
          } else {
            logout()
        }
    }, []);

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

                <NavBar
                isLoading={isLoading}
                isLoggedIn={user.isLoggedIn}
                role={user.role}
                />

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
                                    <Link className='catalogContainer__grid__catalog__categorieContainer__title__prop' to={`/category/${category}`}>
                                        {category}
                                    </Link>
                                </div>

                                <div className='catalogContainer__grid__catalog__categorieContainer__productsContainer'>

                                    <Swiper
                                        className="catalogContainer__grid__catalog__categorieContainer__productsContainer__swiper"
                                        modules={[Navigation, Pagination, Autoplay]}
                                        spaceBetween={100}
                                        slidesPerView={3}
                                        navigation
                                        pagination={{ clickable: true }}
                                        autoplay={{
                                        delay: 3000, // Cambia de slide cada 3 segundos
                                        disableOnInteraction: true, // Sigue moviéndose después de interacción
                                        }}
                                    >
                                        {items.slice(0, 10).map((product) => (
                                        <SwiperSlide key={product.id}>
                                            <ItemProduct
                                            id={product.id}
                                            images={product.images}
                                            title={product.title}
                                            description={product.description}
                                            price={product.price}
                                            />
                                        </SwiperSlide>
                                        ))}
                                    </Swiper>

                                </div>

                                <div className="catalogContainer__grid__catalog__categorieContainer__btnMoreProducts">
                                    <Link className='catalogContainer__grid__catalog__categorieContainer__btnMoreProducts__prop' to={`/category/${category}`}>
                                        Ver más
                                    </Link>
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