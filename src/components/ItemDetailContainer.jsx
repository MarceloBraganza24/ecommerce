import {useEffect,useState} from 'react'
import NavBar from './NavBar'
import { useParams } from 'react-router-dom'
import ItemCount from './ItemCount';
import Footer from './Footer';

const products = [
    { id: 1, images: ["/src/assets/body_micromorley.jpg"], title: "Body micromorley", description: '(disponible en blanco y rojo)', price: 15500, stock: 5, color: ["blanco","rojo"], size: ["1","2","3"], category: 'bodies' },
    { id: 2, images: ["/src/assets/body_lentejuelas.jpg"], title: "Body lentejuelas", description: '(disponible en cobre y plateado)', price: 16000, stock: 2, color: ["cobre","plateado"], size: ["2","3"], category: 'bodies' },
    { id: 3, images: ["/src/assets/body_bretel.jpg"], title: "Body bretel", description: 'Escote pinzado con abertura microfibra (disponible en negro)', price: 14800, stock: 10, color: ["negro"], size: ["3"], category: 'bodies' },
    { id: 4, images: ["/src/assets/cintos_elastizados_dorados.jpg"], title: "Cintos elastizados", description: 'Dorados', price: 6000, stock: 5, color: ["único"], size: ["único"], category: 'cintos' },
    { id: 5, images: ["/src/assets/cintos_elastizados_plateados.jpg"], title: "Cintos elastizados", description: 'Plateados', price: 7000, stock: 6, color: ["único"], size: ["único"], category: 'cintos' },
    { id: 6, images: ["/src/assets/short_jean.jpg","/src/assets/short_jean_1.jpg","/src/assets/short_jean_2.jpg"], title: "Short jean", description: 'Blanco ( disponible en talle 40)', price: 10000, stock: 1, color: ["único"], size: ["40"], category: 'shorts' },
    { id: 7, images: ["/src/assets/top_push_up_lentejuelas.jpg"], title: "Top push up", description: 'Lazo en la espalda para atar (disponible en plateado)', price: 12000, stock: 12, color: ["plateado"], size: ["único"], category: 'tops' },
    { id: 8, images: ["/src/assets/bando_de_lentejuelas.jpg"], title: "Bando de lentejuelas", description: '(disponible los tres colores)', price: 14000, stock: 4, color: ["negro","rojo","plateado"], size: ["1","2","3"], category: 'tops' },
    { id: 9, images: ["/src/assets/pollera_frunce_microfibra.jpg"], title: "Pollera frunce microfibra", description: '(disponible en negro blanco y rojo)', price: 16000, stock: 9, color: ["negro","blanco","rojo"], size: ["2","3"], category: 'polleras' },
    { id: 10, images: ["/src/assets/vestido_un_hombro.jpg"], title: "Vestido un hombro", description: 'Abertura en la cintura (disponible en negro)', price: 19500, stock: 6, color: ["negro"], size: ["1","2"], category: 'vestidos' },
    { id: 11, images: ["/src/assets/pollera_de_jean_cargo.jpg","/src/assets/pollera_de_jean_cargo_1.jpg"], title: "Pollera de jean cargo", description: '(disponible en talle 38 y 40)', price: 17500, stock: 8, color: ["único"], size: ["38","40"], category: 'polleras' },
    { id: 12, images: ["/src/assets/bodies_especial.png"], title: "Body especial", description: '(disponible en talle 38 y 40)', price: 15500, stock: 3, color: ["blanco","rojo","negro"], size: ["38","40"], category: 'bodies' },
    { id: 12, images: ["/src/assets/bodies_tradicional.png"], title: "Body tradicional", description: '(disponible en talle 38 y 40)', price: 12500, stock: 5, color: ["blanco","negro","marrón"], size: ["38","40"], category: 'bodies' },
];


const ItemDetailContainer = () => {
    const {id} = useParams()
    const productById = products.find((product) => product.id == id)
    const [selectedImage, setSelectedImage] = useState(productById.images[0]);
    const [colorSelectedOption, setColorSelectedOption] = useState("");
    const [sizeSelectedOption, setSizeSelectedOption] = useState("");

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

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
                        
                        <div className="itemDetailContainer__itemDetail__imgContainer__img">
                            <img className='itemDetailContainer__itemDetail__imgContainer__img__prop' src={selectedImage} alt="img_product" />
                        </div>

                        <div className='itemDetailContainer__itemDetail__imgContainer__galery'>

                            {productById.images.slice(0, 6).map((img, index) => (

                                <div className='itemDetailContainer__itemDetail__imgContainer__galery__imgContainer'>
                                    <img
                                    key={index}
                                    src={img}
                                    alt={`Miniatura ${index + 1}`}
                                    className='itemDetailContainer__itemDetail__imgContainer__galery__imgContainer__prop'
                                    onClick={() => setSelectedImage(img)}
                                    />
                                </div>

                            ))}

                        </div>

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

                            <div className='itemDetailContainer__itemDetail__infoContainer__info__color'>

                                <div className='itemDetailContainer__itemDetail__infoContainer__info__color__label'>Color:</div>
                                <select
                                    id="colores"
                                    value={colorSelectedOption}
                                    onChange={(e) => setColorSelectedOption(e.target.value)}
                                    className="itemDetailContainer__itemDetail__infoContainer__info__color__select"
                                >
                                    {productById.color.map((color, index) => (
                                    <option key={index} value={color}>
                                        {capitalizeFirstLetter(color)}
                                    </option>
                                    ))}
                                </select>

                            </div>

                            <div className='itemDetailContainer__itemDetail__infoContainer__info__color'>

                                <div className='itemDetailContainer__itemDetail__infoContainer__info__color__label'>Talle:</div>
                                <select
                                    id="colores"
                                    value={sizeSelectedOption}
                                    onChange={(e) => setSizeSelectedOption(e.target.value)}
                                    className="itemDetailContainer__itemDetail__infoContainer__info__color__select"
                                >
                                    {productById.size.map((size, index) => (
                                    <option key={index} value={size}>
                                        {capitalizeFirstLetter(size)}
                                    </option>
                                    ))}
                                </select>

                            </div>

                            <div className='itemDetailContainer__itemDetail__infoContainer__info__price'>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__price__label'>Stock:</div>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__price__prop'>{productById.stock}</div>
                            </div>

                            <div className='itemDetailContainer__itemDetail__infoContainer__info__price'>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__price__label'>Precio:</div>
                                <div className='itemDetailContainer__itemDetail__infoContainer__info__price__prop'>$ {productById.price}</div>
                            </div>

                            <ItemCount 
                            id={productById.id}
                            images={productById.images}
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