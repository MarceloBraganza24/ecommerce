import {useEffect,useState,useContext} from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const [storeSettings, setStoreSettings] = useState({});
    const [isLoadingStoreSettings, setIsLoadingStoreSettings] = useState(true);
    //console.log(storeSettings.siteImages.logoStore)
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const fetchStoreSettings = async () => {
        try {
            setIsLoadingStoreSettings(true)
            const response = await fetch('http://localhost:8081/api/settings');
            const data = await response.json();
            //console.log(data)
            if (response.ok) {
                setStoreSettings(data); 
            } else {
                toast('Error al cargar configuraciones', {
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
            setIsLoadingStoreSettings(false)
        }
    };

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

        e.preventDefault();
        if (!validateForm()) return;
    
    
        try {
            const response = await fetch(`http://localhost:8081/api/sessions/login`, {
                method: 'POST',         
                credentials: 'include', // 👈 necesario para recibir cookies
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                })
            })
            const data = await response.json();
            if (response.ok) {
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
        fetchStoreSettings()
        window.scrollTo(0, 0);
    }, []);

    function esColorClaro(hex) {
        if (!hex) return true;

        hex = hex.replace("#", "");
        if (hex.length === 3) {
            // Soporte para formato corto (#abc)
            hex = hex.split('').map(char => char + char).join('');
        }

        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
        return luminancia > 186;
    }


    const colorFondo = storeSettings?.primaryColor || '#ffffff';
    const textoEsNegro = esColorClaro(colorFondo);
    const colorTexto = textoEsNegro ? '#000000' : '#ffffff';


    return (

        <>

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
                            {/* <button onClick={handleSubmit} className='loginContainer__formContainer__form__btn__prop'>Iniciar sesión</button> */}
                            <button onClick={handleSubmit} className={textoEsNegro ? 'loginContainer__formContainer__form__btn__dark' : 'loginContainer__formContainer__form__btn__white'}>Iniciar sesión</button>
                            <Link to={"/signIn"} className={textoEsNegro ? 'loginContainer__formContainer__form__btn__dark' : 'loginContainer__formContainer__form__btn__white'}>
                                Registrarse
                            </Link> 
                        </div>

                    </div>

                </div>

                <div className='loginContainer__logoContainer'>

                    <div className='loginContainer__logoContainer__title'>
                        {/* <div className='loginContainer__logoContainer__title__prop'>Bienvenidos/as a "{storeSettings?.storeName}"</div> */}
                        <div className={textoEsNegro ? 'loginContainer__logoContainer__title__dark' : 'loginContainer__logoContainer__title__white'}>Bienvenidos/as a "{storeSettings?.storeName}"</div>
                    </div>

                    <div className='loginContainer__logoContainer__logo'>
                        {storeSettings?.siteImages?.logoStore &&
                            <img
                            className='loginContainer__logoContainer__logo__prop'
                            src={`http://localhost:8081/${storeSettings?.siteImages?.logoStore}`}
                            alt="logo_tienda"
                            />
                        }
                    </div>  

                    <div className='loginContainer__logoContainer__phrase'>
                        {/* <div className='loginContainer__logoContainer__phrase__prop'>"Ingresa a tu cuenta y disfruta de una experiencia única con nuestros productos especialmente para ti"</div> */}
                        <div className={textoEsNegro ? 'loginContainer__logoContainer__phrase__dark' : 'loginContainer__logoContainer__phrase__white'}>"Ingresa a tu cuenta y disfruta de una experiencia única con nuestros productos especialmente para ti"</div>
                    </div>

                </div>  

            </div>  

        </>

    )

}

export default Login