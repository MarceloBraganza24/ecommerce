/* import React, { useState,useEffect  } from 'react';
import axios from 'axios';


const DeliveryAddress = () => {
    const [showDeliveryAddressModal, setShowDeliveryAddressModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const DeliveryAddressModal = ({ isOpen, onClose }) => {

        return (
    
            <>
                <div className={`modal__container ${isOpen ? "modal__container--show" : ""}`}>
                    <h2 className="modal__title">Modal Animado</h2>
                    <p className="modal__content">Este es un modal con BEM en SCSS.</p>
                    <button className="modal__button" onClick={onClose}>Cerrar</button>
                </div>
            </>
    
        )
    
    }
    
    return (

        <>
            <div className='deliveryAddressContainer'>

                <div className='deliveryAddressContainer__label'>Enviar a:</div>
                <div className='deliveryAddressContainer__address'>Avellaneda 339, Coronel Suárez</div>
                <button className="modal__button" onClick={() => setIsOpen(true)}>Editar</button>

            </div>
            {isOpen && <DeliveryAddressModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
        </>

    )

}

export default DeliveryAddress */

import React, { useState,useEffect,useRef  } from 'react';
import {GoogleMap, useJsApiLoader, StandaloneSearchBox} from '@react-google-maps/api'

const DeliveryAddress = () => {
    const [showDeliveryAddressModal, setShowDeliveryAddressModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCypLLA0vWKs_lvw5zxCuGJC28iEm9Rqk8',
        libraries:["places"]
    })
    const [street, setStreet] = useState('');
    const [street_number, setStreet_number] = useState('');
    const [locality, setLocality] = useState('');
    const [province, setProvince] = useState('');
    const [country, setCountry] = useState('');
    const [postal_code, setPostal_code] = useState('');
    
    const handleOnPlacesChanged = () => {
        let address = inputRef.current.getPlaces()
        const desglocedAddress = address.map(dm => dm.address_components)
        const prop = desglocedAddress[0]
        const street_number = prop.find(dm => dm.types[0] == "street_number")
        const street = prop.find(dm => dm.types[0] == "route")
        const locality = prop.find(dm => dm.types[0] == "locality")
        const province = prop.find(dm => dm.types[0] == "administrative_area_level_1")
        const postal_code = prop.find(dm => dm.types[0] == "postal_code")
        const country = prop.find(dm => dm.types[0] == "country")
        setStreet(street.long_name)
        setStreet_number(street_number.long_name)
        setProvince(province.long_name)
        setCountry(country.long_name)
        setPostal_code(postal_code.long_name)
        setLocality(locality.long_name)
    }

    const DeliveryAddressModal = ({ isOpen, onClose }) => {

        return (
    
            <>
                <div className='modal'>

                    <div className={`modal__container ${isOpen ? "modal__container--show" : ""}`}>
                        <h2 className="modal__title">Ingrese su dirección</h2>
                        {
                            isLoaded && 
                            <StandaloneSearchBox onLoad={(ref) => inputRef.current = ref} onPlacesChanged={handleOnPlacesChanged}>
                
                                <input className='modal__inputSearchLocation' type="text" placeholder='Dirección' />
                
                            </StandaloneSearchBox>
                        }
                        <div className='modal__propLocation'>
                            <h4>Calle:</h4>
                            <input className='modal__propLocation__input' type="text" placeholder='Calle' value={street+' '+street_number} />
                        </div>
                        <div className='modal__propLocation'>
                            <h4>Localidad:</h4>
                            <input className='modal__propLocation__input' type="text" placeholder='Localidad' value={locality} />
                        </div>
                        <div className='modal__propLocation'>
                            <h4>Provincia:</h4>
                            <input className='modal__propLocation__input' type="text" placeholder='Provincia' value={province} />
                        </div>
                        <div className='modal__propLocation'>
                            <h4>País:</h4>
                            <input className='modal__propLocation__input' type="text" placeholder='País' value={country} />
                        </div>
                        <div className='modal__propLocation'>
                            <h4>Código postal:</h4>
                            <input className='modal__propLocation__input' type="text" placeholder='Código postal' value={postal_code}/>
                        </div>
                        {/* <div className='modal__propLocation'>
                            <h4>Calle:</h4>
                            <h4>{street} {street_number}</h4>
                        </div>
                        <div className='modal__propLocation'>
                            <h4>Localidad:</h4>
                            <h4>{locality}</h4>
                        </div>
                        <div className='modal__propLocation'>
                            <h4>Provincia:</h4>
                            <h4>{province}</h4>
                        </div>
                        <div className='modal__propLocation'>
                            <h4>País:</h4>
                            <h4>{country}</h4>
                        </div>
                        <div className='modal__propLocation'>
                            <h4>Código postal:</h4>
                            <h4>{postal_code}</h4>
                        </div> */}
                        <button className="modal__buttonModal" onClick={onClose}>Cerrar</button>
                    </div>

                </div>
            </>
    
        )
    
    }
    
    return (

        <>
            <div className='deliveryAddressContainer'>

                <div className='deliveryAddressContainer__label'>Enviar a:</div>
                <div className='deliveryAddressContainer__address'>Avellaneda 339, Coronel Suárez</div>
                <button className="modal__button" onClick={() => setIsOpen(true)}>Editar</button>

            </div>
            {isOpen && <DeliveryAddressModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
        </>

    )

}

export default DeliveryAddress



