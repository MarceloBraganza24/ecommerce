import {useContext,useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import Spinner from './Spinner';
import { toast } from 'react-toastify';

const NavBar = ({userCart,isLoggedIn,categories,isLoading,role,cookieValue,fetchUser}) => {
    const [showHMenuOptions, setShowHMenuOptions] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    let totalQuantity;
    if(isLoggedIn) {
        totalQuantity = (userCart.products && Array.isArray(userCart.products)) ? userCart.products.reduce((sum, producto) => sum + producto.quantity, 0) : 0;
    } else {
        totalQuantity = 0
    }
        
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

    const handleBtnLogOut = async () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        const last_connection = currentDate;
        const response = await fetch(`http://localhost:8081/api/sessions/logout?cookie=${cookieValue}`, {
            method: 'POST',         
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ last_connection })
        })
        const data = await response.json();
        if(response.ok) {
            const expirationDate = new Date(0);
            const cookieJWT = `TokenJWT=${cookieValue}; expires=${expirationDate.toUTCString()}`;
            document.cookie = cookieJWT;
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
            fetchUser(cookieValue)
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
                            <Spinner/>
                            :
                            role == 'admin' &&
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
                                    
                                    {isLoading? (
                                        <Spinner />
                                    ) : (
                                        <div className='header__rightMenu__menu__cart__number__prop'>
                                            {totalQuantity || 0}
                                        </div>
                                    )}
                            </div>

                        </div>
                        {
                            isLoading ?
                            <div className='header__rightMenu__menu__spinner'>
                                <Spinner/>
                            </div>
                            : isLoggedIn ?
                            <>
                                {/* <Link to={"/logIn"} className='header__rightMenu__menu__item'>
                                    LOG OUT
                                    </Link> */}
                                <div onClick={handleBtnLogOut} className='header__rightMenu__menu__item'>LOG OUT</div>
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
                    <Link to={`/cpanel/products`} onClick={()=>setShowHMenuOptions(false)} className='hMenuOptionsContainer__option'>- Productos</Link>
                    <Link to={`/cpanel`} onClick={()=>setShowHMenuOptions(false)} className='hMenuOptionsContainer__option'>- Panel de control</Link>
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
                                    {/* - {category.name.toUpperCase()} */}
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