import {useEffect} from 'react'
import NavBar from './NavBar'
import Footer from './Footer'

const Contact = () => {

    useEffect(() => {
            window.scrollTo(0, 0);
    }, []);

    return (

        <>

            <div className='navbarContainer'>
                <NavBar/>
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