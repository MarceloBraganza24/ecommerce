import {useContext,useState,useEffect} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import { Link } from 'react-router-dom'

const NavBar = () => {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const {qtyProducts} = useContext(CartContext)

    const handleBtnShowCategories = () => {
        if(mostrarMenu) {
            setMostrarMenu(false)
        } else {
            setMostrarMenu(true)
        }
    }

    useEffect(() => {
        const handleScroll = () => setMostrarMenu(false);
        window.addEventListener("scroll", handleScroll);
    
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (

        <>
            <div className='header'>

                <div className='header__logo-menu'>

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
                                <div className='header__rightMenu__menu__cart__number__prop'>{qtyProducts}</div>
                            </div>

                        </div>

                        <Link to={"/logIn"} className='header__rightMenu__menu__item'>
                            LOG IN
                        </Link>

                    </div>

                </div>
                
            </div>   

            {
                mostrarMenu &&
                <div className='categoriesContainer'>
                    <div className='categoriesContainer__btnCloseMenu'>
                        <div onClick={()=>setMostrarMenu(false)} className='categoriesContainer__btnCloseMenu__btn'>X</div>
                    </div>
                    <Link to={`/category/${'bodies'}`} onClick={()=>setMostrarMenu(false)} className='categoriesContainer__category'>- BODIES</Link>
                    <Link to={`/category/${'shorts'}`} onClick={()=>setMostrarMenu(false)} className='categoriesContainer__category'>- SHORTS</Link>
                    <Link to={`/category/${'tops'}`} onClick={()=>setMostrarMenu(false)} className='categoriesContainer__category'>- TOPS</Link>
                    <Link to={`/category/${'vestidos'}`} onClick={()=>setMostrarMenu(false)} className='categoriesContainer__category'>- VESTIDOS</Link>
                    <Link to={`/category/${'polleras'}`} onClick={()=>setMostrarMenu(false)} className='categoriesContainer__category'>- POLLERAS</Link>
                    <Link to={`/category/${'cintos'}`} onClick={()=>setMostrarMenu(false)} className='categoriesContainer__category'>- CINTOS</Link>
                </div>
            }

        </>

    )
}

export default NavBar