import React, {useState,useEffect,useContext} from 'react'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom'
import ItemCPanelProduct from './ItemCPanelProduct';
import CreateProductModal from './CreateProductModal';
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

const CPanelProducts = () => {
    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [products, setProducts] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });   
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [categories, setCategories] = useState([]);

    const [inputFilteredProducts, setInputFilteredProducts] = useState('');
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);

    function filtrarPorTitle(valorIngresado) {
        const valorMinusculas = valorIngresado.toLowerCase();
        const objetosFiltrados = products.filter(objeto => {
            const nombreMinusculas = objeto.title.toLowerCase();
            return nombreMinusculas.includes(valorMinusculas);
        });
        return objetosFiltrados;
    }
    const objetosFiltrados = filtrarPorTitle(inputFilteredProducts);

    const productosOrdenados = [...objetosFiltrados].sort((a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0; // Si son iguales
    });

    const handleInputFilteredProducts = (e) => {
        const value = e.target.value;
        setInputFilteredProducts(value)
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(1, inputFilteredProducts); // Buscar desde la primera página con el término de búsqueda
        }, 500);
    
        return () => clearTimeout(delayDebounceFn);
    }, [inputFilteredProducts]);
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pageInfo.page]);

    const fetchProducts = async (page = 1, search = "") => {
        try {
            const response = await fetch(`http://localhost:8081/api/products/byPage?page=${page}&search=${search}`)
            const productsAll = await response.json();
            setProducts(productsAll.data.docs)
            setPageInfo({
                page: productsAll.data.page,
                totalPages: productsAll.data.totalPages,
                hasNextPage: productsAll.data.hasNextPage,
                hasPrevPage: productsAll.data.hasPrevPage,
                nextPage: productsAll.data.nextPage,
                prevPage: productsAll.data.prevPage
            });
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setIsLoadingProducts(false)
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
        fetchProducts();
        fetchCategories();
        if(cookieValue) {
            login()
        } else {
            logout()
        }
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
            <div className='cPanelProductsContainer'>
                
                <div className='cPanelProductsContainer__title'>
                    <div className='cPanelProductsContainer__title__prop'>Productos</div>        
                </div>

                <div className='cPanelProductsContainer__inputSearchProduct'>
                    <input type="text" onChange={handleInputFilteredProducts} value={inputFilteredProducts} placeholder='Buscar por título' className='cPanelProductsContainer__inputSearchProduct__input' name="" id="" />
                </div>

                <div className='cPanelProductsContainer__btnCreateProduct'>
                    <button onClick={()=>setShowCreateProductModal(true)} className='cPanelProductsContainer__btnCreateProduct__btn'>Crear producto</button>
                </div>

                <div className='cPanelProductsContainer__quantityProducts'>
                    <div className='cPanelProductsContainer__quantityProducts__prop'>Cantidad de productos: {objetosFiltrados.length}</div>        
                </div>

                {
                    objetosFiltrados.length != 0 &&
                    <div className='cPanelProductsContainer__headerTableContainer'>

                        <div className="cPanelProductsContainer__headerTableContainer__headerTable">

                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Imagen</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Título</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Descripción</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Precio</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Stock</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Categoría</div>

                        </div>

                    </div>
                }


                <div className="cPanelProductsContainer__productsTable">

                    {
                        isLoadingProducts ? 
                            <>
                                <div className="catalogContainer__grid__catalog__isLoadingLabel">
                                    Cargando productos&nbsp;&nbsp;<Spinner/>
                                </div>
                            </>
                        :
                        productosOrdenados.map((product) => (
                            <>
                                <ItemCPanelProduct
                                product={product}
                                fetchProducts={fetchProducts}
                                />
                            </>
                        ))}
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

                </div>

                {/* <div className='cPanelProductsContainer__btnsPagesContainer'>
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
                </div> */}

            </div>  
            
            {
                showCreateProductModal &&
                <CreateProductModal
                categories={categories}
                fetchProducts={fetchProducts}
                setShowCreateProductModal={setShowCreateProductModal}/>      
            }
        
        </>

    )

}

export default CPanelProducts