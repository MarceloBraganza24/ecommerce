import {useContext,useState} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import { toast } from 'react-toastify';

const ItemCount = ({id, images, title,description,price,stock}) => {

    const {cart, setCart} = useContext(CartContext);
    
    const [count, setCount] = useState(1);

    const increment = () => {
        setCount(count + 1)
    }

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
    
  return (

    <>
        <div className='itemDetailContainer__itemDetail__infoContainer__info__count'>

            <h2 className='itemDetailContainer__itemDetail__infoContainer__info__count__quantityLabel'>Cantidad:</h2>

            {/* <button className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={increment}>+</button> */}

            { count < stock ?
                <button className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={increment}>+</button> : <button disabled className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={increment}>+</button>
            }

            <div className='itemDetailContainer__itemDetail__infoContainer__info__count__prop'>{count}</div>

            { count != 1 ?
                <button className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={decrement}>-</button> : <button disabled className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={decrement}>-</button>
            }

        </div> 

        <div className='itemDetailContainer__itemDetail__infoContainer__info__btnAddToCart'>
            <button className='itemDetailContainer__itemDetail__infoContainer__info__btnAddToCart__prop'>Comprar ahora</button>
            <button onClick={addToCart} className='itemDetailContainer__itemDetail__infoContainer__info__btnAddToCart__propCart'>Agregar al Carrito</button>
        </div>
    </>

  )

}

export default ItemCount