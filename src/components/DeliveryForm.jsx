import React, { useState,useEffect,useRef,useContext  } from 'react';
import {GoogleMap, useJsApiLoader, StandaloneSearchBox} from '@react-google-maps/api'
import NavBar from './NavBar'
import DeliveryAddress from './DeliveryAddress'
import Footer from './Footer'
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

const DeliveryForm = () => {
    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const inputRef = useRef(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCypLLA0vWKs_lvw5zxCuGJC28iEm9Rqk8',
        libraries:["places"]
    })
    const [street, setStreet] = useState('')
    const [streetNumber, setStreetNumber] = useState('')
    const [locality, setLocality] = useState('')
    const [province, setProvince] = useState('')
    const [country, setCountry] = useState('')
    const [dpto, setDpto] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [indications, setIndications] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    //console.log(isLoaded)

    const handleOnPlacesChanged = () => {
        let address = inputRef.current.getPlaces()
        const desglocedAddress = address.map(dm => dm.address_components)
        const prop = desglocedAddress[0]
        const street = prop.find(dm => dm.types[0] == "route")
        const street_number = prop.find(dm => dm.types[0] == "street_number")
        const locality = prop.find(dm => dm.types[0] == "locality")
        const province = prop.find(dm => dm.types[0] == "administrative_area_level_1")
        const postal_code = prop.find(dm => dm.types[0] == "postal_code")
        const country = prop.find(dm => dm.types[0] == "country")
        setStreet(street.long_name)
        setStreetNumber(street_number.long_name)
        setLocality(locality.long_name)
        setProvince(province.long_name)
        setCountry(country.long_name)
        setPostalCode(postal_code.long_name)
        // console.log('Calle: ',street.long_name,street_number.long_name)
        // console.log('Ciudad: ',locality.long_name)
        // console.log('Provincia: ',province.long_name)
        // console.log('Pais: ',country.long_name)
        // console.log('Código postal: ',postal_code.long_name)
    }

    const hanldeInputStreet = (e) => {
        setStreet(e.target.value)
    }

    const hanldeInputStreetNumber = (e) => {
        setStreetNumber(e.target.value)
    }
    
    const hanldeInputLocality = (e) => {
        setLocality(e.target.value)
    }
    
    const hanldeInputProvince = (e) => {
        setProvince(e.target.value)
    }
    
    const hanldeInputCountry = (e) => {
        setCountry(e.target.value)
    }
    
    const hanldeInputPostalCode = (e) => {
        setPostalCode(e.target.value)
    }

    const hanldeInputDpto = (e) => {
        setDpto(e.target.value)
    }
    
    const hanldeInputIndications = (e) => {
        setIndications(e.target.value)
    }

    const hanldeInputName = (e) => {
        setName(e.target.value)
    }

    const hanldeInputPhone = (e) => {
        setPhone(e.target.value)
    }

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
                    setIsLoading(false)
                }
                }
            } catch (error) {
                console.error('Error:', error);
            }
            };
        fetchUser();
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
                <NavBar isLoading={isLoading} isLoggedIn={user.isLoggedIn}/>
            </div>
            <DeliveryAddress/>

            <div className='deliveryFormContainer'>

                <div className='deliveryFormContainer__deliveryForm'>

                    <div className='deliveryFormContainer__deliveryForm__title'>
                        <div className='deliveryFormContainer__deliveryForm__title__prop'>Formulario de entrega</div>
                    </div>
                    <div className='deliveryFormContainer__deliveryForm__labelInputLoadStreet'>
                        <div className='deliveryFormContainer__deliveryForm__labelInputLoadStreet__prop'>Busca tu dirección aquí!</div>
                    </div>

                    {
                        isLoaded && 
                        <StandaloneSearchBox onLoad={(ref) => inputRef.current = ref} onPlacesChanged={handleOnPlacesChanged}>
                            

                            <input className='deliveryFormContainer__deliveryForm__inputStreet' type="text" placeholder='Dirección' />
            
                        </StandaloneSearchBox>
                    }

                    <div className='deliveryFormContainer__deliveryForm__gridLabelInput'>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Calle:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={street} onChange={hanldeInputStreet} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' type="text" placeholder='Calle' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Número:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={streetNumber} onChange={hanldeInputStreetNumber} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' type="text" placeholder='Número' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Localidad:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={locality} onChange={hanldeInputLocality} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' type="text" placeholder='Localidad' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Provincia:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={province} onChange={hanldeInputProvince} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' type="text" placeholder='Provincia' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>País:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={country} onChange={hanldeInputCountry} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' type="text" placeholder='País' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Código postal:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={postalCode} onChange={hanldeInputPostalCode} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' type="text" placeholder='Código postal' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Departamento (opcional):</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={dpto} onChange={hanldeInputDpto} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' type="text" placeholder='Departamento' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Indicaciones (opcional):</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <textarea className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__textArea' placeholder='Mensaje' name="" id=""></textarea>
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__labelContactData'>Datos de contacto</div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'></div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Nombre:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={name} onChange={hanldeInputName} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' type="text" placeholder='Nombre' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Teléfono:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={phone} onChange={hanldeInputPhone} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' type="text" placeholder='Teléfono' />
                            </div>
                        </div>
                        
                    </div>

                    <div className='deliveryFormContainer__deliveryForm__btnContainer'>
                        <button className='deliveryFormContainer__deliveryForm__btnContainer__btn'>Guardar</button>
                    </div>

                </div>

            </div>
        
            <Footer/>

        </>

    )

}

export default DeliveryForm