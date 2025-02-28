import {useEffect} from 'react'
import NavBar from './NavBar'
import { useParams } from 'react-router-dom'
import ItemCount from './ItemCount';
import Footer from './Footer';

const products = [
    { id: 1, img: "/src/assets/body_micromorley.jpg", title: "Body micromorley", description: '(disponible en blanco y rojo)', price: 15500, stock: 5, category: 'bodies' },
    { id: 2, img: "/src/assets/body_lentejuelas.jpg", title: "Body lentejuelas", description: '(disponible en cobre y plateado)', price: 16000, stock: 2, category: 'bodies' },
    { id: 3, img: "/src/assets/body_bretel.jpg", title: "Body bretel", description: 'Escote pinzado con abertura microfibra (disponible en negro)', price: 14800, stock: 10, category: 'bodies' },
    { id: 4, img: "/src/assets/cintos_elastizados_dorados.jpg", title: "Cintos elastizados", description: 'Dorados', price: 6000, stock: 5, category: 'cintos' },
    { id: 5, img: "/src/assets/cintos_elastizados_plateados.jpg", title: "Cintos elastizados", description: 'Plateados', price: 7000, stock: 6, category: 'cintos' },
    { id: 6, img: "/src/assets/short_jean.jpg", title: "Short jean", description: 'Blanco ( disponible en talle 40)', price: 10000, stock: 1, category: 'shorts' },
    { id: 7, img: "/src/assets/top_push_up_lentejuelas.jpg", title: "Top push up", description: 'Lazo en la espalda para atar (disponible en plateado)', price: 12000, stock: 12, category: 'tops' },
    { id: 8, img: "/src/assets/bando_de_lentejuelas.jpg", title: "Bando de lentejuelas", description: '(disponible los tres colores)', price: 14000, stock: 4, category: 'tops' },
    { id: 9, img: "/src/assets/pollera_frunce_microfibra.jpg", title: "Pollera frunce microfibra", description: '(disponible en negro blanco y rojo)', price: 16000, stock: 9, category: 'polleras' },
    { id: 10, img: "/src/assets/vestido_un_hombro.jpg", title: "Vestido un hombro", description: 'Abertura en la cintura (disponible en negro)', price: 19500, stock: 6, category: 'vestidos' },
    { id: 11, img: "/src/assets/pollera_de_jean_cargo.jpg", title: "Pollera de jean cargo", description: '(disponible en talle 38 y 40)', price: 17500, stock: 8, category: 'polleras' },
];


const ItemDetailContainer = () => {
    const {id} = useParams()
    const productById = products.find((product) => product.id == id)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (

        <>
            <div className='navbarContainer'>
                <NavBar/>
            </div>
            <div className='itemDetailContainer'>

                <div className='itemDetailContainer__itemDetail'>

                    <div className='itemDetailContainer__itemDetail__imgContainer'>
                        <img className='itemDetailContainer__itemDetail__imgContainer__img' src={productById.img} alt="img_product" />
                    </div>

                    <div className='itemDetailContainer__itemDetail__infoContainer'>

                        <div className='itemDetailContainer__itemDetail__infoContainer__info'>

                            <div className='itemDetailContainer__itemDetail__infoContainer__info__title'>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__title__prop'>{productById.title}</div>
                            </div>

                            <div className='itemDetailContainer__itemDetail__infoContainer__info__description'>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__description__label'>Descripción:</div>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__description__prop'>{productById.description}</div>
                            </div>

                            <div className='itemDetailContainer__itemDetail__infoContainer__info__price'>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__price__label'>Precio:</div>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__price__prop'>$ {productById.price}</div>
                            </div>

                            <div className='itemDetailContainer__itemDetail__infoContainer__info__price'>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__price__label'>Stock:</div>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__price__prop'>{productById.stock}</div>
                            </div>

                            <ItemCount 
                            id={productById.id}
                            img={productById.img}
                            title={productById.title}
                            description={productById.description}
                            price={productById.price}
                            stock={productById.stock}
                            />

                        </div>
                        
                    </div>

                </div>

            </div>

            <Footer/>

        </>
        
    )

}

export default ItemDetailContainer