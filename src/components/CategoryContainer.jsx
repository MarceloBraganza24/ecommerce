import {useEffect,useState,useContext} from 'react'
import ItemProduct from './ItemProduct'
import { useParams,useNavigate, Link } from 'react-router-dom'
import NavBar from './NavBar';
import Footer from './Footer';
import DeliveryAddress from './DeliveryAddress';
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

const CategoryContainer = () => {
    const [currentPage, setCurrentPage] = useState(1);  // 👈 Estado para manejar la página actual
    const [totalPages, setTotalPages] = useState(1);  // 👈 Estado para almacenar el total de páginas

    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoadingDeliveryForm, setIsLoadingDeliveryForm] = useState(true);
    const [formData, setFormData] = useState({
        street: "",
        street_number: "",
        locality: ""
    });
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });  
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    const {category} = useParams()
    const productsByCategory = products.filter((product) => product.category == category)

    useEffect(() => {
        fetchProducts();
    }, [currentPage, category]);

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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pageInfo.page]);

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

    const fetchProducts = async (page = 1) => {
        try {
            setIsLoadingProducts(true);  
            const url = new URL(`http://localhost:8081/api/products/by`, window.location.origin);
            const params = new URLSearchParams();
    
            if (category) params.append("category", category);
            params.append("page", page);  // 👈 Envía el número de página
            params.append("limit", 9); // 👈 Define el límite de productos por página
    
            url.search = params.toString();  // Genera la URL con los parámetros
            
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setProducts(data.data);  // 👈 Guarda los productos correctamente
                setPageInfo({
                    page,
                    totalPages: data.totalPages,
                    hasNextPage: data.hasNextPage,
                    hasPrevPage: data.hasPrevPage,
                    nextPage: data.nextPage,
                    prevPage: data.prevPage
                });
            } else {
                console.error("Error al obtener productos:", data.message);
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setIsLoadingProducts(false);  
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
                isLoggedIn={user.isLoggedIn}
                role={user.role}
                categories={categories}
                />
            </div>
            <DeliveryAddress
            formData={formData}
            isLoadingDeliveryForm={isLoadingDeliveryForm}
            />
            <div className="categoryContainer__grid">
                                
                <div className="categoryContainer__grid__catalog">

                    <div className='categoryContainer__grid__catalog__categorieContainer__title'>
                        <h2 className='categoryContainer__grid__catalog__categorieContainer__title__prop'>{category}</h2>
                    </div>

                    <div className='categoryContainer__grid__catalog__categorieContainer__productsContainer'>

                        {
                            isLoadingProducts ? 
                                <>
                                    <div className="catalogContainer__grid__catalog__isLoadingLabel">
                                        Cargando productos&nbsp;&nbsp;<Spinner/>
                                    </div>
                                </>
                            :
                            productsByCategory.length != 0 ?
                            
                            <>
                                {

                                    productsByCategory.map((product) => (
                                        <ItemProduct
                                        id={product._id}
                                        images={product.images}
                                        title={product.title}
                                        description={product.description}
                                        price={product.price}
                                        />
                                    ))
                                }      
                                <div className='cPanelProductsContainer__btnsPagesContainer'>
                                    <button className='cPanelProductsContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfo.hasPrevPage}
                                        onClick={() => fetchProducts(pageInfo.prevPage)}
                                        >
                                        Anterior
                                    </button>
                                    
                                    <span>Página {pageInfo.page} de {pageInfo.totalPages}</span>

                                    <button className='cPanelProductsContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfo.hasNextPage}
                                        onClick={() => fetchProducts(pageInfo.nextPage)}
                                        >
                                        Siguiente
                                    </button>
                                </div>
                            </>
                            : 
                            <>
                            <div className='categoryContainer__grid__catalog__categorieContainer__productsContainer__nonProductsYet'>
                                <div className='categoryContainer__grid__catalog__categorieContainer__productsContainer__nonProductsYet__label'>Aún no existen productos con esta categoría</div>
                                <Link
                                    to={`/cpanel/products`}
                                    className="categoryContainer__grid__catalog__categorieContainer__productsContainer__nonProductsYet__link"
                                    >
                                    Agregar productos
                                </Link>
                            </div>
                            </>
                            
                        }

                    </div>
                    
                </div>

            </div>

            <Footer/>
            
        </>

    )

}

export default CategoryContainer