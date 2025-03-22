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

const Cart = () => {
    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    const {cart, deleteAllItemCart} = useContext(CartContext);

    const total = cart.reduce((acumulador, producto) => acumulador + (producto.price * producto.quantity), 0);
    const totalQuantity = cart.reduce((sum, producto) => sum + producto.quantity, 0);

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
        window.scrollTo(0, 0);
    }, []);
  
    return (

        <>
            <div className='navbarContainer'>
                <NavBar isLoading={isLoading} isLoggedIn={user.isLoggedIn}/>
            </div>
            <DeliveryAddress/>
            {
                cart.length > 0 ? 

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
                                cart.map((itemCart) =>{
                                    
                                    return(
                                        
                                        <ItemCart
                                        id={itemCart.id}
                                        img={itemCart.img}
                                        title={itemCart.title}
                                        description={itemCart.description}
                                        price={itemCart.price}
                                        quantity={itemCart.quantity}
                                        stock={itemCart.stock}
                                        />
                                        
                                    )
                                })
                            }

                        </div>

                        <div className='cartContainer__cart__btnContainer'>
                            <button onClick={deleteAllItemCart} className='cartContainer__cart__btnContainer__btn'>Vaciar Carrito</button>
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


                            <div className='cartContainer__accountSummaryContainer__accountSummary__itemCupon'>
                                <div className='cartContainer__accountSummaryContainer__accountSummary__itemCupon__prop'>Ingresar código de cupón</div>
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