import {useContext,useEffect,useState} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import ItemCart from './ItemCart';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import DeliveryAddress from './DeliveryAddress';
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner';

const Cart = () => {
    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [inputCoupon, setInputCoupon] = useState('');
    const [validatedCoupon, setValidatedCoupon] = useState({});
    const [userCart, setUserCart] = useState({});
    const [cookieValue, setCookieValue] = useState('');
    //console.log(userCart.user_id)
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [deliveryForms, setDeliveryForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isLoadingDeliveryForm, setIsLoadingDeliveryForm] = useState(true);
    const [showLabelAddCoupon, setShowLabelAddCoupon] = useState(true);
    const [showLabelValidatedCoupon, setShowLabelValidatedCoupon] = useState(false);
    const [showInputCouponContainer, setShowInputCouponContainer] = useState(false);
    const [isLoadingValidateCoupon, setIsLoadingValidateCoupon] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [deliveryAddressFormData, setDeliveryAddressFormData] = useState({
        street: "",
        street_number: "",
        locality: "",
    });
    const [formData, setFormData] = useState({
        street: "",
        street_number: "",
        locality: ""
    });

    const {cart, deleteAllItemCart} = useContext(CartContext);
    
    //const [codigoPostal, setCodigoPostal] = useState("");
    // const [costoEnvio, setCostoEnvio] = useState(null);
    // const [error, setError] = useState(null);


    //const total = userCart?.reduce((acumulador, producto) => acumulador + (producto.product.price * producto.quantity), 0);
    //const totalQuantity = userCart?.reduce((sum, producto) => sum + producto.quantity, 0);
    const total = Array.isArray(userCart.products)?userCart.products.reduce((acumulador, producto) => acumulador + (producto.product.price * producto.quantity), 0)
    : 0;
    const totalQuantity = Array.isArray(userCart.products)?userCart.products.reduce((sum, producto) => sum + producto.quantity, 0):0;
    const discountPercentage = validatedCoupon.discount;
    const totalWithDiscount = total - (total * (discountPercentage / 100));

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

    const handleInputCoupon = (e) => {
        setInputCoupon(e.target.value)
    }

    const handleBtnAddCoupon = () => {
        if(showInputCouponContainer) {
            setShowInputCouponContainer(false)
        } else {
            setShowInputCouponContainer(true)
        }
    }

    const handleBtnChangeCoupon = () => {
        setShowInputCouponContainer(true)
        setShowLabelAddCoupon(true)
        setShowLabelValidatedCoupon(false)
    }

    const handleBtnValidateCoupon = async () => {
        if(!inputCoupon) {
            toast('Debes ingresar el código del cupón', {
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
            return
        }
        try {
            setIsLoadingValidateCoupon(true)
            const response = await fetch("http://localhost:8081/api/coupons/validate-coupon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codeCoupon: inputCoupon }),
            });
            const data = await response.json();
            if (response.ok) {
                toast('Cupón válido', {
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
                setValidatedCoupon(data.data)
                setShowLabelAddCoupon(false)
                setShowInputCouponContainer(false)
                setShowLabelValidatedCoupon(true)
            } else {
                toast('Cupón inválido', {
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
            toast('Error al validar el cupón', {
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
            setIsLoadingValidateCoupon(false)
        }
    }

    /* const cotizarEnvio = async () => {
        setError(null);
        setCostoEnvio(null);
    
        try {
          const response = await fetch("http://localhost:8081/api/shipping/cotizar-envio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destino: codigoPostal, peso: 1 }), // Peso en kg
          });
    
          const data = await response.json();
    
          if (response.ok) {
            setCostoEnvio(`Costo: $${data.precio} - Entrega en ${data.tiempo_estimado} días`);
          } else {
            setError(data.error || "No se pudo calcular el costo.");
          }
        } catch (err) {
          setError("Error en la conexión con el servidor.");
        }
    }; */

    const fetchCartByUserId = async (user_id) => {
        try {
            setIsLoadingProducts(true)
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
                setUserCart([]); // Si hay un error, aseguramos que el carrito esté vacío
                return [];
            }
    
            if (!data.data || !Array.isArray(data.data.products)) {
                console.warn("Carrito vacío o no válido, asignando array vacío.");
                setUserCart([]); // Si el carrito no tiene productos, lo dejamos vacío
                return [];
            }
    
            setUserCart(data.data); // ✅ Asignamos los productos al estado del carrito
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
            setUserCart([]); // Si hay un error en la petición, dejamos el carrito vacío
            return [];
        } finally {
            setIsLoadingProducts(false)
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

    
    const fetchUser = async (cookieValue) => {
        try {
            const response = await fetch(`http://localhost:8081/api/sessions/current?cookie=${cookieValue}`)
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

    

    useEffect(() => {
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
        if(cookieValue) {
            setCookieValue(cookieValue)
        } 
        fetchUser(cookieValue);
        fetchCategories();
        fetchDeliveryForm();
        //cotizarEnvio()
        if(cookieValue) {
            login()
        } else {
            logout()
        }
        window.scrollTo(0, 0);
    }, []);
  
    return (

        <>
            <div className='navbarContainer'>
                <NavBar
                isLoading={isLoading}
                categories={categories}
                isLoggedIn={user.isLoggedIn}
                role={user.role}
                userCart={userCart}
                cookieValue={cookieValue}
                fetchUser={fetchUser}
                />
            </div>
            <DeliveryAddress
            deliveryAddressFormData={deliveryAddressFormData}
            isLoadingDeliveryForm={isLoadingDeliveryForm}
            />
            {
                
                isLoadingProducts ? 
                <>
                    <div className="itemDetailContainer__itemDetail__loadingProducts">
                        Cargando productos&nbsp;&nbsp;<Spinner/>
                    </div>
                </>
                :
                userCart?.products?.length > 0 ? 

                <>
                
                <div className='cartContainer'>

                    <div className='cartContainer__title'>
                        <div className='cartContainer__title__prop'>Carrito de compras</div>
                    </div>

                    <div className='cartContainer__cart'>

                        <div className='cartContainer__cart__header'>

                            <div className='cartContainer__cart__header__labelProp'>
                                <div className='cartContainer__cart__header__labelProp__prop'></div>
                            </div>

                            <div className='cartContainer__cart__header__labelProp'>
                                <div className='cartContainer__cart__header__labelProp__prop'>Producto</div>
                            </div>

                            <div className='cartContainer__cart__header__labelProp'>
                                <div className='cartContainer__cart__header__labelProp__prop'>Descripción</div>
                            </div>

                            <div className='cartContainer__cart__header__labelProp'>
                                <div className='cartContainer__cart__header__labelProp__prop'>Cantidad</div>
                            </div>

                            <div className='cartContainer__cart__header__labelProp'>
                                <div className='cartContainer__cart__header__labelProp__prop'>Precio</div>
                            </div>

                            <div className='cartContainer__cart__header__labelProp'>
                                <div className='cartContainer__cart__header__labelProp__prop'>Subtotal</div>
                            </div>

                        </div>

                        <div className='cartContainer__cart__productsList'>


                            {
                                userCart.products.map((itemCart) =>{
                                    
                                    return(
                                        
                                        <ItemCart
                                        user_id={user._id}
                                        id={itemCart.product._id}
                                        img={itemCart.product.images[0]}
                                        title={itemCart.product.title}
                                        description={itemCart.product.description}
                                        price={itemCart.product.price}
                                        quantity={itemCart.quantity}
                                        stock={itemCart.product.stock}
                                        fetchCartByUserId={fetchCartByUserId}
                                        />
                                        
                                    )
                                })
                            }

                        </div>

                        <div className='cartContainer__cart__btnContainer'>
                            <button onClick={()=>deleteAllItemCart(userCart?.user_id,fetchCartByUserId)} className='cartContainer__cart__btnContainer__btn'>Vaciar Carrito</button>
                        </div>

                    </div>
            
                    <div className='cartContainer__accountSummaryContainer'>

                        <div className='cartContainer__accountSummaryContainer__accountSummary'>
                            
                            <div className='cartContainer__accountSummaryContainer__accountSummary__title'>
                                <div className='cartContainer__accountSummaryContainer__accountSummary__title__prop'>Resumen de compra</div>
                            </div>

                            <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid'>

                                {
                                    totalQuantity == 1 ?
                                    <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__label'>Producto</div>
                                    :
                                    <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__label'>Productos ({totalQuantity})</div>
                                }

                                <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__value'>$ {total}</div>

                            </div>

                            <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid'>

                                <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__label'>Envío</div>

                                <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__value'>$ 0</div>

                            </div>

                            {
                                showLabelAddCoupon &&
                                <div className='cartContainer__accountSummaryContainer__accountSummary__itemCupon'>
                                    <div onClick={handleBtnAddCoupon} className='cartContainer__accountSummaryContainer__accountSummary__itemCupon__prop'>Ingresar código de cupón</div>
                                </div>
                            }

                            {
                                showInputCouponContainer &&
                                <div className='cartContainer__accountSummaryContainer__accountSummary__inputCouponContainer'>
                                    <input placeholder='Código cupón' value={inputCoupon} onChange={handleInputCoupon} className='cartContainer__accountSummaryContainer__accountSummary__inputCouponContainer__input' type="text" />
                                    
                                    <button onClick={handleBtnValidateCoupon} className='cartContainer__accountSummaryContainer__accountSummary__inputCouponContainer__btn'>
                                        {isLoadingValidateCoupon ? (
                                            <>
                                                <Spinner />
                                            </>
                                        ) : (
                                            'Validar'
                                        )}
                                    </button>
                                </div>
                            }

                            {
                                showLabelValidatedCoupon &&
                                <>
                                <div className='cartContainer__accountSummaryContainer__accountSummary__itemCupon'>
                                    <div className='cartContainer__accountSummaryContainer__accountSummary__itemCupon__prop'>Cupón válido con {validatedCoupon.discount}% de descuento</div>
                                </div>
                                <div className='cartContainer__accountSummaryContainer__accountSummary__itemCupon'>
                                    <div onClick={handleBtnChangeCoupon} className='cartContainer__accountSummaryContainer__accountSummary__itemCupon__prop'>Cambiar cupón</div>
                                </div>
                                </>
                            }

                            {
                                showLabelValidatedCoupon ?
                                <>
                                    <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid'>

                                        <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__labelTotalBefore'></div>

                                        <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__valueTotal'><span style={{fontSize:'14px',alignSelf:'center'}}>antes</span> <span style={{textDecoration:'line-through'}}>$ {total}</span></div>

                                    </div>
                                    <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid'>

                                        <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__labelTotal'>TOTAL <span style={{fontSize:'14px'}}>(con descuento)</span></div>

                                        <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__valueTotal'>$ {totalWithDiscount}</div>

                                    </div>
                                </>
                                :
                                <>
                                    <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid'>

                                        <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__labelTotal'>TOTAL</div>

                                        <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__valueTotal'>$ {total}</div>

                                    </div>
                                </>
                            }


                            <div className='cartContainer__accountSummaryContainer__accountSummary__btn'>
                                <Link to={'/shipping'} className='cartContainer__accountSummaryContainer__accountSummary__btn__prop'>
                                    Continuar compra
                                </Link>
                            </div>

                        </div>

                    </div>

                </div> 

                </> :

                <>
                    
                    <div className='noProductsContainer'>

                        <div className='noProductsContainer__phrase'>
                            <div className='noProductsContainer__phrase__prop'>No hay productos en el carrito</div>
                        </div>
                        <div className='noProductsContainer__link'>
                            <Link to={"/#catalog"} className='noProductsContainer__link__prop'>
                                ¡Volver al Catálogo!  
                            </Link>
                        </div>

                    </div>

                </>
            }

            <Footer/>

        </>
      
    )

}

export default Cart