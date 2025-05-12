import {useContext,useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import Spinner from './Spinner';
import { toast } from 'react-toastify';

const NavBar = ({userCart,isLoggedIn,categories,isLoading,role,first_name,cookieValue,fetchUser,setShowLogOutContainer,showLogOutContainer}) => {
    const [quantity, setQuantity] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!userCart || !Array.isArray(userCart.products)) {
                setQuantity(0);
                setIsLoadingUser(false);
            }
        }, 1000);
        if (Array.isArray(userCart.products)) {
            const totalCount = userCart.products.reduce((sum, p) => sum + p.quantity, 0);
            setQuantity(totalCount);
            setIsLoadingUser(false);
            clearTimeout(timeout); // Cancela el timeout si ya tenemos info
        }
        return () => clearTimeout(timeout); // Limpieza por si desmonta
    }, [userCart]);

    const [showHMenuOptions, setShowHMenuOptions] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };
        
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
                            /* isLoading && (role == 'admin') ? */
                            isLoading ?
                            <Spinner/>
                            :
                            /* role == 'admin' && showLogOutContainer && */
                            showLogOutContainer &&
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
                                {
                                    isLoadingUser || quantity === null ?
                                        <Spinner />
                                    :
                                    <div className='header__rightMenu__menu__cart__number__prop'>
                                        {
                                            !isLoggedIn || isLoggedIn === undefined ?
                                                0
                                            : 
                                                quantity
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        {
                            isLoading ?
                            <div className='header__rightMenu__menu__spinner'>
                                <Spinner/>
                            </div>
                            : isLoggedIn ?
                            <>
                                <div className='header__rightMenu__menu__name'>BIENVENIDO/A<br />{first_name?capitalizeFirstLetter(first_name):''}</div>
                            </>
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
                    {
                        role == 'admin' ?
                        <>
                            <Link to={`/cpanel/products`} onClick={()=>setShowHMenuOptions(false)} className='hMenuOptionsContainer__option'>- Productos</Link>
                            <Link to={`/cpanel`} onClick={()=>setShowHMenuOptions(false)} className='hMenuOptionsContainer__option'>- Panel de control</Link>
                            <Link to={`/tickets`} onClick={()=>setShowHMenuOptions(false)} className='hMenuOptionsContainer__option'>- Ventas</Link>
                        </>
                        :
                        <Link to={`/myPurchases`} onClick={()=>setShowHMenuOptions(false)} className='hMenuOptionsContainer__option'>- Mis compras</Link>
                    }
                </div>
            }

            {
                showCategories && (
                    <div className='categoriesContainer'>
                    <div className='categoriesContainer__btnCloseMenu'>
                        <div
                        onClick={() => setShowCategories(false)}
                        className='categoriesContainer__btnCloseMenu__btn'
                        >
                        X
                        </div>
                    </div>

                        {categories && categories.length > 0 ? (
                            categories.map((category) => (
                            <Link
                                key={category._id}
                                to={`/category/${category.name.toLowerCase()}`}
                                onClick={() => setShowCategories(false)}
                                className="categoriesContainer__category"
                            >
                                - {category.name.toUpperCase()}
                            </Link>
                            ))
                        ) : (
                            <>
                                <p className="categoriesContainer__category">Aún no hay categorías</p>
                                <Link
                                    to={`/cpanel`}
                                    className="categoriesContainer__addCategoryLink"
                                    >
                                    Agregar categoría
                                </Link>
                            </>
                        
                        )}

                    </div>
                )
            }

        </>

    )
}

export default NavBar