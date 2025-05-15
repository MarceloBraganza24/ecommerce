import React from 'react'
import { Link } from 'react-router-dom'

const Footer = ({sellerAddresses,isLoadingSellerAddresses}) => {

    return (

        <>
        
            <div className='footerContainer'>

                <div className='footerContainer__logoPhraseContainer'>

                    <div className='footerContainer__logoPhraseContainer__logoPhrase'>

                        <div className='footerContainer__logoPhraseContainer__logoPhrase__logo'>
                            <img className='footerContainer__logoPhraseContainer__logoPhrase__logo__prop' src="/src/assets/logo_ecommerce_h.png" alt="logo" />
                        </div>

                        <div className='footerContainer__logoPhraseContainer__logoPhrase__phrase'>
                            <div className="footerContainer__logoPhraseContainer__logoPhrase__phrase__prop">"En nuestra tienda de ropa, cada prenda cuenta una historia de estilo, calidad y autenticidad, diseñada para quienes buscan expresar su personalidad con confianza y elegancia"</div>
                        </div>

                    </div>

                </div>

                <div className='footerContainer__faqContainer'>
                    
                    <div className='footerContainer__faqContainer__faq'>

                        <div className='footerContainer__faqContainer__faq__title'>Enlaces</div>
                        <Link to={"/#catalog"} className='footerContainer__faqContainer__faq__links'>
                            - Catálogo
                        </Link>
                        <Link to={"/about"} className='footerContainer__faqContainer__faq__links'>
                            - Sobre nosotros
                        </Link>
                        <Link to={"/contact"} className='footerContainer__faqContainer__faq__links'>
                            - Contacto
                        </Link>
                        <Link to={"/cart"} className='footerContainer__faqContainer__faq__links'>
                            - Carrito de compras
                        </Link>
                        <Link to={"/logIn"} className='footerContainer__faqContainer__faq__links'>
                            - Log In
                        </Link>

                    </div>

                </div>

                <div className='footerContainer__contactContainer'>

                    <div className='footerContainer__contactContainer__contact'>

                        <div className='footerContainer__contactContainer__contact__title'>
                            <div className='footerContainer__contactContainer__contact__title__prop'>Encuentranos</div>
                        </div>

                        <div className='footerContainer__contactContainer__contact__contactProps'>

                            {sellerAddresses.map((address) => (
                                <div className='footerContainer__contactContainer__contact__contactProps__prop'>
                                    - {address.street} {address.street_number}, {address.locality}, {address.province}
                                </div>
                            ))}

                            <div className='footerContainer__contactContainer__contact__contactProps__prop'>Teléfono: +54 9 2926 450236</div>
                            <div className='footerContainer__contactContainer__contact__contactProps__prop'>ecommerce@gmail.com</div>

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}

export default Footer