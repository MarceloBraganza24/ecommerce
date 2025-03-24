import {useEffect,useState,useContext} from 'react'
import ItemProduct from './ItemProduct'
import { useParams,useNavigate } from 'react-router-dom'
import NavBar from './NavBar';
import Footer from './Footer';
import DeliveryAddress from './DeliveryAddress';
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';

const CategoryContainer = () => {
    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    const {category} = useParams()
    const productsByCategory = products.filter((product) => product.category == category)

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
        async function fetchProductsData() {
            try {
                const response = await fetch(`http://localhost:8081/api/products`)
                const productsAll = await response.json();
                if(!response.ok) {
                    toast('No se pudieron obtener los productos, contacte al administrador', {
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
                } else { 
                    setProducts(productsAll.data.docs)
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            } finally {
                setIsLoadingProducts(false);
            }
        }
        fetchProductsData();
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
            <DeliveryAddress/>
            <div className="categoryContainer__grid">
                                
                <div className="categoryContainer__grid__catalog">

                    <div className='categoryContainer__grid__catalog__categorieContainer__title'>
                        <h2 className='categoryContainer__grid__catalog__categorieContainer__title__prop'>{category}</h2>
                    </div>

                    <div className='categoryContainer__grid__catalog__categorieContainer__productsContainer'>

                        {productsByCategory.map((product) => (
                            <ItemProduct
                            id={product.id}
                            images={product.images}
                            title={product.title}
                            description={product.description}
                            price={product.price}
                            />
                        ))}

                    </div>
                    
                </div>

            </div>

            <Footer/>
            
        </>

    )

}

export default CategoryContainer