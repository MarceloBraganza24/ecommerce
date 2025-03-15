import React from 'react'
import { Link } from 'react-router-dom'

const PurchaseCompleted = () => {

    return (

        <>

            <div className='headerPurchase'>
                            
                <Link to={"/"} className='headerPurchase__logo'>
                    <img className='headerPurchase__logo__prop' src="/src/assets/logo_ecommerce_h.png" alt="logo" />
                </Link>
                
            </div>        

            <div className='purchaseCompletedContainer'>

                <div className='purchaseCompletedContainer__msj'>Felicidades!</div>
                <div className='purchaseCompletedContainer__msj'>Has completado tu compra exitosamente!</div>
                <Link to={"/#catalog"} className='purchaseCompletedContainer__goCatalog'>
                    Seguir comprando!
                </Link>

            </div>
        
        </>

    )

}

export default PurchaseCompleted