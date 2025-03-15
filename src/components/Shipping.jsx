import {useState,useContext} from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/ShoppingCartContext';

const Shipping = () => {
    const [metodoEntrega, setMetodoEntrega] = useState("domicilio");
    const {cart} = useContext(CartContext);

    const total = cart.reduce((acumulador, producto) => acumulador + (producto.price * producto.quantity), 0);
    const totalQuantity = cart.reduce((sum, producto) => sum + producto.quantity, 0);

    return (

        <>

            <div className='headerPurchase'>
                
                <Link to={"/"} className='headerPurchase__logo'>
                    <img className='headerPurchase__logo__prop' src="/src/assets/logo_ecommerce_h.png" alt="logo" />
                </Link>
                
            </div>

            <div className="shippingContainer">

                <div className="shippingContainer__deliveryMethodContainer">

                    <div className="shippingContainer__deliveryMethodContainer__title">
                        <div className="shippingContainer__deliveryMethodContainer__title__prop">Elegí la forma de entrega</div>
                    </div>

                    <div onClick={() => setMetodoEntrega("domicilio")} className="shippingContainer__deliveryMethodContainer__deliveryMethod">

                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid">

                            <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__radio">
                                <input type="radio" name="metodoEntrega" value='domicilio' checked={metodoEntrega === "domicilio"} onChange={(e) => setMetodoEntrega(e.target.value)} />
                            </div>

                            <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__option">Enviar a domicilio</div>

                            <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__state">$ 7500</div>

                        </div>

                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__addressContainer">
                            <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__addressContainer__address">Las Heras 1692, Coronel Suárez</div>
                        </div>

                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__editAddressContainer">
                            {/* <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__editAddressContainer__btn">Editar o elegir otro domicilio</div> */}
                            <Link to={"/deliveryForm"} className='shippingContainer__deliveryMethodContainer__deliveryMethod__editAddressContainer__btn'>
                                Editar o elegir otro domicilio
                            </Link>
                        </div>

                    </div>

                    <div onClick={() => setMetodoEntrega("vendedor")} className="shippingContainer__deliveryMethodContainer__deliveryMethod">

                        <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid">

                                <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__radio">
                                    <input type="radio" name="metodoEntrega" value='vendedor' checked={metodoEntrega === "vendedor"} onChange={(e) => setMetodoEntrega(e.target.value)} />
                                </div>

                                <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__option">Retirar en el domicilio del vendedor</div>

                                <div className="shippingContainer__deliveryMethodContainer__deliveryMethod__grid__state">Gratis</div>

                        </div>

                    </div>

                    <div className='shippingContainer__deliveryMethodContainer__btnContinue'>
                        <Link to={'/paymentForm'} className='shippingContainer__deliveryMethodContainer__btnContinue__prop'>
                            Continuar
                        </Link>
                    </div>

                </div>

                <div className="shippingContainer__accountSummaryContainer">

                    <div className="shippingContainer__accountSummaryContainer__accountSummary">

                        <div className="shippingContainer__accountSummaryContainer__accountSummary__title">

                            <div className="shippingContainer__accountSummaryContainer__accountSummary__title__prop">Resumen de compra</div>

                        </div>

                        <div className="shippingContainer__accountSummaryContainer__accountSummary__item">

                            {
                                totalQuantity == 1 ?
                                <>
                                    {/* <div className='shippingContainer__accountSummaryContainer__accountSummary__item__label'>Producto</div> */}
                                    <Link to={"/cart"} className='shippingContainer__accountSummaryContainer__accountSummary__item__label'>
                                        Producto
                                    </Link>
                                    <div className="shippingContainer__accountSummaryContainer__accountSummary__item__value">$ {total}</div>
                                </>
                                :
                                <>
                                    {/* <div className='shippingContainer__accountSummaryContainer__accountSummary__item__label'>Productos ({totalQuantity})</div> */}
                                    <Link to={"/cart"} className='shippingContainer__accountSummaryContainer__accountSummary__item__label'>
                                        Productos ({totalQuantity})
                                    </Link>
                                    <div className="shippingContainer__accountSummaryContainer__accountSummary__item__value">$ {total}</div>
                                </>
                            }

                        </div>

                        <div className="shippingContainer__accountSummaryContainer__accountSummary__item">

                            <div className="shippingContainer__accountSummaryContainer__accountSummary__item__label">Pagás</div>
                            <div className="shippingContainer__accountSummaryContainer__accountSummary__item__value">$ {total}</div>

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}

export default Shipping