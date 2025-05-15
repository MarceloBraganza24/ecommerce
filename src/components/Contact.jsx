import {useEffect,useState,useContext} from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import { toast } from 'react-toastify';

const Contact = () => {
    const [user, setUser] = useState('');
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userCart, setUserCart] = useState({});
    const [cookieValue, setCookieValue] = useState('');
    const [showLogOutContainer, setShowLogOutContainer] = useState(false);

    useEffect(() => {
        if(user.isLoggedIn) {
            setShowLogOutContainer(true)
        }
    }, [user.isLoggedIn]);

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

    useEffect(() => {
        fetchCurrentUser();
        fetchCategories();
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
                />
            </div>
            <div className="contactContainer">

                <div className='contactContainer__title'>
                    <div className='contactContainer__title__prop'>Contacto</div>
                </div>

                <div className='contactContainer__formMap'>

                    <div className='contactContainer__formMap__formContainer'>

                        <div className='contactContainer__formMap__formContainer__form'>

                            <div className='contactContainer__formMap__formContainer__form__prop'>

                                <div className='contactContainer__formMap__formContainer__form__prop__title'>
                                    <div className='contactContainer__formMap__formContainer__form__prop__title__prop'>Dejanos tu consulta aquí!</div>
                                </div>

                                <div className='contactContainer__formMap__formContainer__form__prop__input'>
                                    <input className='contactContainer__formMap__formContainer__form__prop__input__prop' type="text" placeholder='Nombre' />
                                </div>

                                <div className='contactContainer__formMap__formContainer__form__prop__input'>
                                    <input className='contactContainer__formMap__formContainer__form__prop__input__prop' type="text" placeholder='Apellido' />
                                </div>

                                <div className='contactContainer__formMap__formContainer__form__prop__input'>
                                    <input className='contactContainer__formMap__formContainer__form__prop__input__prop' type="email" placeholder='Email' />
                                </div>

                                <div className='contactContainer__formMap__formContainer__form__prop__input'>
                                    <textarea className='contactContainer__formMap__formContainer__form__prop__input__textArea' name="" id="" placeholder='Mensaje'></textarea>
                                </div>

                                <div className='contactContainer__formMap__formContainer__form__prop__btn'>
                                    <button className='contactContainer__formMap__formContainer__form__prop__btn__prop'>Enviar</button>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className='contactContainer__formMap__mapContainer'>

                        <div className='contactContainer__formMap__mapContainer__map'>

                            <iframe className='contactContainer__formMap__mapContainer__map__prop' src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d665.8232192035489!2d-61.94095405891255!3d-37.45583802619878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1740503041554!5m2!1ses-419!2sar" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

                            <div className='contactContainer__formMap__mapContainer__map__address'>Mitre 1303, Coronel Suárez, Pcia de Buenos Aires</div>

                        </div>

                    </div>

                </div>

            </div>

            <Footer/>

        </>

    )

}

export default Contact