import React from 'react'

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from 'react-router-dom';



const ItemProduct = ({id,img,title,description,price}) => {

    
    return (

        <>

            <div className="itemProduct">

                <div className="itemProduct__imgContainer">
                    <img src={img} alt="img_product" className='itemProduct__imgContainer__img' />
                </div>

                <div className="itemProduct__titleContainer">
                    <div className="itemProduct__titleContainer__prop">{title}</div>
                </div>

                <div className="itemProduct__descriptionContainer">
                    <div className="itemProduct__descriptionContainer__prop">{description}</div>
                </div>

                <div className="itemProduct__priceContainer">
                    <div className="itemProduct__priceContainer__prop">$ {price}</div>
                </div>

                <div className='itemProduct__btnContainer'>

                    <Link className='itemProduct__btnContainer__btn' to={`/item/${id}`}>
                        Ver Detalle
                    </Link>

                </div>

            </div>

        </>
        
    )

}

export default ItemProduct