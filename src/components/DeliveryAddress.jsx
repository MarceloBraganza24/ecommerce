import React, { useState,useEffect  } from 'react';
import axios from 'axios';


const DeliveryAddress = () => {
    const [showDeliveryAddressModal, setShowDeliveryAddressModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const DeliveryAddressModal = ({ isOpen, onClose }) => {

        return (
    
            <>
                {/* <div className='deliveryAddressContainerModal'>
    
                    <div className='deliveryAddressContainerModal__deliveryAddressContainer'>
                        
                        <div className="deliveryAddressContainerModal__deliveryAddressContainer__btnCloseModal">
                            <div onClick={() => {setShowDeliveryAddressModal(false)}} className="deliveryAddressContainerModal__deliveryAddressContainer__btnCloseModal__prop">X</div>
                        </div>
    
                        <div className='deliveryAddressContainerModal__deliveryAddressContainer__title'>
    
                            <div className='deliveryAddressContainerModal__deliveryAddressContainer__title__prop'>Datos para la entrega</div>
    
                        </div>
                        
                        <div className="deliveryAddressContainerModal__deliveryAddressContainer__input">
                            <input placeholder='' type="text" className='deliveryAddressContainerModal__deliveryAddressContainer__input__prop' />
                        </div>
    
                    </div>
    
                </div> */}

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
                {/* <button onClick={() => {setShowDeliveryAddressModal(true)}} className='deliveryAddressContainer__btnEdit'>Editar</button> */}
                <button className="modal__button" onClick={() => setIsOpen(true)}>Editar</button>

            </div>
            {isOpen && <DeliveryAddressModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
            {/* {
              showDeliveryAddressModal &&
              <DeliveryAddressModal/>
            } */}
        </>

    )

}

export default DeliveryAddress

