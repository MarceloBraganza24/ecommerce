import React, {useState,useEffect} from 'react'
import NavBar from './NavBar';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import ItemTicket from './ItemTicket';
import { useNavigate } from 'react-router-dom';

const Tickets = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });   
    //console.log(pageInfo)

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState('');
    const [categories, setCategories] = useState([]);
    const [tickets, setTickets] = useState([]);
    //console.log(tickets)
    const [userCart, setUserCart] = useState({});
    const [showLogOutContainer, setShowLogOutContainer] = useState(false);
    const [cookieValue, setCookieValue] = useState('');

    const [inputFilteredTickets, setInputFilteredTickets] = useState('');
    const [isLoadingTickets, setIsLoadingTickets] = useState(true);

    function filtrarPorTitle(valorIngresado) {
        const valorMinusculas = valorIngresado.toLowerCase();
        const objetosFiltrados = tickets.filter(objeto => {
            const nombreMinusculas = objeto.payer_email.toLowerCase();
            return nombreMinusculas.includes(valorMinusculas);
        });
        return objetosFiltrados;
    }
    const objetosFiltrados = filtrarPorTitle(inputFilteredTickets);

    useEffect(() => {
        if(user.isLoggedIn) {
            setShowLogOutContainer(true)
        }
    }, [user.isLoggedIn]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pageInfo.page]);

    const goToPreviousDay = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setSelectedDate(prevDate);
    };
    
    const goToNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
    };

    const formatDateToString = (date) => {
        return date.toISOString().split('T')[0]; // formato YYYY-MM-DD
    };
    
    const filteredByDate = objetosFiltrados.filter(ticket => {
        const ticketDate = new Date(ticket.purchase_datetime).toISOString().split('T')[0];
        return ticketDate === formatDateToString(selectedDate);
    });

    const fetchUser = async (cookieValue) => {
        try {
            const response = await fetch(`http://localhost:8081/api/sessions/current?cookie=${cookieValue}`)
            const data = await response.json();
            if(data.error === 'jwt must be provided') { 
                setIsLoading(false)
                setIsLoadingTickets(false)
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

    /* const fetchProducts = async (page = 1, search = "") => {
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
    }; */

    /* const response = await fetch(`http://localhost:8081/api/products/byPage?page=${page}&search=${search}`)
    const productsAll = await response.json();
    setProducts(productsAll.data.docs)
    setPageInfo({
        page: productsAll.data.page,
        totalPages: productsAll.data.totalPages,
        hasNextPage: productsAll.data.hasNextPage,
        hasPrevPage: productsAll.data.hasPrevPage,
        nextPage: productsAll.data.nextPage,
        prevPage: productsAll.data.prevPage
    }); */

    const fetchTickets = async (page = 1, search = "") => {
        try {
            setIsLoadingTickets(true)
            const response = await fetch(`http://localhost:8081/api/tickets/byPage?page=${page}&search=${search}`)
            const ticketsAll = await response.json();
            if (response.ok) {
                //console.log(ticketsAll.data)
                setTickets(ticketsAll.data.docs); 
                setPageInfo({
                    page: ticketsAll.data.page,
                    totalPages: ticketsAll.data.totalPages,
                    hasNextPage: ticketsAll.data.hasNextPage,
                    hasPrevPage: ticketsAll.data.hasPrevPage,
                    nextPage: ticketsAll.data.nextPage,
                    prevPage: ticketsAll.data.prevPage
                });
            } else {
                toast('Error al cargar las ventas', {
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
            setIsLoadingTickets(false)
        }
    };

    /* const fetchTickets = async () => {
        try {
            setIsLoadingTickets(true)
            const response = await fetch('http://localhost:8081/api/tickets');
            const data = await response.json();
            if (response.ok) {
                setTickets(data.data); 
            } else {
                toast('Error al cargar las ventas', {
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
            setIsLoadingTickets(false)
        }
    }; */

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
        if(cookieValue) {
            setCookieValue(cookieValue)
        } else {
            navigate('/')
        }
        fetchUser(cookieValue);
        fetchCategories();
        fetchTickets();
    }, []);

    const handleInputFilteredSales = (e) => {
        const value = e.target.value;
        setInputFilteredTickets(value)
    }

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
                fetchUser={fetchUser}
                />
            </div>

            <div className='cPanelProductsContainer'>
                
                <div className='cPanelProductsContainer__title'>
                    <div className='cPanelProductsContainer__title__prop'>Ventas</div>        
                </div>

                <div className='cPanelProductsContainer__inputSearchProduct'>
                    <input type="text" onChange={handleInputFilteredSales} value={inputFilteredTickets} placeholder='Buscar por email' className='cPanelProductsContainer__inputSearchProduct__input' name="" id="" />
                </div>

                <div className='cPanelProductsContainer__btnCreateProduct'>
                    <button /* onClick={()=>setShowCreateProductModal(true)} */ className='cPanelProductsContainer__btnCreateProduct__btn'>Crear venta</button>
                </div>

                <div className='cPanelProductsContainer__quantityProducts'>
                    <div className='cPanelProductsContainer__quantityProducts__prop'>Cantidad de ventas: {objetosFiltrados.length}</div>        
                </div>

                <div className="cPanelProductsContainer__dateFilter">
                    <button onClick={goToPreviousDay}>Anterior</button>
                    <span>{formatDateToString(selectedDate)}</span>
                    <button onClick={goToNextDay}>Siguiente</button>
                </div>

                {
                    objetosFiltrados.length != 0 &&
                    <div className='cPanelProductsContainer__headerTableContainer'>

                        <div className="cPanelProductsContainer__headerTableContainer__headerTable">

                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Código</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Estado</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Precio</div>
                            <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Comprador</div>
                            {/* <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Lugar de venta</div> */}

                        </div>

                    </div>
                }


                <div className="cPanelProductsContainer__productsTable">

                    {
                        isLoadingTickets ? 
                            <>
                                <div className="catalogContainer__grid__catalog__isLoadingLabel">
                                    Cargando ventas&nbsp;&nbsp;<Spinner/>
                                </div>
                            </>
                        :
                        filteredByDate.map((ticket) => (
                            <>
                                <ItemTicket
                                ticket={ticket}
                                fetchTickets={fetchTickets}
                                />
                            </>
                        ))}
                        <div className='cPanelProductsContainer__btnsPagesContainer'>
                            <button className='cPanelProductsContainer__btnsPagesContainer__btn'
                                disabled={!pageInfo.hasPrevPage}
                                onClick={() => fetchTickets(pageInfo.prevPage)}
                                >
                                Anterior
                            </button>
                            
                            <span>Página {pageInfo.page} de {pageInfo.totalPages}</span>

                            <button className='cPanelProductsContainer__btnsPagesContainer__btn'
                                disabled={!pageInfo.hasNextPage}
                                onClick={() => fetchTickets(pageInfo.nextPage)}
                                >
                                Siguiente
                            </button>
                        </div>

                </div>

            </div>  

        </>

    )

}

export default Tickets