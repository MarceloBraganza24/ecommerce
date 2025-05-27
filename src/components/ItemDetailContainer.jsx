import {useEffect,useState,useContext} from 'react'
import NavBar from './NavBar'
import { useParams } from 'react-router-dom'
import ItemCount from './ItemCount';
import Footer from './Footer';
import DeliveryAddress from './DeliveryAddress';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

const ItemDetailContainer = () => {
    const [cartIcon, setCartIcon] = useState('/src/assets/cart_black.png');
    const [storeSettings, setStoreSettings] = useState({});
    const [isLoadingStoreSettings, setIsLoadingStoreSettings] = useState(true);
    const [user, setUser] = useState('');
    const [products, setProducts] = useState([]);
    const [showLogOutContainer, setShowLogOutContainer] = useState(false);
    const [userCart, setUserCart] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const {id} = useParams()
    const productById = products.find((product) => product._id == id)
    const [deliveryForms, setDeliveryForms] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [sellerAddresses, setSellerAddresses] = useState([]);
    const [isLoadingSellerAddresses, setIsLoadingSellerAddresses] = useState(true);
    const [deliveryAddressFormData, setDeliveryAddressFormData] = useState({
        street: "",
        street_number: "",
        locality: "",
    });
    //console.log(userCart)
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [categories, setCategories] = useState([]);
    const [isLoadingDeliveryForm, setIsLoadingDeliveryForm] = useState(true);
    const [formData, setFormData] = useState({
        street: "",
        street_number: "",
        locality: ""
    });

    const [zoomActive, setZoomActive] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: "50%", y: "50%" });

    const handleSelectChange = (key, value) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    useEffect(() => {
        if(user.isLoggedIn) {
            setShowLogOutContainer(true)
        }
    }, [user.isLoggedIn]);

    function esColorClaro(hex) {
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
    }

    useEffect(() => {
        if (storeSettings?.primaryColor) {
            const claro = esColorClaro(storeSettings.primaryColor);
            setCartIcon(claro ? '/src/assets/cart_black.png' : '/src/assets/cart_white.png');
        }
    }, [storeSettings]);

    useEffect(() => {
        if (user?.selected_addresses) {
            // Buscar la dirección en deliveryForms para asegurarnos de que tenga un _id
            const matchedAddress = deliveryForms.find(item => 
                item.street === user.selected_addresses.street &&
                item.street_number === user.selected_addresses.street_number &&
                item.locality === user.selected_addresses.locality
            );
    
            if (matchedAddress) {
                setSelectedAddress(matchedAddress);
                setDeliveryAddressFormData({
                    street: user.selected_addresses.street,
                    street_number: user.selected_addresses.street_number,
                    locality: user.selected_addresses.locality
                })
            } else {
                setSelectedAddress(user.selected_addresses); // Usa la dirección guardada
            }
        }
    }, [user, deliveryForms]);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        let x = ((e.clientX - left) / width) * 100;
        let y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x: `${x}%`, y: `${y}%` });
    };

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    useEffect(() => {
        if (productById) {
          setSelectedImage(`http://localhost:8081/${productById.images[0]}`);
        }
    }, [productById]);

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

    const fetchCartByUserId = async (user_id) => {
        try {
            //setIsLoadingProducts(true);
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

    const fetchDeliveryForm = async () => {
        try {
            setIsLoadingDeliveryForm(true)
            const response = await fetch('http://localhost:8081/api/deliveryForm');
            const deliveryForm = await response.json();
            if (response.ok) {
                setDeliveryForms(deliveryForm.data)
            } else {
                toast('Error al cargar el formulario de entrega', {
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
            setIsLoadingDeliveryForm(false)
        }
    };

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

    useEffect(() => {
        fetchCurrentUser();
        fetchCategories();
        fetchProducts();
        fetchStoreSettings();
        fetchSellerAddresses();
        fetchDeliveryForm();
        window.scrollTo(0, 0);
    }, []);

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
                logo_store={storeSettings?.siteImages?.logoStore || ""}
                primaryColor={storeSettings?.primaryColor || ""}
                cartIcon={cartIcon}
                />
            </div>
            {
                user && (user.role != 'admin') &&
                <DeliveryAddress
                deliveryAddressFormData={deliveryAddressFormData}
                isLoadingDeliveryForm={isLoadingDeliveryForm}
                />
            }
            <div className='itemDetailContainer'>

                
                
                    <div className='itemDetailContainer__itemDetail'>

                        {
                        
                            isLoadingProducts ? 
                            <>
                                <div className="itemDetailContainer__itemDetail__loadingProducts">
                                    Cargando producto&nbsp;&nbsp;<Spinner/>
                                </div>
                            </>
                            : productById ?
                            <>

                                <div className='itemDetailContainer__itemDetail__imgContainer'>
                                
                                    <div onMouseEnter={() => setZoomActive(true)} onMouseMove={handleMouseMove} onMouseLeave={() => setZoomActive(false)} className="itemDetailContainer__itemDetail__imgContainer__img">
                                        <img style={{transform: zoomActive ? "scale(1.5)" : "scale(1)", transformOrigin: `${zoomPosition.x} ${zoomPosition.y}`}} className='itemDetailContainer__itemDetail__imgContainer__img__prop' src={selectedImage} alt="img_product" />
                                    </div>

                                    <div className='itemDetailContainer__itemDetail__imgContainer__galery'>

                                        {productById?.images.slice(0, 6).map((img, index) => (
                                            
                                            <div className='itemDetailContainer__itemDetail__imgContainer__galery__imgContainer'>
                                                <img
                                                key={index}
                                                src={`http://localhost:8081/${img}`}
                                                alt={`Miniatura ${index + 1}`}
                                                className='itemDetailContainer__itemDetail__imgContainer__galery__imgContainer__prop'
                                                onClick={() => setSelectedImage(`http://localhost:8081/${img}`)}
                                                />
                                            </div>

                                        ))}

                                    </div>

                                </div>

                                <div className='itemDetailContainer__itemDetail__infoContainer'>


                                    <div className='itemDetailContainer__itemDetail__infoContainer__info'>

                                        <div className='itemDetailContainer__itemDetail__infoContainer__info__stateContainer'>
                                            <div className='itemDetailContainer__itemDetail__infoContainer__info__stateContainer__state'>{capitalizeFirstLetter(`${productById?.state}`)}</div>
                                            {
                                                productById?.number_sales &&
                                                <div className='itemDetailContainer__itemDetail__infoContainer__info__stateContainer__salesQuantity'>+{productById?.number_sales} Vendidos</div>
                                            }
                                        </div>

                                        <div className='itemDetailContainer__itemDetail__infoContainer__info__title'>
                                            <div className='itemDetailContainer__itemDetail__infoContainer__info__title__prop'>{capitalizeFirstLetter(`${productById?.title}`)}</div>
                                        </div>

                                        <div className='itemDetailContainer__itemDetail__infoContainer__info__description'>
                                            <div className='itemDetailContainer__itemDetail__infoContainer__info__description__prop'>{capitalizeFirstLetter(`${productById?.description}`)}</div>
                                        </div>

                                        <div className='itemDetailContainer__itemDetail__infoContainer__info__price'>
                                            {
                                                productById?.stock >= 1 ?
                                                <div className='itemDetailContainer__itemDetail__infoContainer__info__stock__label'>Stock disponible</div>
                                                :
                                                <div className='itemDetailContainer__itemDetail__infoContainer__info__stock__label'>Sin stock</div>
                                            }
                                        </div>

                                        <div className='itemDetailContainer__itemDetail__infoContainer__info__price'>
                                            <div className='itemDetailContainer__itemDetail__infoContainer__info__price__prop'>$ {productById?.price}</div>
                                        </div>

                                        {
                                            productById?.camposExtras &&
                                            Object.entries(productById.camposExtras).map(([key, value], index) => {
                                                const opciones = value.split(',').map(op => op.trim()); // Generamos el array de opciones
                                                
                                                return (
                                                    <div key={index} className='itemDetailContainer__itemDetail__infoContainer__info__campoExtra'>
                                                    <label 
                                                    className='itemDetailContainer__itemDetail__infoContainer__info__campoExtra__label'
                                                    htmlFor={`campoExtra-${index}`}
                                                    >
                                                    {capitalizeFirstLetter(key)}:
                                                    </label>

                                                    <select
                                                    id={`campoExtra-${index}`}
                                                    className='itemDetailContainer__itemDetail__infoContainer__info__campoExtra__select'
                                                    value={selectedOptions[key] || ''} // valor seleccionado o vacío
                                                    onChange={(e) => handleSelectChange(key, e.target.value)}
                                                    >
                                                    {/* <option value="" disabled>Seleccione una opción</option> */}
                                                    {opciones.map((opcion, i) => (
                                                        <option key={i} value={opcion}>
                                                        {capitalizeFirstLetter(opcion)}
                                                        </option>
                                                    ))}
                                                    </select>
                                                </div>
                                                );
                                            })
                                        }

                                        <ItemCount
                                        user_id={user._id} 
                                        roleUser={user.role} 
                                        id={productById?._id}
                                        images={productById?.images}
                                        title={productById?.title}
                                        description={productById?.description}
                                        price={productById?.price}
                                        stock={productById?.stock}
                                        fetchCartByUserId={fetchCartByUserId}
                                        userCart={userCart}
                                        />

                                    </div>
                                    
                                </div>
                            </>
                            :
                            <>
                                <div className="itemDetailContainer__itemDetail__loadingProducts">
                                    Cargando producto&nbsp;&nbsp;<Spinner/>
                                </div>
                            </>
                        }
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

export default ItemDetailContainer