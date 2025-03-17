import React, {useState,useEffect} from 'react'


const UpdateProductModal = ({product,setShowUpdateModal}) => {
    
    const [title, setTitle] = useState(`${product.title}`);
    const [description, setDescription] = useState(`${product.description}`);
    const [price, setPrice] = useState(`${product.price}`);
    const [stock, setStock] = useState(`${product.stock}`);

    const [size, setSize] = useState('');
    const [sizes, setSizes] = useState([]);
    console.log(sizes)
    const [color, setColor] = useState('');
    const [colors, setColors] = useState([]);
    console.log(colors)
    const [state, setState] = useState('');
    
    const [category, setCategory] = useState(`${product.category}`);

    const handleInputTitle = (e) => {
        setTitle(e.target.value)
    }

    const handleInputDescription = (e) => {
        setDescription(e.target.value)
    }

    const handleInputPrice = (e) => {
        setPrice(e.target.value)
    }

    const handleInputStock = (e) => {
        setStock(e.target.value)
    }

    const handleInputState = (e) => {
        setState(e.target.value)
    }

    const handleInputSize = (e) => {
        const value = e.target.value;
        setSize(value);

        // Paso 1: Lo partimos por comas
        const arrayStrings = value.split(',');

        // Paso 2: Convertimos cada string a número
        const arrayNumeros = arrayStrings
        .map(item => item.trim()) // quitamos espacios por si acaso
        .filter(item => item !== '') // sacamos vacíos si hay doble coma
        .map(item => Number(item));

        // Guardamos el array de números
        setSizes(arrayNumeros);
    }

    const handleInputColor = (e) => {
        const value = e.target.value;
        setColor(value);

        // Paso 1: Lo partimos por comas
        const arrayStrings = value.split(',');

        // Paso 2: Convertimos cada string a número
        const arrayNumeros = arrayStrings
        .map(item => item.trim()) // quitamos espacios por si acaso
        .filter(item => item !== '') // sacamos vacíos si hay doble coma
        .map(item => item);

        // Guardamos el array de números
        setColors(arrayNumeros);
    }

    const handleInputCategory = (e) => {
        setCategory(e.target.value)
    }

    useEffect(() => {

        /* product.size.forEach(size => {
            setSizes(size)
        }) */

    },[])

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    return (
        
        <>

            <div className='updateProductModalContainer'>

                <div className='updateProductModalContainer__updateProductModal'>

                    <div className='updateProductModalContainer__updateProductModal__btnCloseModal'>
                        <div onClick={()=>setShowUpdateModal(false)} className='updateProductModalContainer__updateProductModal__btnCloseModal__btn'>X</div>
                    </div>

                    <div className='updateProductModalContainer__updateProductModal__propsContainer'>

                        <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct'>

                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__label'>{product.images.length == 1?'Imágen':'Imágenes'}</div>
                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__galeryImages'>
                                {product.images.map((img, index) => (
                                    <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__galeryImages__imgContainer'>
                                        <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__galeryImages__imgContainer__btnDelete'>
                                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__galeryImages__imgContainer__btnDelete__prop'>X</div>
                                        </div>
                                        <img
                                        key={index}
                                        src={img}
                                        alt={`Miniatura ${index + 1}`}
                                        className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__galeryImages__imgContainer__prop'
                                        onClick={() => setSelectedImage(img)}
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>

                        <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct'>

                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__label'>Título</div>
                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input'>
                                <input className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input__prop' placeholder='Título' type="text" value={title} onChange={handleInputTitle} />
                            </div>

                        </div>

                        <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct'>

                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__label'>Descripción</div>
                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input'>
                                <input className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input__prop' placeholder='Descripción' type="text" value={description} onChange={handleInputDescription} />
                            </div>

                        </div>

                        <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct'>

                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__label'>Precio</div>
                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input'>
                                <input className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input__propShort' placeholder='Precio' type="text" value={price} onChange={handleInputPrice} />
                            </div>

                        </div>

                        <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct'>

                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__label'>Stock</div>
                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input'>
                                <input className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input__propShort' placeholder='Stock' type="text" value={stock} onChange={handleInputStock} />
                            </div>

                        </div>

                        <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct'>

                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__label'>Talle</div>
                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input'>
                                <input className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input__prop' placeholder='Valores separados por comas (38,40)' type="text" value={size} onChange={handleInputSize} />
                            </div>

                        </div>

                        <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct'>

                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__label'>Color</div>
                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input'>
                                <input className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input__prop' placeholder='Valores separados por comas (Blanco,Negro)' type="text" value={color} onChange={handleInputColor} />
                            </div>

                        </div>

                        <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct'>

                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__label'>Estado</div>
                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input'>
                                <input className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input__prop' placeholder='Estado' type="text" value={state} onChange={handleInputState} />
                            </div>

                        </div>

                        <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct'>

                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__label'>Categoría</div>
                            <div className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input'>
                                <input className='updateProductModalContainer__updateProductModal__propsContainer__propProduct__input__prop' placeholder='Categoría' type="text" value={category} onChange={handleInputCategory} />
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        
        </>

    )

}


export default UpdateProductModal