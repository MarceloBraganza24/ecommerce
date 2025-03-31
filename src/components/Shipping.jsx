import {useState,useContext,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/ShoppingCartContext';
import Spinner from './Spinner';

const Shipping = () => {
    const [metodoEntrega, setMetodoEntrega] = useState("domicilio");
    const {cart} = useContext(CartContext);
    const [isLoadingDeliveryForm, setIsLoadingDeliveryForm] = useState(true);
    const [isLoadingSellerAddresses, setIsLoadingSellerAddresses] = useState(true);
    const [sellerAddresses, setSellerAddresses] = useState([]);
    const [selectedSellerAddress, setSelectedSellerAddress] = useState("");
    const [formData, setFormData] = useState({
        street: "",
        street_number: "",
        locality: ""
    });
    const [sellerAddressData, setSellerAddressData] = useState({
        street: "",
        street_number: "",
        locality: ""
    });

    const total = cart.reduce((acumulador, producto) => acumulador + (producto.price * producto.quantity), 0);
    const totalQuantity = cart.reduce((sum, producto) => sum + producto.quantity, 0);

    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const fetchDeliveryForm = async () => {
        try {
            setIsLoadingDeliveryForm(true)
            const response = await fetch('http://localhost:8081/api/deliveryForm');
            const deliveryForm = await response.json();
            if (response.ok) {
                setFormData({
                    street: deliveryForm.data[0].street || "",
                    street_number: deliveryForm.data[0].street_number || "",
                    locality: deliveryForm.data[0].locality || ""
                });
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

    const fetchSellerAddresses = async () => {
        try {
            setIsLoadingSellerAddresses(true)
            const response = await fetch('http://localhost:8081/api/sellerAddresses');
            const data = await response.json();
            if (response.ok) {
                setSellerAddresses(data.data); 
                setSellerAddressData({
                    street: data.data[0].street || "",
                    street_number: data.data[0].street_number || "",
                    locality: data.data[0].locality || ""
                });
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
        } finally {
            setIsLoadingSellerAddresses(false)
        }
    };

    useEffect(() => {
        /* const getCookie = (name) => {
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
        fetchCategories();
        fetchProducts();
        fetchDeliveryForm();
        if(cookieValue) {
            login()
            } else {
                logout()
        }
        window.scrollTo(0, 0); */
        fetchDeliveryForm();
        fetchSellerAddresses();
    }, []);

    const handleSelectSellerAddressChange = (event) => {
        setSelectedSellerAddress(event.target.value);
        console.log("Dirección seleccionada:", event.target.value);
    };


    return (

        <>

            <div className='headerPurchase'>
                
                <Link to={"/"} className='headerPurchase__logo'>
                    <img className='headerPurchase__logo__prop' src="/src/assets/logo_ecommerce_h.png" alt="logo" />
                </Link>
                
            </div>

            <div className="shippingContainer">

                <div className="shippingContainer__deliveryMethodContainer">

                    <div className="shippingContainer__deliveryMethodContainer__title">
                        <div className="shippingContainer__deliveryMethodContainer__title__prop">Elegí la forma de entrega</div>
                    </div>

                    <div onClick={() => setMetodoEntrega("domicilio")} className="shippingContainer__deliveryMethodContainer__deliveryMethod">

                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid">

                            <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__radio">
                                <input type="radio" name="metodoEntrega" value='domicilio' checked={metodoEntrega === "domicilio"} onChange={(e) => setMetodoEntrega(e.target.value)} />
                            </div>

                            <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__option">Enviar a domicilio</div>

                            <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__state">$ 7500</div>

                        </div>

                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__addressContainer">
                            {
                                isLoadingDeliveryForm ? 
                                    <>
                                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__addressContainer__address">
                                            <Spinner/>
                                        </div>
                                    </>
                                :
                                formData.street &&
                                <div className='shippingContainer__deliveryMethodContainer__deliveryMethod__addressContainer__address'>{capitalizeWords(formData.street)} {capitalizeWords(formData.street_number)}, {capitalizeWords(formData.locality)}</div>
                            }
                            {/* <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__addressContainer__address">{capitalizeWords(formData.street)} {capitalizeWords(formData.street_number)}, {capitalizeWords(formData.locality)}</div> */}
                        </div>

                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__editAddressContainer">
                            <Link to={"/deliveryForm"} className='shippingContainer__deliveryMethodContainer__deliveryMethod__editAddressContainer__btn'>
                                Editar o elegir otro domicilio
                            </Link>
                        </div>

                    </div>

                    <div onClick={() => setMetodoEntrega("vendedor")} className="shippingContainer__deliveryMethodContainer__deliveryMethod">

                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid">

                            <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__radio">
                                <input type="radio" name="metodoEntrega" value='vendedor' checked={metodoEntrega === "vendedor"} onChange={(e) => setMetodoEntrega(e.target.value)} />
                            </div>

                            <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__option">Retirar en el domicilio del vendedor</div>

                            <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__state">Gratis</div>

                        </div>

                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__addressContainer">
                            {
                                isLoadingSellerAddresses ? 
                                    <>
                                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__addressContainer__address">
                                            <Spinner/>
                                        </div>
                                    </>
                                :
                                sellerAddressData &&
                                <select className='shippingContainer__deliveryMethodContainer__deliveryMethod__addressContainer__select' id="addressSelect" value={selectedSellerAddress} onChange={handleSelectSellerAddressChange}>
                                    <option value="">Selecciona una opción</option>
                                    {sellerAddresses.map((address, index) => (
                                    <option key={index} value={`${address.street} ${address.street_number}, ${address.locality}`}>
                                        {address.street} {address.street_number}, {address.locality}
                                    </option>
                                    ))}
                                </select>
                            }
                        </div>

                    </div>

                    <div className='shippingContainer__deliveryMethodContainer__btnContinue'>
                        <Link to={'/paymentForm'} className='shippingContainer__deliveryMethodContainer__btnContinue__prop'>
                            Continuar
                        </Link>
                    </div>

                </div>

                <div className="shippingContainer__accountSummaryContainer">

                    <div className="shippingContainer__accountSummaryContainer__accountSummary">

                        <div className="shippingContainer__accountSummaryContainer__accountSummary__title">

                            <div className="shippingContainer__accountSummaryContainer__accountSummary__title__prop">Resumen de compra</div>

                        </div>

                        <div className="shippingContainer__accountSummaryContainer__accountSummary__item">

                            {
                                totalQuantity == 1 ?
                                <>
                                    {/* <div className='shippingContainer__accountSummaryContainer__accountSummary__item__label'>Producto</div> */}
                                    <Link to={"/cart"} className='shippingContainer__accountSummaryContainer__accountSummary__item__label'>
                                        Producto
                                    </Link>
                                    <div className="shippingContainer__accountSummaryContainer__accountSummary__item__value">$ {total}</div>
                                </>
                                :
                                <>
                                    {/* <div className='shippingContainer__accountSummaryContainer__accountSummary__item__label'>Productos ({totalQuantity})</div> */}
                                    <Link to={"/cart"} className='shippingContainer__accountSummaryContainer__accountSummary__item__label'>
                                        Productos ({totalQuantity})
                                    </Link>
                                    <div className="shippingContainer__accountSummaryContainer__accountSummary__item__value">$ {total}</div>
                                </>
                            }

                        </div>

                        <div className="shippingContainer__accountSummaryContainer__accountSummary__item">

                            <div className="shippingContainer__accountSummaryContainer__accountSummary__item__label">Pagás</div>
                            <div className="shippingContainer__accountSummaryContainer__accountSummary__item__value">$ {total}</div>

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}

export default Shipping