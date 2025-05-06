import {useContext,useEffect,useState} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import ItemCart from './ItemCart';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import DeliveryAddress from './DeliveryAddress';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

const Cart = () => {
    const [user, setUser] = useState('');
    const [inputCoupon, setInputCoupon] = useState('');
    const [validatedCoupon, setValidatedCoupon] = useState({});
    const [userCart, setUserCart] = useState({});
    const [cookieValue, setCookieValue] = useState('');
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
        province: "",
        country: "",
        postal_code: "",
    });

    const {deleteAllItemCart} = useContext(CartContext);
    const [showLogOutContainer, setShowLogOutContainer] = useState(false);
    const [loadingBtnDeleteAllItemCart, setLoadingBtnDeleteAllItemCart] = useState(false);
    
    const handleDeleteAll = async () => {
        setLoadingBtnDeleteAllItemCart(true); // 👈 Activamos el "vaciando..."
        await deleteAllItemCart(userCart?.user_id, fetchCartByUserId);
        setLoadingBtnDeleteAllItemCart(false); // 👈 Volvemos al estado normal
    };

    useEffect(() => {
        if(user.isLoggedIn) {
            setShowLogOutContainer(true)
        }
    }, [user.isLoggedIn]);

    const [total, setTotal] = useState('');
    const [totalQuantity, setTotalQuantity] = useState('');
    const [totalWithDiscount, setTotalWithDiscount] = useState('');
    
    useEffect(() => {
        
        if(userCart.products && Array.isArray(userCart.products) && validatedCoupon) {
            const total = Array.isArray(userCart.products)?userCart.products.reduce((acumulador, producto) => acumulador + (producto.product.price * producto.quantity), 0): 0;
            setTotal(total)
            const totalQuantity = Array.isArray(userCart.products)?userCart.products.reduce((sum, producto) => sum + producto.quantity, 0):0;
            setTotalQuantity(totalQuantity)
            const discountPercentage = validatedCoupon.discount;
            const totalWithDiscount = total - (total * (discountPercentage / 100));
            setTotalWithDiscount(totalWithDiscount)
        }

    }, [userCart,validatedCoupon]);
    
    useEffect(() => {
        if (user?.selected_addresses) {
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
                    locality: user.selected_addresses.locality,
                    province: user.selected_addresses.province,
                    country: user.selected_addresses.country,
                    postal_code: user.selected_addresses.postal_code,
                })
            } else {
                setSelectedAddress(user.selected_addresses); // Usa la dirección guardada
            }
        }
    }, [user, deliveryForms]);

    const fetchCartByUserId = async (user_id) => {
        try {
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
        window.scrollTo(0, 0);
    }, []);
  
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
                cookieValue={cookieValue}
                fetchUser={fetchUser}
                />
            </div>
            {
                user && 
                <DeliveryAddress
                deliveryAddressFormData={deliveryAddressFormData}
                isLoadingDeliveryForm={isLoadingDeliveryForm}
                />
            }
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
                            <button 
                                onClick={handleDeleteAll} 
                                className='cartContainer__cart__btnContainer__btn'
                                disabled={loadingBtnDeleteAllItemCart} // 👈 Opcional: desactiva el botón mientras carga
                            >
                                {loadingBtnDeleteAllItemCart ? <Spinner/> : 'Vaciar Carrito'}
                            </button>
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

                            <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid'>

                                <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__labelTotal'>TOTAL</div>

                                <div className='cartContainer__accountSummaryContainer__accountSummary__itemGrid__valueTotal'>$ {total}</div>

                            </div>


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
                                ¡Ir al Catálogo!  
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