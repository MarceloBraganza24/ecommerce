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
import BtnGoUp from "./BtnGoUp";
import Spinner from "./Spinner";

const Home = () => {
    const [cartIcon, setCartIcon] = useState('/src/assets/cart_black.png');
    const [logosSlider, setLogosSlider] = useState([]);
    const [inputFilteredProducts, setInputFilteredProducts] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [user, setUser] = useState('');
    const [sellerAddresses, setSellerAddresses] = useState([]);
    //console.log(storeSettings)
    const [isLoadingSellerAddresses, setIsLoadingSellerAddresses] = useState(true);
    const [storeSettings, setStoreSettings] = useState({});
    const [isLoadingStoreSettings, setIsLoadingStoreSettings] = useState(true);
    const [products, setProducts] = useState([]);
    const [paginatedProducts, setPaginatedProducts] = useState([]);
    const [showLogOutContainer, setShowLogOutContainer] = useState(false);
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });  
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [categories, setCategories] = useState([]);
    const [userCart, setUserCart] = useState({});
    const SERVER_URL = "http://localhost:8081/";
    
    const navigate = useNavigate();
    const location = useLocation();

    const handleInputFilteredProducts = (e) => {
        setInputFilteredProducts(e.target.value);
        setPageInfo((prev) => ({ ...prev, page: 1 })); // Reiniciar a la primera página
    };

    function filtrarPorTitle(valorIngresado) {
        const valorMinusculas = valorIngresado.toLowerCase();
        const objetosFiltrados = paginatedProducts.filter(objeto => {
            const nombreMinusculas = objeto.title.toLowerCase();
            return nombreMinusculas.includes(valorMinusculas);
        });
        return objetosFiltrados;
    }
    const objetosFiltrados = filtrarPorTitle(inputFilteredProducts);
    
    const groupedProducts = products.reduce((acc, product) => {
        acc[product.category] = acc[product.category] || [];
        acc[product.category].push(product);
        return acc;
    }, {});

    /* function esColorClaro(hex) {
        if (!hex) return true;

        // Elimina el símbolo #
        hex = hex.replace("#", "");

        // Convierte a RGB
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Fórmula de luminancia percibida
        const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
        return luminancia > 186; // Umbral típico: > 186 es claro
    } */
    function esColorClaro(hex) {
        if (!hex) return true;

        hex = hex.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness > 128; // <-- usar el mismo umbral que en getContrastingTextColor
    }


    useEffect(() => {
        if (storeSettings?.primaryColor) {
            const claro = esColorClaro(storeSettings.primaryColor);
            setCartIcon(claro ? '/src/assets/cart_black.png' : '/src/assets/cart_white.png');
        }
    }, [storeSettings]);

    const fetchCartByUserId = async (user_id) => {
        try {
            setIsLoadingProducts(true);
            const response = await fetch(`http://localhost:8081/api/carts/byUserId/${user_id}`);
            const data = await response.json();
            if (!response.ok) {
                console.error("Error al obtener el carrito:", data);
                toast('Error al cargar el carrito del usuario actual', {
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
                setUserCart({ user_id, products: [] }); // 👈 cambio clave
                return [];
            }
    
            if (!data.data || !Array.isArray(data.data.products)) {
                console.warn("Carrito vacío o no válido, asignando array vacío.");
                setUserCart({ user_id, products: [] }); // 👈 cambio clave
                return [];
            }
    
            setUserCart(data.data);
            return data.data;
    
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            toast('Error en la conexión', {
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
            setUserCart({ user_id, products: [] }); // 👈 cambio clave
            return [];
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/categories');
            const data = await response.json();
            if (response.ok) {
                setCategories(data.data); 
            } else {
                toast('Error al cargar categorías', {
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
            }

        } catch (error) {
            console.error(error);
            toast('Error en la conexión', {
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
        }
    };

    const fetchProducts = async () => {
        try {
            setIsLoadingProducts(true);
            const response = await fetch(`http://localhost:8081/api/products`)
            const productsAll = await response.json();
            setProducts(productsAll.data)
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setIsLoadingProducts(false);  
        }
    };

    const fetchPaginatedProducts = async (page = 1, search = '') => {
        try {
            setIsLoadingProducts(true);
            const response = await fetch(`http://localhost:8081/api/products/byPage?page=${page}&search=${search}&limit=9`)
            const productsAll = await response.json();
            setPaginatedProducts(productsAll.data.docs)
            setPageInfo({
                page: productsAll.data.page,
                totalPages: productsAll.data.totalPages,
                hasNextPage: productsAll.data.hasNextPage,
                hasPrevPage: productsAll.data.hasPrevPage,
                nextPage: productsAll.data.nextPage,
                prevPage: productsAll.data.prevPage
            });
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setIsLoadingProducts(false)
        }
    };

    useEffect(() => {
        fetchPaginatedProducts(pageInfo.page, inputFilteredProducts);
    }, [pageInfo.page, inputFilteredProducts]);

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/sessions/current', {
                method: 'GET',
                credentials: 'include', // MUY IMPORTANTE para enviar cookies
            });
            const data = await response.json();
            if(data.error === 'jwt must be provided') { 
                setIsLoading(false)
                setIsLoadingProducts(false)
            } else {
                const user = data.data
                if(user) {
                    setUser(user)
                    fetchCartByUserId(user._id);
                }
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchSellerAddresses = async () => {
        try {
            setIsLoadingSellerAddresses(true)
            const response = await fetch('http://localhost:8081/api/sellerAddresses');
            const data = await response.json();
            if (response.ok) {
                setSellerAddresses(data.data); 
            } else {
                toast('Error al cargar domicilios', {
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
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingSellerAddresses(false)
        }
    };

    const fetchStoreSettings = async () => {
        try {
            setIsLoadingStoreSettings(true)
            const response = await fetch('http://localhost:8081/api/settings');
            const data = await response.json();
            //console.log(data)
            if (response.ok) {
                setStoreSettings(data); 
            } else {
                toast('Error al cargar configuraciones', {
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
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingStoreSettings(false)
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchCurrentUser();
        fetchProducts();
        fetchStoreSettings();
        fetchSellerAddresses();
        fetchPaginatedProducts();
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
              setIsVisible(true);
            } else {
              setIsVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    useEffect(() => {
        if(user.isLoggedIn) {
            setShowLogOutContainer(true)
        }
    }, [user.isLoggedIn]);

    useEffect(() => {
        if (location.hash) {
        const id = location.hash.replace("#", "");
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.scrollIntoView({ behavior: "smooth" });
        }
        }
    }, [location]);

    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
    };
    
    const LogOut = () => {

        const handleBtnLogOut = async () => {
            const response = await fetch(`http://localhost:8081/api/sessions/logout`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 👈 Esto es clave
            })
            const data = await response.json();
            if(response.ok) {
                toast('Gracias por visitar nuestra página', {
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
                fetchCurrentUser()
                setShowLogOutContainer(false)
                fetchCartByUserId(user._id)
                setTimeout(() => {
                    window.location.reload()
                }, 2500);
            }
        }
    

        return (
            
            <div className='logOutContainer'>
                <div onClick={handleBtnLogOut} className='logOutContainer__label'>LOG OUT</div>
            </div>

        )

    }

    function hexToRgba(hex, opacity) {
        const cleanHex = hex.replace('#', '');
        const bigint = parseInt(cleanHex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return (

        <>

            <BtnGoUp
            isVisible={isVisible}
            scrollToTop={scrollToTop}
            />

            <div className='navbarContainer'>
                <NavBar
                isLoading={isLoading}
                isLoggedIn={user.isLoggedIn}
                role={user.role}
                first_name={user.first_name}
                categories={categories}
                userCart={userCart}
                showLogOutContainer={showLogOutContainer}
                hexToRgba={hexToRgba}
                cartIcon={cartIcon}
                logo_store={storeSettings?.siteImages?.logoStore || ""}
                primaryColor={storeSettings?.primaryColor || ""}
                />
            </div>
            
            <div className="homeContainer" style={{backgroundImage: `url(http://localhost:8081/${storeSettings?.siteImages?.homeImage || ''})`}}>
                
                {
                    showLogOutContainer&&
                    <LogOut/>
                }

            </div>

            {
                storeSettings?.sliderLogos?.length != 0 &&

                <div className="slider-logos">

                    <div className="slider-logos__logo-slider">
                        <div className="slider-logos__logo-slider__slider-track">
                            {storeSettings?.sliderLogos?.concat(storeSettings?.sliderLogos).map((logo, index) => (
                                <div key={index} className="slider-logos__logo-slider__slider-track__slide">
                                <img className="slider-logos__logo-slider__slider-track__slide__img" src={`${SERVER_URL}${logo}`} alt={logo.alt} />
                            </div>
                            ))}
                        </div>
                    </div>

                </div>
            }

            <div className='catalogContainer' id='catalog'>

                <div className="catalogContainer__titleContainer">
                    <div className='catalogContainer__titleContainer__title'>
                        <div className='catalogContainer__titleContainer__title__prop'>CATÁLOGO</div>
                    </div>
                </div>

                <div className='catalogContainer__inputSearchProduct'>
                    <div className="catalogContainer__inputSearchProduct__searchProductsLabel">Buscar productos</div>
                    <input type="text" onChange={handleInputFilteredProducts} value={inputFilteredProducts} placeholder='Ingrese un titulo' className='catalogContainer__inputSearchProduct__input' name="" id="" />
                </div>

                <div className="catalogContainer__grid">
                    
                    <div className="catalogContainer__grid__catalog">

                        {
                            isLoadingProducts ? 
                                <>
                                    <div className="catalogContainer__grid__catalog__isLoadingLabel">
                                        Cargando productos&nbsp;&nbsp;<Spinner/>
                                    </div>
                                </>
                            :

                            inputFilteredProducts != '' ?

                            <div className="catalogContainer__grid__catalog__filteredProductsList">
                                {objetosFiltrados.map((product) => (
                                    <ItemProduct
                                    user_id={user._id} 
                                    fetchCartByUserId={fetchCartByUserId}
                                    id={product._id}
                                    stock={product.stock}
                                    images={product.images}
                                    title={product.title}
                                    description={product.description}
                                    price={product.price}
                                    userCart={userCart}
                                    />
                                ))}
                                <div className='cPanelProductsContainer__btnsPagesContainer'>
                                    <button className='cPanelProductsContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfo.hasPrevPage}
                                        onClick={() => fetchPaginatedProducts(pageInfo.prevPage)}
                                        >
                                        Anterior
                                    </button>
                                    
                                    <span>Página {pageInfo.page} de {pageInfo.totalPages}</span>

                                    <button className='cPanelProductsContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfo.hasNextPage}
                                        onClick={() => fetchPaginatedProducts(pageInfo.nextPage)}
                                        >
                                        Siguiente
                                    </button>
                                </div>
                            </div>

                            :

                            products.length ?
                        
                            Object.entries(groupedProducts).map(([category, items]) => (

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
                                            <SwiperSlide key={product._id}>
                                                <ItemProduct
                                                user_id={user._id} 
                                                fetchCartByUserId={fetchCartByUserId}
                                                id={product._id}
                                                stock={product.stock}
                                                images={product.images}
                                                title={product.title}
                                                description={product.description}
                                                price={product.price}
                                                userCart={userCart}
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

                            ))
                            :
                            <>
                                <div className="catalogContainer__grid__catalog__nonProductsLabel"><Spinner/></div>
                                {
                                    user.role == 'admin' &&
                                    <Link className='catalogContainer__grid__catalog__goCpanelLink' to={`/cpanel/products`}>
                                        Ir a cpanel
                                    </Link>
                                }
                            </>
                        }
                        
                    </div>

                </div>

            </div>

            <Footer
            logo_store={storeSettings?.siteImages?.logoStore || ""}
            aboutText={storeSettings?.footerLogoText || ""}
            phoneNumbers={storeSettings.phoneNumbers}
            contactEmail={storeSettings.contactEmail}
            sellerAddresses={sellerAddresses}
            isLoadingSellerAddresses={isLoadingSellerAddresses}
            isLoadingStoreSettings={isLoadingStoreSettings}
            />
            
        </>

    )
    
}

export default Home