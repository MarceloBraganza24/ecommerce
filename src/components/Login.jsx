import {useEffect,useState,useContext} from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import { Link,useNavigate } from 'react-router-dom';
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const {login} = useContext(IsLoggedContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const validateForm = () => {
        const { email, password } = credentials;
    
        if (!email.trim() || !password.trim()) {
            toast('Debes completar todos los campos!', {
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
            return false;
        }
    
        return true;
    };

    const handleSubmit = async (e) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        const last_connection = currentDate;

        e.preventDefault();
        if (!validateForm()) return;
        const formData = new FormData();
        formData.append('email', credentials.email);
        formData.append('password', credentials.password);
        formData.append('last_connection', last_connection);
    
    
        try {
            const response = await fetch(`http://localhost:8081/api/sessions/login`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                    last_connection: last_connection
                })
            })
            const data = await response.json();
            if (response.ok) {
                const tokenJWT = data.data;
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 1);
                const cookieJWT = `TokenJWT=${tokenJWT}; expires=${expirationDate.toUTCString()}`;
                document.cookie = cookieJWT;
                navigate("/");
                toast('Bienvenido, has iniciado sesion con éxito!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    className: "custom-toast",
                });
                login();
            }
            if(data.error === 'incorrect credentials') {
                toast('Alguno de los datos ingresados es incorrecto. Inténtalo nuevamente!', {
                    position: "top-right",
                    autoClose: 2500,
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
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (

        <>
            {/* <div className='navbarContainer'>
                <NavBar/>
            </div> */}

            <div className='loginContainer'>

                <div className='loginContainer__formContainer'>

                    <div className='loginContainer__formContainer__form'>

                        <div className='loginContainer__formContainer__form__title'>
                            <div className='loginContainer__formContainer__form__title__prop'>Inicio de sesión</div>
                        </div>

                        <div className='loginContainer__formContainer__form__input'>
                            <input className='loginContainer__formContainer__form__input__prop' type="text" value={credentials.email} onChange={handleChange} placeholder='Email' name="email" id="" />
                        </div>

                        <div className='loginContainer__formContainer__form__input'>
                            <input className='loginContainer__formContainer__form__input__prop' type="password" value={credentials.password} onChange={handleChange} placeholder='Contraseña' name="password" id="" />
                        </div>

                        <div className='loginContainer__formContainer__form__btn'>
                            <button onClick={handleSubmit} className='loginContainer__formContainer__form__btn__prop'>Iniciar sesión</button>
                            <Link to={"/signIn"} className='loginContainer__formContainer__form__btn__prop'>
                                Registrarse
                            </Link>
                        </div>

                    </div>

                </div>

                <div className='loginContainer__logoContainer'>

                    <div className='loginContainer__logoContainer__title'>
                        <div className='loginContainer__logoContainer__title__prop'>Bienvenidos/as a Ecommerce</div>
                    </div>

                    <div className='loginContainer__logoContainer__logo'>
                        <img className='loginContainer__logoContainer__logo__prop' src="/src/assets/logo_ecommerce_h_500x500.png" alt="logo" />
                    </div>  

                    <div className='loginContainer__logoContainer__phrase'>
                        <div className='loginContainer__logoContainer__phrase__prop'>"Ingresa a tu cuenta y disfruta de una experiencia única con nuestros productos especialmente para ti."</div>
                    </div>

                </div>  

            </div>  

            {/* <Footer/> */}

        </>

    )

}

export default Login