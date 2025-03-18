import {useContext,useState,useEffect} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import { Link } from 'react-router-dom'

const NavBar = ({isLoggedIn,isLoading}) => {
    const [showHMenuOptions, setShowHMenuOptions] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const {cart} = useContext(CartContext)
    const totalQuantity = cart.reduce((sum, producto) => sum + producto.quantity, 0);

    const handleBtnShowHMenuOptions = () => {

        if(showHMenuOptions) {
            setShowHMenuOptions(false)
        } else {
            if(showCategories) {
                setShowCategories(false)
            }
            setShowHMenuOptions(true)
        }

    }

    const handleBtnShowCategories = () => {
        if(showCategories) {
            setShowCategories(false)
        } else {
            if(showHMenuOptions) {
                setShowHMenuOptions(false)
            }
            setShowCategories(true)
        }
    }

    useEffect(() => {
        const handleScrollShowHMenuOptions = () => setShowHMenuOptions(false);
        const handleScrollShowCategories = () => setShowCategories(false);
        window.addEventListener("scroll", handleScrollShowCategories);
        window.addEventListener("scroll", handleScrollShowHMenuOptions);
        return () => {
            window.removeEventListener("scroll", handleScrollShowCategories);
            window.removeEventListener("scroll", handleScrollShowHMenuOptions);
        } 
    }, []);

    return (

        <>
            <div className='header'>

                <div className='header__logo-menu'>

                    <div className='header__logo-menu__hMenuContainer'>
                        {
                            isLoading ?
                            <div>Cargando</div>
                            :
                            <div onClick={handleBtnShowHMenuOptions} className='header__logo-menu__hMenuContainer__hMenu'>
                                <div className='header__logo-menu__hMenuContainer__hMenu__line'></div>
                                <div className='header__logo-menu__hMenuContainer__hMenu__line'></div>
                                <div className='header__logo-menu__hMenuContainer__hMenu__line'></div>
                            </div>
                        }
                    </div>

                    <Link to={"/"} className='header__logo-menu__logoContainer'>
                        <img className='header__logo-menu__logoContainer__logo' src="/src/assets/logo_ecommerce_h.png" alt="logo" />
                    </Link>

                    <div className='header__logo-menu__menuContainer'>

                        <Link to={"/#catalog"} className='header__logo-menu__menuContainer__item'>
                            CATÁLOGO
                        </Link>

                        <div onClick={handleBtnShowCategories} className='header__logo-menu__menuContainer__categoriesSelect'>CATEGORÍAS</div>

                    </div>

                </div>

                <div className='header__rightMenu'>
                    
                    <div className='header__rightMenu__menu'>

                        <Link to={"/about"} className='header__rightMenu__menu__item'>
                            SOBRE NOSOTROS
                        </Link>
                        <Link to={"/contact"} className='header__rightMenu__menu__item'>
                            CONTACTO
                        </Link>

                        <div className='header__rightMenu__menu__cart'>

                            <Link to={"/cart"} className='header__rightMenu__menu__cart__logo'>
                                <img className='header__rightMenu__menu__cart__logo__prop' src="/src/assets/cart.png" alt="" />
                            </Link>
                            <div className='header__rightMenu__menu__cart__number'>
                                <div className='header__rightMenu__menu__cart__number__prop'>{totalQuantity}</div>
                            </div>

                        </div>
                        {
                            isLoading ?
                            <div className='header__rightMenu__menu__item'>Cargando</div>
                            : isLoggedIn ?
                            <Link to={"/logIn"} className='header__rightMenu__menu__item'>
                                LOG OUT
                            </Link>
                            :
                            <Link to={"/logIn"} className='header__rightMenu__menu__item'>
                                LOG IN
                            </Link>
                        }

                    </div>

                </div>
                
            </div>
            
            {
                showHMenuOptions &&
                <div className='hMenuOptionsContainer'>
                    <div className='hMenuOptionsContainer__btnCloseMenu'>
                        <div onClick={()=>setShowHMenuOptions(false)} className='hMenuOptionsContainer__btnCloseMenu__btn'>X</div>
                    </div>
                    <Link to={`/cpanel/products`} onClick={()=>setShowHMenuOptions(false)} className='hMenuOptionsContainer__option'>- Productos</Link>
                </div>
            }

            {
                showCategories &&
                <div className='categoriesContainer'>
                    <div className='categoriesContainer__btnCloseMenu'>
                        <div onClick={()=>setShowCategories(false)} className='categoriesContainer__btnCloseMenu__btn'>X</div>
                    </div>
                    <Link to={`/category/${'bodies'}`} onClick={()=>setShowCategories(false)} className='categoriesContainer__category'>- BODIES</Link>
                    <Link to={`/category/${'shorts'}`} onClick={()=>setShowCategories(false)} className='categoriesContainer__category'>- SHORTS</Link>
                    <Link to={`/category/${'tops'}`} onClick={()=>setShowCategories(false)} className='categoriesContainer__category'>- TOPS</Link>
                    <Link to={`/category/${'vestidos'}`} onClick={()=>setShowCategories(false)} className='categoriesContainer__category'>- VESTIDOS</Link>
                    <Link to={`/category/${'polleras'}`} onClick={()=>setShowCategories(false)} className='categoriesContainer__category'>- POLLERAS</Link>
                    <Link to={`/category/${'cintos'}`} onClick={()=>setShowCategories(false)} className='categoriesContainer__category'>- CINTOS</Link>
                </div>
            }

        </>

    )
}

export default NavBar