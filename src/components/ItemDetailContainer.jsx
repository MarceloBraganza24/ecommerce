import {useEffect,useState,useContext} from 'react'
import NavBar from './NavBar'
import { useParams } from 'react-router-dom'
import ItemCount from './ItemCount';
import Footer from './Footer';
import DeliveryAddress from './DeliveryAddress';
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner';

const ItemDetailContainer = () => {
    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const {id} = useParams()
    const productById = products.find((product) => product._id == id)
    //console.log(productById)
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [categories, setCategories] = useState([]);
    const [isLoadingDeliveryForm, setIsLoadingDeliveryForm] = useState(true);
    const [formData, setFormData] = useState({
        street: "",
        street_number: "",
        locality: ""
    });

    const [zoomActive, setZoomActive] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: "50%", y: "50%" });

    const handleSelectChange = (key, value) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        let x = ((e.clientX - left) / width) * 100;
        let y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x: `${x}%`, y: `${y}%` });
    };

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    useEffect(() => {
        if (productById) {
          setSelectedImage(`http://localhost:8081/${productById.images[0]}`);
        }
    }, [productById]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/products`)
            const productsAll = await response.json();
            setProducts(productsAll.data)
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setIsLoadingProducts(false);  
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/categories');
            const data = await response.json();
            if (response.ok) {
                setCategories(data.data); 
            } else {
                toast('Error al cargar categorías', {
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

        } catch (error) {
            console.error(error);
            toast('Error en la conexión', {
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

    const fetchDeliveryForm = async () => {
        try {
            setIsLoadingDeliveryForm(true)
            const response = await fetch('http://localhost:8081/api/deliveryForm');
            const deliveryForm = await response.json();
            if (response.ok) {
                setFormData({
                    street: deliveryForm.data[0].street || "",
                    street_number: deliveryForm.data[0].street_number || "",
                    locality: deliveryForm.data[0].locality || ""
                });
            } else {
                toast('Error al cargar el formulario de entrega', {
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

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingDeliveryForm(false)
        }
    };

    useEffect(() => {
        const getCookie = (name) => {
            const cookieName = name + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieArray = decodedCookie.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
            }
            return "";
        };
        const cookieValue = getCookie('TokenJWT');
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/sessions/current?cookie=${cookieValue}`)
                const data = await response.json();
                if(data.error === 'jwt expired') {
                logout();
                navigate("/login");
                } else {
                const user = data.data
                if(user) {
                    setUser(user)
                }
                setIsLoading(false)
                }
            } catch (error) {
                console.error('Error:', error);
            }
            };
        fetchUser();
        fetchCategories();
        fetchProducts();
        fetchDeliveryForm();
        if(cookieValue) {
            login()
            } else {
            logout()
        }
        window.scrollTo(0, 0);
    }, []);

    return (

        <>
            <div className='navbarContainer'>
                <NavBar
                isLoading={isLoading}
                categories={categories}
                isLoggedIn={user.isLoggedIn}
                role={user.role}
                />
            </div>
            <DeliveryAddress
            formData={formData}
            isLoadingDeliveryForm={isLoadingDeliveryForm}
            />
            <div className='itemDetailContainer'>

                
                
                    <div className='itemDetailContainer__itemDetail'>

                        {
                        
                            isLoadingProducts ? 
                            <>
                                <div className="itemDetailContainer__itemDetail__loadingProducts">
                                    Cargando producto&nbsp;&nbsp;<Spinner/>
                                </div>
                            </>
                            :
                            <>

                                <div className='itemDetailContainer__itemDetail__imgContainer'>
                                
                                    <div onMouseEnter={() => setZoomActive(true)} onMouseMove={handleMouseMove} onMouseLeave={() => setZoomActive(false)} className="itemDetailContainer__itemDetail__imgContainer__img">
                                        <img style={{transform: zoomActive ? "scale(1.5)" : "scale(1)", transformOrigin: `${zoomPosition.x} ${zoomPosition.y}`}} className='itemDetailContainer__itemDetail__imgContainer__img__prop' src={selectedImage} alt="img_product" />
                                    </div>

                                    <div className='itemDetailContainer__itemDetail__imgContainer__galery'>

                                        {productById?.images.slice(0, 6).map((img, index) => (
                                            
                                            <div className='itemDetailContainer__itemDetail__imgContainer__galery__imgContainer'>
                                                <img
                                                key={index}
                                                src={`http://localhost:8081/${img}`}
                                                alt={`Miniatura ${index + 1}`}
                                                className='itemDetailContainer__itemDetail__imgContainer__galery__imgContainer__prop'
                                                onClick={() => setSelectedImage(`http://localhost:8081/${img}`)}
                                                />
                                            </div>

                                        ))}

                                    </div>

                                </div>

                                <div className='itemDetailContainer__itemDetail__infoContainer'>


                                    <div className='itemDetailContainer__itemDetail__infoContainer__info'>

                                        <div className='itemDetailContainer__itemDetail__infoContainer__info__stateContainer'>
                                            <div className='itemDetailContainer__itemDetail__infoContainer__info__stateContainer__state'>{capitalizeFirstLetter(`${productById?.state}`)}</div>
                                            <div className='itemDetailContainer__itemDetail__infoContainer__info__stateContainer__salesQuantity'>+250 ventas</div>
                                        </div>

                                        <div className='itemDetailContainer__itemDetail__infoContainer__info__title'>
                                            <div className='itemDetailContainer__itemDetail__infoContainer__info__title__prop'>{capitalizeFirstLetter(`${productById?.title}`)}</div>
                                        </div>

                                        <div className='itemDetailContainer__itemDetail__infoContainer__info__description'>
                                            <div className='itemDetailContainer__itemDetail__infoContainer__info__description__prop'>{capitalizeFirstLetter(`${productById?.description}`)}</div>
                                        </div>

                                        <div className='itemDetailContainer__itemDetail__infoContainer__info__price'>
                                            {
                                                productById?.stock >= 1 ?
                                                <div className='itemDetailContainer__itemDetail__infoContainer__info__stock__label'>Stock disponible</div>
                                                :
                                                <div className='itemDetailContainer__itemDetail__infoContainer__info__stock__label'>Sin stock</div>
                                            }
                                        </div>

                                        <div className='itemDetailContainer__itemDetail__infoContainer__info__price'>
                                            <div className='itemDetailContainer__itemDetail__infoContainer__info__price__prop'>$ {productById?.price}</div>
                                        </div>

                                        {
                                            productById?.camposExtras &&
                                            Object.entries(productById.camposExtras).map(([key, value], index) => {
                                                const opciones = value.split(',').map(op => op.trim()); // Generamos el array de opciones
                                                
                                                return (
                                                    <div key={index} className='itemDetailContainer__itemDetail__infoContainer__info__campoExtra'>
                                                    <label 
                                                    className='itemDetailContainer__itemDetail__infoContainer__info__campoExtra__label'
                                                    htmlFor={`campoExtra-${index}`}
                                                    >
                                                    {capitalizeFirstLetter(key)}:
                                                    </label>

                                                    <select
                                                    id={`campoExtra-${index}`}
                                                    className='itemDetailContainer__itemDetail__infoContainer__info__campoExtra__select'
                                                    value={selectedOptions[key] || ''} // valor seleccionado o vacío
                                                    onChange={(e) => handleSelectChange(key, e.target.value)}
                                                    >
                                                    {/* <option value="" disabled>Seleccione una opción</option> */}
                                                    {opciones.map((opcion, i) => (
                                                        <option key={i} value={opcion}>
                                                        {capitalizeFirstLetter(opcion)}
                                                        </option>
                                                    ))}
                                                    </select>
                                                </div>
                                                );
                                            })
                                        }

                                        <ItemCount
                                        user_id={user._id} 
                                        id={productById?._id}
                                        images={productById?.images}
                                        title={productById?.title}
                                        description={productById?.description}
                                        price={productById?.price}
                                        stock={productById?.stock}
                                        />

                                    </div>
                                    
                                </div>
                            </>

                        }
                    </div>

            </div>

            <Footer/>

        </>
        
    )

}

export default ItemDetailContainer