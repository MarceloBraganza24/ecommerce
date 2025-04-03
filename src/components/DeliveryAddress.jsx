import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';

const DeliveryAddress = ({deliveryAddressFormData,isLoadingDeliveryForm}) => {
    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (

        <>
            <div className='deliveryAddressContainer'>

                <div className='deliveryAddressContainer__label'>Enviar a:</div>
                {
                    isLoadingDeliveryForm ? 
                        <>
                            <div className="deliveryAddressContainer__spinner">
                                <Spinner/>
                            </div>
                        </>
                    :
                    deliveryAddressFormData.street ?
                    <div className='deliveryAddressContainer__address'>{capitalizeWords(deliveryAddressFormData.street)} {capitalizeWords(deliveryAddressFormData.street_number)}, {deliveryAddressFormData.locality}</div>
                    :
                    <Link to={"/deliveryForm"} className='deliveryAddressContainer__address'>
                        agregar dirección
                    </Link>
                }
                <Link to={"/deliveryForm"} className='deliveryAddressContainer__btnEdit'>
                    Editar
                </Link>
            </div>
        </>

    )

}

export default DeliveryAddress



