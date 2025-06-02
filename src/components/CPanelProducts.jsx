import React, {useState,useEffect,useContext} from 'react'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom'
import ItemCPanelProduct from './ItemCPanelProduct';
import CreateProductModal from './CreateProductModal';
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

const CPanelProducts = () => {
    const [cartIcon, setCartIcon] = useState('/src/assets/cart_black.png');
    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState("");
    const [isLoadingStoreSettings, setIsLoadingStoreSettings] = useState(true);
    const [storeSettings, setStoreSettings] = useState({});
    const [userCart, setUserCart] = useState({});
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
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    //console.log(categories)

    const [inputFilteredProducts, setInputFilteredProducts] = useState('');
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [showLogOutContainer, setShowLogOutContainer] = useState(false);

    useEffect(() => {
        if(user.isLoggedIn) {
            setShowLogOutContainer(true)
        }
    }, [user.isLoggedIn]);

    function esColorClaro(hex) {
        if (!hex) return true;

        hex = hex.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness > 128; // <-- usar el mismo umbral que en getContrastingTextColor
    }

    useEffect(() => {
        if (storeSettings?.primaryColor) {
            const claro = esColorClaro(storeSettings.primaryColor);
            setCartIcon(claro ? '/src/assets/cart_black.png' : '/src/assets/cart_white.png');
        }
    }, [storeSettings]);

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
            setTotalProducts(productsAll.data.totalDocs)
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

    const fetchStoreSettings = async () => {
        try {
            setIsLoadingStoreSettings(true)
            const response = await fetch('http://localhost:8081/api/settings');
            const data = await response.json();
            //console.log(data)
            if (response.ok) {
                setStoreSettings(data); 
            } else {
                toast('Error al cargar configuraciones', {
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
            setIsLoadingStoreSettings(false)
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
        } finally {
            setIsLoadingCategories(false)
        }
    };

    const fetchCartByUserId = async (user_id) => {
        try {
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
                navigate('/')
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
        fetchProducts();
        fetchStoreSettings();
        fetchCategories();
    }, []);

    function hexToRgba(hex, opacity) {
        const cleanHex = hex.replace('#', '');
        const bigint = parseInt(cleanHex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [percentage, setPercentage] = useState('');

    const handleCheckboxChange = (id) => {
        setSelectedCategories(prev =>
        prev.includes(id)
            ? prev.filter(catId => catId !== id)
            : [...prev, id]
        );
    };

    const handleSubmitUpdatedPrices = async (e) => {
        e.preventDefault();

        if (selectedCategories.length === 0) {
            toast('Debes seleccionar al menos una categoría.', {
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
            return; // evita que se continúe con el fetch
        }
        if (!percentage || isNaN(percentage) || Number(percentage) === 0) {
            toast('Debes ingresar un porcentaje válido (mayor o menor a 0).', {
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
            return;
        }

        const categoriasSeleccionadasNames = categories
            .filter(cat => selectedCategories.includes(cat._id))
            .map(cat => cat.name);

        const response = await fetch('http://localhost:8081/api/products/update-prices-category', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                percentage: Number(percentage),
                categories: categoriasSeleccionadasNames
            })
        });

        const result = await response.json();

        if (response.ok) {
            toast('Has aplicado los cambios correctamente!', {
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
            setPercentage('');
            setSelectedCategories([]);
            fetchProducts()
            //setMensaje(`✅ ${result.modifiedCount} productos actualizados correctamente.`);
        } else {
            toast('Ha ocurrido un error al aplicar los cambios, intente nuevamente!', {
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
            //setMensaje(`❌ Error: ${result.error}`);
        }
    };

    const handleRestorePricesByCategory = async () => {
        if (selectedCategories.length === 0) {
            toast('Debes seleccionar al menos una categoría para restaurar.', {
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
            return;
        }

        const categoriasSeleccionadasNames = categories
            .filter(cat => selectedCategories.includes(cat._id))
            .map(cat => cat.name);

        try {
            const response = await fetch('http://localhost:8081/api/products/restore-prices-category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categories: categoriasSeleccionadasNames })
            });

            const result = await response.json();

            if (response.ok) {
                toast(`Restauración exitosa! Se actualizaron ${result.modifiedCount || 'los'} productos.`, {
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
                setPercentage('');
                setSelectedCategories([]);
                fetchProducts()
            } else {
                toast('Error al restaurar los precios.', {
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
            toast('Error en la conexión al intentar restaurar precios.', {
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


    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

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
                hexToRgba={hexToRgba}
                primaryColor={storeSettings?.primaryColor || ""}
                logo_store={storeSettings?.siteImages?.logoStore || ""}
                cartIcon={cartIcon}
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

                <form onSubmit={handleSubmitUpdatedPrices} className='cPanelProductsContainer__formUpdatePrices'>
                    <div className='cPanelProductsContainer__formUpdatePrices__title'>Actualizaciones de precios</div>
                    <div className='cPanelProductsContainer__formUpdatePrices__subTitle'>Seleccioná las categorías:</div>
                        <div className='cPanelProductsContainer__formUpdatePrices__categories'>
                            {
                                
                                isLoadingCategories ? 
                                    <>
                                        <div className="cPanelProductsContainer__formUpdatePrices__categories__spinner">
                                            <Spinner/>
                                        </div>
                                    </>
                                :
                                categories.map(categoria => (
                                    <label className='cPanelProductsContainer__formUpdatePrices__categories__labelInput' key={categoria._id}>
                                        <input
                                        className='cPanelProductsContainer__formUpdatePrices__categories__labelInput__input'
                                        type="checkbox"
                                        value={categoria._id}
                                        checked={selectedCategories.includes(categoria._id)}
                                        onChange={() => handleCheckboxChange(categoria._id)}
                                        />
                                        <div className='cPanelProductsContainer__formUpdatePrices__categories__labelInput__label'>
                                            {capitalizeFirstLetter(categoria.name)}
                                        </div>
                                    </label>
                                ))
                            }
                        </div>

                    <div className='cPanelProductsContainer__formUpdatePrices__inputPercentage'>
                        <label>Porcentaje a aplicar (%):</label>
                        <input
                        className='cPanelProductsContainer__formUpdatePrices__inputPercentage__input'
                        type="number"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        required
                        placeholder='%'
                        />
                    </div>

                    <div className='cPanelProductsContainer__formUpdatePrices__btnSubmitContainer'>
                        <button className='cPanelProductsContainer__formUpdatePrices__btnSubmitContainer__btnSubmit' type="submit">Actualizar precios</button>
                        <button
                            className='cPanelProductsContainer__formUpdatePrices__btnSubmitContainer__btnSubmit'
                            type="button"
                            onClick={handleRestorePricesByCategory}
                            >
                            Restaurar precios originales
                        </button>
                    </div>
                </form>

                <div className='cPanelProductsContainer__quantityProducts'>
                    <div className='cPanelProductsContainer__quantityProducts__prop'>Cantidad de productos: {totalProducts}</div>        
                </div>

                {
                    objetosFiltrados.length != 0 &&
                    <div className='cPanelProductsContainer__headerTableContainer'>

                        <div className="cPanelProductsContainer__headerTableContainer__headerTable">

                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item" style={{borderRight:'0.3vh solid black'}}>Imagen</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item" style={{borderRight:'0.3vh solid black'}}>Título</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item" style={{borderRight:'0.3vh solid black'}}>Descripción</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item" style={{borderRight:'0.3vh solid black'}}>Precio</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item" style={{borderRight:'0.3vh solid black'}}>Stock</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item" style={{borderRight:'0.3vh solid black'}}>Categoría</div>

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
                                categories={categories}
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