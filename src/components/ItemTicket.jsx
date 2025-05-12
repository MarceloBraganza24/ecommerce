import React, {useState} from 'react'
import Spinner from './Spinner';
import { toast } from 'react-toastify';

const ItemTicket = ({ticket,fetchTickets}) => {
    const [loading, setLoading] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

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
                fetchTickets();
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

    return (
        <>
            <div className="cPanelSalesContainer__salesTable__itemContainer">

                <div className="cPanelSalesContainer__salesTable__itemContainer__item">
                    <div className="cPanelSalesContainer__salesTable__itemContainer__item__label">{ticket.code}</div>
                </div>

                <div className="cPanelSalesContainer__salesTable__itemContainer__item">
                    <div className="cPanelSalesContainer__salesTable__itemContainer__item__description">{ticket.status?ticket.status:'-'}</div>
                </div>

                <div className="cPanelSalesContainer__salesTable__itemContainer__item">
                    <div className="cPanelSalesContainer__salesTable__itemContainer__item__label">$ {ticket.amount}</div>
                </div>

                <div className="cPanelSalesContainer__salesTable__itemContainer__item">
                    <div className="cPanelSalesContainer__salesTable__itemContainer__item__label">{ticket.payer_email}</div>
                </div>

                {/* <div className="cPanelSalesContainer__salesTable__itemContainer__item">
                    <div className="cPanelSalesContainer__salesTable__itemContainer__item__label">{capitalizeFirstLetter(ticket.deliveryMethod)}</div>
                </div> */}

                <div className='cPanelSalesContainer__salesTable__itemContainer__btnsContainer'>
                    {/* <button onClick={() => setShowUpdateModal(true)} className='cPanelSalesContainer__salesTable__itemContainer__btnsContainer__btn'>Editar</button> */}
                    {/* <button onClick={handleBtnDeleteProduct} className='cPanelSalesContainer__salesTable__itemContainer__btnsContainer__btn'>Borrar</button> */}

                    {loading ? (
                        <button
                        disabled
                        className='cPanelSalesContainer__salesTable__itemContainer__btnsContainer__btn'
                        >
                        <Spinner/>
                        </button>
                    ) : (
                        <button
                        onClick={handleBtnDeleteProduct}
                        className='cPanelSalesContainer__salesTable__itemContainer__btnsContainer__btn'
                        >
                        Borrar
                        </button>
                    )}

                </div>

            </div>
        </>
    )

}

export default ItemTicket