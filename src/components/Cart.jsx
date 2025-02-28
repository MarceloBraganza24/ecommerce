import {useContext,useEffect} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import ItemCart from './ItemCart';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

const Cart = () => {

    const {cart, deleteAllItemCart} = useContext(CartContext);

    const total = cart.reduce((acumulador, producto) => acumulador + (producto.price * producto.quantity), 0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  
    return (

        <>
            <div className='navbarContainer'>
                <NavBar/>
            </div>
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
                                <div className='cartContainer__cart__header__labelProp__prop'>Título</div>
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
                                        />
                                        
                                    )
                                })
                            }

                        </div>

                        <div className='cartContainer__cart__btnTotal'>

                            <div className='cartContainer__cart__btnTotal__btnContainer'>
                                <button onClick={deleteAllItemCart} className='cartContainer__cart__btnTotal__btnContainer__btn'>Vaciar Carrito</button>
                            </div>

                            <div className='cartContainer__cart__btnTotal__totalContainer'>
                                <div className='cartContainer__cart__btnTotal__totalContainer__total'>TOTAL: $ {total}</div>
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