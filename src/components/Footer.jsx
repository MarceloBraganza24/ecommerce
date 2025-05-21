import React from 'react'
import { Link } from 'react-router-dom'

const Footer = ({sellerAddresses,isLoadingSellerAddresses,logo_store,aboutText,phoneNumbers,contactEmail}) => {

    return (

        <>
        
            <div className='footerContainer'>

                <div className='footerContainer__logoPhraseContainer'>

                    <div className='footerContainer__logoPhraseContainer__logoPhrase'>

                        {/* <div className='footerContainer__logoPhraseContainer__logoPhrase__logo'>
                            <img className='footerContainer__logoPhraseContainer__logoPhrase__logo__prop' src="/src/assets/logo_ecommerce_h.png" alt="logo_tienda" />
                        </div> */}
                        <Link to={"/"} className='footerContainer__logoPhraseContainer__logoPhrase__logo'>
                            {logo_store ? (
                                <img
                                className='footerContainer__logoPhraseContainer__logoPhrase__logo__prop'
                                src={`http://localhost:8081/${logo_store}`}
                                alt="logo_tienda"
                                />
                            ) : null}
                        </Link>

                        <div className='footerContainer__logoPhraseContainer__logoPhrase__phrase'>
                            <div className="footerContainer__logoPhraseContainer__logoPhrase__phrase__prop">{aboutText}</div>
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

                            <div className='footerContainer__contactContainer__contact__contactProps__prop' style={{marginTop:'1vh'}}>Teléfonos</div>

                            {phoneNumbers?.map((phone, index) => (
                            <div
                                key={index}
                                className="footerContainer__contactContainer__contact__contactProps__prop"
                            >
                                - {phone}
                            </div>
                            ))}

                            <div className='footerContainer__contactContainer__contact__contactProps__prop' style={{marginTop:'1vh'}}>Correos electrónicos de contacto</div>

                            {contactEmail?.map(({ email, label, _id }) => (
                                <div key={_id} className="footerContainer__contactContainer__contact__contactProps__prop">
                                    - 📧 {label}: {email}
                                </div>
                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}

export default Footer