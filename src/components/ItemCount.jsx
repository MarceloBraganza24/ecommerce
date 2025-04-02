import {useContext,useState} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const ItemCount = ({user_id,id,images,title,description,price,stock,fetchCartByUserId}) => {

    const { setCart } = useContext(CartContext); 
    
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
        setCount((prevCount) => Math.max(prevCount - 1, 1));
    };

    const addToCartAndSave = async () => {
        const newItem = {
            product: id, 
            quantity: count,
        };
    
        setCart((currItems = []) => {
            const updatedCart = currItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + count } : item
            );
        
            if (!currItems.find((item) => item.id === id)) {
                updatedCart.push({ id, img: images[0], title, description, price, quantity: count });
            }
        
            return [...updatedCart]; 
        });
        
    
        try {
            const response = await fetch("http://localhost:8081/api/carts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, products: [newItem] }),
            });
    
            const data = await response.json();
            if(response.ok){
                toast("Has agregado el producto al carrito!", {
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
                fetchCartByUserId(user_id)
            }
        } catch (error) {
            toast("Error al guardar el producto en el carrito!", {
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
        }
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
            <button onClick={addToCartAndSave} className='itemDetailContainer__itemDetail__infoContainer__info__btnAddToCart__propCart'>Agregar al Carrito</button>
        </div>
    </>

  )

}

export default ItemCount