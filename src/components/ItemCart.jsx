import {useContext,useState} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import { Link } from 'react-router-dom';

const ItemCart = ({id,title,description,stock,quantity,img,price}) => {

    const {deleteItemCart,updateQuantity} = useContext(CartContext);

    const increment = () => {
        updateQuantity(id, quantity + 1);
    }

    const decrement = () => {
        if (quantity > 1) {
          updateQuantity(id, quantity - 1);
        }
    }

  return (

    <>

        <div className='itemCart'>

            <div className='itemCart__imgContainer'>
                <img className='itemCart__imgContainer__img' src={img} alt="img" />
            </div>

            <div className='itemCart__title'>
                <Link className='itemCart__title__prop' to={`/item/${id}`}>
                    {title} 
                </Link>
            </div>

            <div className='itemCart__description'>
                <div className='itemCart__description__prop'>{description}</div>
            </div>

            <div className='itemCart__quantity'>
                
                <button className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={increment}>+</button>

                <div className='itemCart__quantity'>{quantity}</div>

                <button className='itemDetailContainer__itemDetail__infoContainer__info__count__plusMinus' onClick={decrement}>-</button>

            </div>

            <div className='itemCart__price'>
                <div className='itemCart__price__prop'>${price}</div>
            </div>

            <div className='itemCart__subtotal'>
                <div className='itemCart__subtotal__prop'>${quantity * price}</div>
            </div>

            <div className='itemCart__btn'>
                <button onClick={()=>deleteItemCart(id)} className='itemCart__btn__prop'>X</button>
            </div>

        </div>

    </>

  )

}

export default ItemCart