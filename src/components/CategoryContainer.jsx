import {useEffect,useState,useContext} from 'react'
import ItemProduct from './ItemProduct'
import { useParams,useNavigate, Link } from 'react-router-dom'
import NavBar from './NavBar';
import Footer from './Footer';
import DeliveryAddress from './DeliveryAddress';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

const CategoryContainer = () => {

    const [cookieValue, setCookieValue] = useState('');
    const [user, setUser] = useState('');
    const [showLogOutContainer, setShowLogOutContainer] = useState(false);
    const [userCart, setUserCart] = useState({});
    const [products, setProducts] = useState([]);
    const [isLoadingDeliveryForm, setIsLoadingDeliveryForm] = useState(true);
    const [deliveryForms, setDeliveryForms] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [sellerAddresses, setSellerAddresses] = useState([]);
    const [isLoadingSellerAddresses, setIsLoadingSellerAddresses] = useState(true);
    const [deliveryAddressFormData, setDeliveryAddressFormData] = useState({
        street: "",
        street_number: "",
        locality: "",
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
        if (category) {
            setProducts([]); // Limpiá productos anteriores
            setIsLoadingProducts(true);
            fetchProducts();
        }
    }, [category]);

    useEffect(() => {
        if(user.isLoggedIn) {
            setShowLogOutContainer(true)
        }
    }, [user.isLoggedIn]);

    useEffect(() => {
        if (user?.selected_addresses) {
            // Buscar la dirección en deliveryForms para asegurarnos de que tenga un _id
            const matchedAddress = deliveryForms.find(item => 
                item.street === user.selected_addresses.street &&
                item.street_number === user.selected_addresses.street_number &&
                item.locality === user.selected_addresses.locality
            );
    
            if (matchedAddress) {
                setSelectedAddress(matchedAddress);
                setDeliveryAddressFormData({
                    street: user.selected_addresses.street,
                    street_number: user.selected_addresses.street_number,
                    locality: user.selected_addresses.locality
                })
            } else {
                setSelectedAddress(user.selected_addresses); // Usa la dirección guardada
            }
        }
    }, [user, deliveryForms]);

    const fetchSellerAddresses = async () => {
        try {
            setIsLoadingSellerAddresses(true)
            const response = await fetch('http://localhost:8081/api/sellerAddresses');
            const data = await response.json();
            if (response.ok) {
                setSellerAddresses(data.data); 
            } else {
                toast('Error al cargar domicilios', {
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
            setIsLoadingSellerAddresses(false)
        }
    };

    const fetchCartByUserId = async (user_id) => {
        try {
            //setIsLoadingProducts(true);
            const response = await fetch(`http://localhost:8081/api/carts/byUserId/${user_id}`);
            const data = await response.json();
    
            if (!response.ok) {
                console.error("Error al obtener el carrito:", data);
                toast('Error al cargar el carrito del usuario actual', {
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
                setUserCart({ user_id, products: [] }); // 👈 cambio clave
                return [];
            }
    
            if (!data.data || !Array.isArray(data.data.products)) {
                console.warn("Carrito vacío o no válido, asignando array vacío.");
                setUserCart({ user_id, products: [] }); // 👈 cambio clave
                return [];
            }
    
            setUserCart(data.data);
            return data.data;
    
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
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
            setUserCart({ user_id, products: [] }); // 👈 cambio clave
            return [];
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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pageInfo.page]);

    const fetchDeliveryForm = async () => {
        try {
            setIsLoadingDeliveryForm(true)
            const response = await fetch('http://localhost:8081/api/deliveryForm');
            const deliveryForm = await response.json();
            if (response.ok) {
                setDeliveryForms(deliveryForm.data)
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
            //setIsLoadingProducts(true);  
            const url = new URL(`http://localhost:8081/api/products/by`, window.location.origin);
            const params = new URLSearchParams();
    
            if (category) params.append("category", category);
            params.append("page", page);  // 👈 Envía el número de página
            params.append("limit", 9); // 👈 Define el límite de productos por página
    
            url.search = params.toString();  // Genera la URL con los parámetros
            
            const response = await fetch(url);
            const data = await response.json();
            //console.log(data)
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

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/sessions/current', {
                method: 'GET',
                credentials: 'include', // MUY IMPORTANTE para enviar cookies
            });
            const data = await response.json();
            if(data.error === 'jwt must be provided') { 
                setIsLoading(false)
                setIsLoadingProducts(false)
            } else {
                const user = data.data
                if(user) {
                    setUser(user)
                    fetchCartByUserId(user._id);
                }
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchCategories();
        fetchProducts();
        fetchSellerAddresses();
        fetchDeliveryForm();
        window.scrollTo(0, 0);
    }, []);

    return (

        <>  

            <div className='navbarContainer'>
                <NavBar
                isLoading={isLoading}
                isLoggedIn={user.isLoggedIn}
                role={user.role}
                first_name={user.first_name}
                categories={categories}
                userCart={userCart}
                showLogOutContainer={showLogOutContainer}
                cookieValue={cookieValue}
                />
            </div>
            {
                user && (user.role != 'admin') &&
                <DeliveryAddress
                deliveryAddressFormData={deliveryAddressFormData}
                isLoadingDeliveryForm={isLoadingDeliveryForm}
                />
            }
            <div className="categoryContainer__grid">

                <div>0</div>
                                
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
                                        user_id={user._id} 
                                        fetchCartByUserId={fetchCartByUserId}
                                        id={product._id}
                                        stock={product.stock}
                                        images={product.images}
                                        title={product.title}
                                        description={product.description}
                                        price={product.price}
                                        userCart={userCart}
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
                            : !isLoadingProducts ?
                                <>
                                    <div className="catalogContainer__grid__catalog__isLoadingLabel">
                                        Cargando productos&nbsp;&nbsp;<Spinner/>
                                    </div>
                                </>
                            : 
                            <>
                            <div className='categoryContainer__grid__catalog__categorieContainer__productsContainer__nonProductsYet'>
                                <div className='categoryContainer__grid__catalog__categorieContainer__productsContainer__nonProductsYet__label'>Aún no existen productos con esta categoría</div>
                                {
                                    user.role == 'admin' &&
                                    <Link
                                    to={`/cpanel/products`}
                                    className="categoryContainer__grid__catalog__categorieContainer__productsContainer__nonProductsYet__link"
                                    >
                                        Agregar productos
                                    </Link>
                                }
                            </div>
                            </>
                            
                        }

                    </div>
                    
                </div>

            </div>

            <Footer
            sellerAddresses={sellerAddresses}
            isLoadingSellerAddresses={isLoadingSellerAddresses}
            />
            
        </>

    )

}

export default CategoryContainer