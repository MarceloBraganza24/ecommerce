import React, {useState} from 'react'
import Spinner from './Spinner';
import { toast } from 'react-toastify';

const ItemTicket = ({ticket,fetchTickets,fechaHora,email,role}) => {
    const [loading, setLoading] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    //console.log(ticket)

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const handleBtnDeleteProduct = async () => {

        setLoading(true);
            
        try {
            const res = await fetch(`http://localhost:8081/api/tickets/${ticket._id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast('Has eliminado la venta con éxito', {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "dark",
                    className: "custom-toast",
                });
                fetchTickets(1, "", email);
            } else {
                toast('No se ha podido borrar la venta, intente nuevamente', {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "dark",
                    className: "custom-toast",
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
        
    };

    const handleBtnHiddenProduct = async () => {

        setLoading(true);
            
        try {
            const res = await fetch(`http://localhost:8081/api/tickets/${ticket._id}`, {
                method: 'PUT'
            });
            if (res.ok) {
                toast('Has eliminado la venta con éxito', {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "dark",
                    className: "custom-toast",
                });
                fetchTickets(1, "", email);
            } else {
                toast('No se ha podido eliminar la venta, intente nuevamente', {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "dark",
                    className: "custom-toast",
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <>
            {
                role == 'admin' ?

                <div className="cPanelSalesContainer__salesTable__itemContainer">

                    <div className="cPanelSalesContainer__salesTable__itemContainer__item">
                        <div className="cPanelSalesContainer__salesTable__itemContainer__item__label">{fechaHora}</div>
                    </div>

                    <div className="cPanelSalesContainer__salesTable__itemContainer__itemEllipsis">
                        <div className="cPanelSalesContainer__salesTable__itemContainer__itemEllipsis__item">{ticket.code}</div>
                    </div>

                    <div className="cPanelSalesContainer__salesTable__itemContainer__itemProduct__products">
                        {ticket.items.map((item, index) => {
                            const handleLinkToProductDetail = () => {
                                window.location.href = `/item/${item.product._id}`
                            }

                            const product = item.product;
                            const title = product?.title
                                ? product.title.charAt(0).toUpperCase() + product.title.slice(1).toLowerCase()
                                : '-';

                            const relativePath = Array.isArray(product?.images) && product.images.length > 0
                                ? product.images[0]
                                : null;

                            const imageUrl = relativePath
                                ? `http://localhost:8081/${relativePath}`  // <-- reemplazá con tu dominio real
                                : '/default-image.jpg';

                            return (
                                <div key={index} onClick={handleLinkToProductDetail} className="cPanelSalesContainer__salesTable__itemContainer__itemProduct__products__productLine">
                                    <div className="cPanelSalesContainer__salesTable__itemContainer__itemProduct__products__img">
                                        <img className='cPanelSalesContainer__salesTable__itemContainer__itemProduct__products__img__prop' src={imageUrl} alt='#image' />
                                    </div>
                                    <div className="cPanelSalesContainer__salesTable__itemContainer__itemProduct__products__title">
                                        {title}
                                    </div>
                                    <div className="cPanelSalesContainer__salesTable__itemContainer__itemProduct__products__quantity">
                                        x {item.quantity}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cPanelSalesContainer__salesTable__itemContainer__item">
                        <div className="cPanelSalesContainer__salesTable__itemContainer__item__label">$ {ticket.amount}</div>
                    </div>

                    <div className="cPanelSalesContainer__salesTable__itemContainer__itemEllipsis">
                        <div className="cPanelSalesContainer__salesTable__itemContainer__itemEllipsis__item">{ticket.payer_email}</div>
                    </div>

                    <div className="cPanelSalesContainer__salesTable__itemContainer__item">
                        <div className="cPanelSalesContainer__salesTable__itemContainer__item__label">{ticket.user_role}</div>
                    </div>

                    <div className='cPanelSalesContainer__salesTable__itemContainer__btnsContainer'>

                        {loading ? (
                            <button
                            disabled
                            className='cPanelSalesContainer__salesTable__itemContainer__btnsContainer__btn'
                            >
                            <Spinner/>
                            </button>
                        ) : role == 'user' ? (
                            <button
                            onClick={handleBtnHiddenProduct}
                            className='cPanelSalesContainer__salesTable__itemContainer__btnsContainer__btn'
                            >
                            Borrar
                            </button>
                        )
                        : role == 'admin' &&
                        (
                            <button
                            onClick={handleBtnDeleteProduct}
                            className='cPanelSalesContainer__salesTable__itemContainer__btnsContainer__btn'
                            >
                            Borrar
                            </button>
                        )}

                    </div>

                </div>
                : role == 'user' &&
                <div className="myPurchasesContainer__purchasesTable__itemContainer">

                    <div className="myPurchasesContainer__purchasesTable__itemContainer__item">
                        <div className="myPurchasesContainer__purchasesTable__itemContainer__item__label">{fechaHora}</div>
                    </div>

                    <div className="myPurchasesContainer__purchasesTable__itemContainer__itemEllipsis">
                        <div className="myPurchasesContainer__purchasesTable__itemContainer__itemEllipsis__item">{ticket.code}</div>
                    </div>

                    <div className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products">
                        {ticket.items.map((item, index) => {
                            const handleLinkToProductDetail = () => {
                                window.location.href = `/item/${item.product._id}`
                            }

                            const product = item.product;
                            const title = product?.title
                                ? product.title.charAt(0).toUpperCase() + product.title.slice(1).toLowerCase()
                                : '-';

                            const relativePath = Array.isArray(product?.images) && product.images.length > 0
                                ? product.images[0]
                                : null;

                            const imageUrl = relativePath
                                ? `http://localhost:8081/${relativePath}`  // <-- reemplazá con tu dominio real
                                : '/default-image.jpg';

                            return (
                                <div key={index} onClick={handleLinkToProductDetail} className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products__productLine">
                                    <div className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products__img">
                                        <img className='myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products__img__prop' src={imageUrl} alt='#image' />
                                    </div>
                                    <div className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products__title">
                                        {title}
                                    </div>
                                    <div className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products__quantity">
                                        x {item.quantity}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="myPurchasesContainer__purchasesTable__itemContainer__item">
                        <div className="myPurchasesContainer__purchasesTable__itemContainer__item__label">$ {ticket.amount}</div>
                    </div>

                    <div className='myPurchasesContainer__purchasesTable__itemContainer__btnsContainer'>

                        {loading ? (
                            <button
                            disabled
                            className='myPurchasesContainer__purchasesTable__itemContainer__btnsContainer__btn'
                            >
                            <Spinner/>
                            </button>
                        ) : role == 'user' ? (
                            <button
                            onClick={handleBtnHiddenProduct}
                            className='myPurchasesContainer__purchasesTable__itemContainer__btnsContainer__btn'
                            >
                            Borrar
                            </button>
                        )
                        : role == 'admin' &&
                        (
                            <button
                            onClick={handleBtnDeleteProduct}
                            className='myPurchasesContainer__purchasesTable__itemContainer__btnsContainer__btn'
                            >
                            Borrar
                            </button>
                        )}

                    </div>

                </div>
            }
            
        </>
    )

}

export default ItemTicket