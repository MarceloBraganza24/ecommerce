import React from 'react';
import { Link } from 'react-router-dom';

const DeliveryAddress = () => {

    return (

        <>
            <div className='deliveryAddressContainer'>

                <div className='deliveryAddressContainer__label'>Enviar a:</div>
                <div className='deliveryAddressContainer__address'>Avellaneda 339, Coronel Suárez</div>
                <Link to={"/deliveryForm"} className='deliveryAddressContainer__btnEdit'>
                    Editar
                </Link>
            </div>
        </>

    )

}

export default DeliveryAddress



