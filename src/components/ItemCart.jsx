import {useContext} from 'react'
import {CartContext} from '../context/ShoppingCartContext'
import { Link } from 'react-router-dom';

const ItemCart = ({id,title,description,quantity,img,price}) => {

    const {deleteItemCart} = useContext(CartContext);

  return (

    <>

        <div className='itemCart'>

            <div className='itemCart__imgContainer'>
                <img className='itemCart__imgContainer__img' src={img} alt="img" />
            </div>

            <div className='itemCart__title'>
                {/* <div className='itemCart__title__prop'>{title}</div> */}
                <Link className='itemCart__title__prop' to={`/item/${id}`}>
                    {title} 
                </Link>
            </div>

            <div className='itemCart__description'>
                <div className='itemCart__description__prop'>{description}</div>
            </div>

            <div className='itemCart__quantity'>
                <div className='itemCart__quantity'>{quantity}</div>
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