import React, {useState} from 'react'
import Spinner from './Spinner';
import { toast } from 'react-toastify';

const ItemTicket = ({ticket,fetchTickets,fechaHora,email}) => {
    const [loading, setLoading] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    //const titles = ticket.items.map(item => item.title).join(", ");
    /* const titles = ticket.items.map(item => 
        item.product && item.product.title 
            ? item.product.title.charAt(0).toUpperCase() + item.product.title.slice(1).toLowerCase() 
            : ''
    ).join(", "); */

    /* const titles = ticket.items.map(item => 
    item.product?.title 
        ? item.product.title.charAt(0).toUpperCase() + item.product.title.slice(1).toLowerCase() 
        : ''
    ); */
    const titles = ticket.items.map(item => {
    const title = item.product?.title
        ? item.product.title.charAt(0).toUpperCase() + item.product.title.slice(1).toLowerCase()
        : '';

        const quantity = item.quantity ?? 0;

        return `${title} x ${quantity}`;
    });

    console.log(ticket.items)
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

    return (
        <>
            <div className="myPurchasesContainer__purchasesTable__itemContainer">

                <div className="myPurchasesContainer__purchasesTable__itemContainer__item">
                    <div className="myPurchasesContainer__purchasesTable__itemContainer__item__label">{fechaHora}</div>
                </div>

                <div className="myPurchasesContainer__purchasesTable__itemContainer__item">
                    <div className="myPurchasesContainer__purchasesTable__itemContainer__item__label">{ticket.code}</div>
                </div>

                {/* <div className="myPurchasesContainer__purchasesTable__itemContainer__item">
                    <div className="myPurchasesContainer__purchasesTable__itemContainer__item__products">{titles?titles:'-'}</div>
                </div> */}
                {/* <div className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct">
                    <div className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products">
                        {titles && titles.length > 0
                        ? titles.map((linea, index) => <div className='myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products__product' key={index}>{linea}</div>)
                        : '-'}
                    </div>
                </div> */}
                <div className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products">
                    {ticket.items.map((item, index) => (
                        <div key={index} className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products__productLine">
                            <div className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products__title">
                                {item.product?.title
                                ? item.product.title.charAt(0).toUpperCase() + item.product.title.slice(1).toLowerCase()
                                : '-'}
                            </div>
                            <div className="myPurchasesContainer__purchasesTable__itemContainer__itemProduct__products__quantity">
                                x {item.quantity}
                            </div>
                        </div>
                    ))}
                </div>



                <div className="myPurchasesContainer__purchasesTable__itemContainer__item">
                    <div className="myPurchasesContainer__purchasesTable__itemContainer__item__label">$ {ticket.amount}</div>
                </div>

                <div className="myPurchasesContainer__purchasesTable__itemContainer__item">
                    <div className="myPurchasesContainer__purchasesTable__itemContainer__item__label">{ticket.payer_email}</div>
                </div>

                <div className='myPurchasesContainer__purchasesTable__itemContainer__btnsContainer'>
                    {/* <button onClick={() => setShowUpdateModal(true)} className='myPurchasesContainer__purchasesTable__itemContainer__btnsContainer__btn'>Editar</button> */}
                    {/* <button onClick={handleBtnDeleteProduct} className='myPurchasesContainer__purchasesTable__itemContainer__btnsContainer__btn'>Borrar</button> */}

                    {loading ? (
                        <button
                        disabled
                        className='myPurchasesContainer__purchasesTable__itemContainer__btnsContainer__btn'
                        >
                        <Spinner/>
                        </button>
                    ) : (
                        <button
                        onClick={handleBtnDeleteProduct}
                        className='myPurchasesContainer__purchasesTable__itemContainer__btnsContainer__btn'
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