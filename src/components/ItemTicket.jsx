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
            const res = await fetch(`http://localhost:8081/api/products/${ticket._id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast('Has eliminado el producto con éxito', {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "dark",
                    className: "custom-toast",
                });
                fetchProducts();
            } else {
                toast('No se ha podido borrar el producto, intente nuevamente', {
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
            <div className="cPanelProductsContainer__productsTable__itemContainer">

                <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                    <div className="cPanelProductsContainer__productsTable__itemContainer__item__label">{ticket.code}</div>
                </div>

                <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                    <div className="cPanelProductsContainer__productsTable__itemContainer__item__description">{ticket.status}</div>
                </div>

                <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                    <div className="cPanelProductsContainer__productsTable__itemContainer__item__label">$ {ticket.amount}</div>
                </div>

                <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                    <div className="cPanelProductsContainer__productsTable__itemContainer__item__label">{ticket.payer_email}</div>
                </div>

                {/* <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                    <div className="cPanelProductsContainer__productsTable__itemContainer__item__label">{capitalizeFirstLetter(ticket.deliveryMethod)}</div>
                </div> */}

                <div className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer'>
                    {/* <button onClick={() => setShowUpdateModal(true)} className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer__btn'>Editar</button> */}
                    {/* <button onClick={handleBtnDeleteProduct} className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer__btn'>Borrar</button> */}

                    {loading ? (
                        <button
                        disabled
                        className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer__btn'
                        >
                        <Spinner/>
                        </button>
                    ) : (
                        <button
                        onClick={handleBtnDeleteProduct}
                        className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer__btn'
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