import {useEffect} from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import { Link } from 'react-router-dom';

const SignIn = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (

        <>
            <div className='navbarContainer'>
                <NavBar/>
            </div>

            <div className='loginContainer'>

                <div className='loginContainer__formContainer'>

                    <div className='loginContainer__formContainer__form'>

                        <div className='loginContainer__formContainer__form__title'>
                            <div className='loginContainer__formContainer__form__title__prop'>Registro de usuario</div>
                        </div>

                        <div className='loginContainer__formContainer__form__input'>
                            <input className='loginContainer__formContainer__form__input__prop' type="text" placeholder='Nombre' name="" id="" />
                        </div>

                        <div className='loginContainer__formContainer__form__input'>
                            <input className='loginContainer__formContainer__form__input__prop' type="text" placeholder='Apellido' name="" id="" />
                        </div>

                        <div className='loginContainer__formContainer__form__input'>
                            <input className='loginContainer__formContainer__form__input__prop' type="text" placeholder='Email' name="" id="" />
                        </div>

                        <div className='loginContainer__formContainer__form__input'>
                            <input className='loginContainer__formContainer__form__input__prop' type="password" placeholder='Contraseña' name="" id="" />
                        </div>

                        <div className='loginContainer__formContainer__form__btn'>
                            <button className='loginContainer__formContainer__form__btn__prop'>Registrarse</button>
                            <Link to={"/logIn"} className='loginContainer__formContainer__form__btn__prop'>
                                Iniciar sesión
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

            <Footer/>

        </>

    )

}

export default SignIn