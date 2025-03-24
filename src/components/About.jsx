import {useEffect,useState,useContext} from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'


const About = () => {
    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
        fetchCategories();
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
                isLoggedIn={user.isLoggedIn}
                role={user.role}
                categories={categories}
                />
            </div>
            <div className="aboutContainer">

                <div className="aboutContainer__phraseContainer">
                    <div className="aboutContainer__phraseContainer__phrase">"En Ecommerce, creemos que la moda es más que solo ropa: es una forma de expresión, una declaración de estilo y una herramienta para sentirte seguro y auténtico en cada momento de tu vida. Nos apasiona ofrecerte prendas cuidadosamente seleccionadas que combinan calidad, comodidad y las últimas tendencias, para que puedas armar looks únicos y reflejar tu personalidad sin esfuerzo. Trabajamos con materiales de primera y un equipo comprometido en brindarte una experiencia de compra fácil, segura y emocionante. Porque sabemos que la moda no solo se viste, sino que se vive. ¡Bienvenido a nuestra comunidad!"</div>
                </div>
            </div>

            <Footer/>

        </>

    )

}

export default About