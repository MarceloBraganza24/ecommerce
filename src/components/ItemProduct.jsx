import React from 'react'
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";



const ItemProduct = ({id,images,title,description,price}) => {

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    return (

        <>

            <div className="itemProduct">

                <div className="itemProduct__imgContainer">

                    {/* <img src={img} alt="img_product" className='itemProduct__imgContainer__img' /> */}

                    <Swiper
                        navigation
                        pagination={{ clickable: true }}
                        modules={[Navigation, Pagination]}
                        className="w-full h-56"
                    >
                        {images.map((img, index) => (
                        <SwiperSlide key={index}>
                            <img
                            //src={img}
                            src={`http://localhost:8081/${img}`}
                            alt={`Imagen ${index + 1} de ${title}`}
                            //className="w-full h-full object-cover rounded-lg"
                            className="itemProduct__imgContainer__img"
                            />
                        </SwiperSlide>
                        ))}
                    </Swiper>

                </div>

                <div className="itemProduct__titleContainer">
                    <div className="itemProduct__titleContainer__prop">{capitalizeFirstLetter(title)}</div>
                </div>

                <div className="itemProduct__descriptionContainer">
                    <div className="itemProduct__descriptionContainer__prop">{capitalizeFirstLetter(description)}</div>
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