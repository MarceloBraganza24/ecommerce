/* import {useContext,useState} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const ItemCount = ({id,images,title,description,price,stock}) => {

    const {setCart} = useContext(CartContext);
    
    const navigate = useNavigate();
    const [count, setCount] = useState(1);
    const [ultimoToast, setUltimoToast] = useState(0);
    const tiempoEspera = 2000;

    const increment = () => {
        if (count < stock) {
            setCount(count + 1);
        } else {
            const ahora = Date.now();
            if (ahora - ultimoToast >= tiempoEspera) {
                toast('No hay mas disponibilidad de la ingresada!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    className: "custom-toast",
                });
                setUltimoToast(ahora); // Actualiza el tiempo del último toast
            }
        }
    };

    const decrement = () => {
        setCount(count - 1)
    }

    const addToCart = () => {

        toast('Has agregado un producto al Carrito!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            className: "custom-toast",
        });
        
        setCart((currItems) =>{

            const isItemFound = currItems.find((item) => item.id === id)
            
            if(isItemFound) {

                return currItems.map((item) => {

                    if (item.id === id) {

                        return { ...item, quantity: item.quantity + count }

                    } else {

                        return item

                    }                                        
                })

            } else {

                return [ ...currItems, {id, img: images[0], title,description, price, quantity: count} ]
            }

        })

    }

    const addToCartAndContinue = () => {
        
        setCart((currItems) =>{

            const isItemFound = currItems.find((item) => item.id === id)
            
            if(isItemFound) {

                return currItems.map((item) => {

                    if (item.id === id) {

                        return { ...item, quantity: item.quantity + count }

                    } else {

                        return item

                    }                                        
                })

            } else {

                return [ ...currItems, {id, img: images[0], title,description, price, quantity: count} ]
            }

        })

        setTimeout(() => {
            navigate("/shipping");
        }, 1500);

    }
    
  return (

    <>
        <div className='itemDetailContainer__itemDetail__infoContainer__info__count'>

            <h2 className='itemDetailContainer__itemDetail__infoContainer__info__count__quantityLabel'>Cantidad:</h2>

            <button className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={increment}>+</button>

            { stock > 0 ?
                <div className='itemDetailContainer__itemDetail__infoContainer__info__count__prop'>{count}</div>
                :
                <div className='itemDetailContainer__itemDetail__infoContainer__info__count__prop'>0</div>
            }

            { count != 1 ?
                <button className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={decrement}>-</button> : <button disabled className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={decrement}>-</button>
            }

            <div className='itemDetailContainer__itemDetail__infoContainer__info__count__availability'>({stock} Disponibles)</div>

        </div> 

        <div className='itemDetailContainer__itemDetail__infoContainer__info__btnAddToCart'>
            <button onClick={addToCartAndContinue} className='itemDetailContainer__itemDetail__infoContainer__info__btnAddToCart__prop'>Comprar ahora</button>
            <button onClick={addToCart} className='itemDetailContainer__itemDetail__infoContainer__info__btnAddToCart__propCart'>Agregar al Carrito</button>
        </div>
    </>

  )

}

export default ItemCount */


import {useContext,useState} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const ItemCount = ({user_id,id,images,title,description,price,stock}) => {

    const { setCart, addToCart } = useContext(CartContext); 
    
    const navigate = useNavigate();
    const [count, setCount] = useState(1);
    const [ultimoToast, setUltimoToast] = useState(0);
    const tiempoEspera = 2000;

    const increment = () => {
        if (count < stock) {
            setCount(count + 1);
        } else {
            const ahora = Date.now();
            if (ahora - ultimoToast >= tiempoEspera) {
                toast('No hay mas disponibilidad de la ingresada!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    className: "custom-toast",
                });
                setUltimoToast(ahora); // Actualiza el tiempo del último toast
            }
        }
    };

    const decrement = () => {
        setCount(count - 1)
    }

    const addToCartAndSave = async () => {
        const newItem = {
            product: id, // Solo enviamos el ID del producto
            quantity: count,
        };
    
        setCart((currItems) => {
            const isItemFound = currItems.find((item) => item.id === id);
            if (isItemFound) {
                return currItems.map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + count } : item
                );
            } else {
                return [...currItems, { id, img: images[0], title, description, price, quantity: count }];
            }
        });
    
        try {
            const response = await fetch("http://localhost:8081/api/carts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, products: [newItem] }), // ✅ Ahora incluye userId
            });
    
            const data = await response.json();
            console.log("Carrito actualizado en MongoDB:", data);
        } catch (error) {
            console.error("Error al guardar en el carrito:", error);
        }
    
        toast("Has agregado un producto al Carrito!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            className: "custom-toast",
        });
    };
    

    const addToCartAndContinue = async () => {
        await addToCartAndSave();
        setTimeout(() => {
            navigate("/shipping");
        }, 1500);
    };
    
  return (

    <>
        <div className='itemDetailContainer__itemDetail__infoContainer__info__count'>

            <h2 className='itemDetailContainer__itemDetail__infoContainer__info__count__quantityLabel'>Cantidad:</h2>

            <button className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={increment}>+</button>

            { stock > 0 ?
                <div className='itemDetailContainer__itemDetail__infoContainer__info__count__prop'>{count}</div>
                :
                <div className='itemDetailContainer__itemDetail__infoContainer__info__count__prop'>0</div>
            }

            { count != 1 ?
                <button className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={decrement}>-</button> : <button disabled className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={decrement}>-</button>
            }

            <div className='itemDetailContainer__itemDetail__infoContainer__info__count__availability'>({stock} Disponibles)</div>

        </div> 

        <div className='itemDetailContainer__itemDetail__infoContainer__info__btnAddToCart'>
            <button onClick={addToCartAndContinue} className='itemDetailContainer__itemDetail__infoContainer__info__btnAddToCart__prop'>Comprar ahora</button>
            <button onClick={addToCart} className='itemDetailContainer__itemDetail__infoContainer__info__btnAddToCart__propCart'>Agregar al Carrito</button>
        </div>
    </>

  )

}

export default ItemCount