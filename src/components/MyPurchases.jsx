import {useState,useEffect} from 'react'
import NavBar from './NavBar'
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import ItemTicket from './ItemTicket';
import { useNavigate } from 'react-router-dom';

const MyPurchases = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState('');
    const [categories, setCategories] = useState([]);
    const [userCart, setUserCart] = useState({});
    const [showLogOutContainer, setShowLogOutContainer] = useState(false);
    const [cookieValue, setCookieValue] = useState('');
    const [isLoadingTickets, setIsLoadingTickets] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });   

    useEffect(() => {
        if(user.isLoggedIn) {
            setShowLogOutContainer(true)
        }
    }, [user.isLoggedIn]);

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
        if (user?.email) {
            fetchTickets(1, "", user.email);
        }
    }, [user]);

    const fetchTickets = async (page = 1, search = "", email = "") => {
        try {
            setIsLoadingTickets(true)
            const response = await fetch(`http://localhost:8081/api/tickets/byPageAndEmail?page=${page}&search=${search}&email=${email}`)
            const ticketsAll = await response.json();
            if (response.ok) {
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
                toast('Error al cargar las compras', {
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
            fetchUser(cookieValue);
        } else {
            navigate('/')
        }
        fetchCategories();
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
                fetchUser={fetchUser}
                />
            </div>

            <div className='cPanelSalesContainer'>
                
                <div className='cPanelSalesContainer__title'>
                    <div className='cPanelSalesContainer__title__prop'>Mis compras</div>        
                </div>

                {/* <div className='cPanelSalesContainer__inputSearchSale'>
                    <input type="text" onChange={handleInputFilteredSales} value={inputFilteredTickets} placeholder='Buscar por email' className='cPanelSalesContainer__inputSearchSale__input' name="" id="" />
                </div> */}

                {/* <div className='cPanelSalesContainer__btnCreateSale'>
                    <Link to={'/#catalog'} className='cPanelSalesContainer__btnCreateSale__btn'>
                        Crear venta
                    </Link>
                </div> */}

                <div className='cPanelSalesContainer__quantitySales'>
                    <div className='cPanelSalesContainer__quantitySales__prop'>Cantidad de compras: {tickets.length}</div>        
                </div>

                {/* <div className="cPanelSalesContainer__dateFilter">
                    <button className='cPanelSalesContainer__dateFilter__btn' onClick={goToPreviousDay}>Anterior</button>
                    <span className='cPanelSalesContainer__dateFilter__date'>{formatDateToString(selectedDate)}</span>
                    <button className='cPanelSalesContainer__dateFilter__btn' onClick={goToNextDay}>Siguiente</button>
                </div> */}

                {
                    tickets.length != 0 &&
                    <div className='cPanelSalesContainer__headerTableContainer'>

                        <div className="cPanelSalesContainer__headerTableContainer__headerTable">

                            <div className="cPanelSalesContainer__headerTableContainer__headerTable__item">Código</div>
                            <div className="cPanelSalesContainer__headerTableContainer__headerTable__item">Estado</div>
                            <div className="cPanelSalesContainer__headerTableContainer__headerTable__item">Precio</div>
                            <div className="cPanelSalesContainer__headerTableContainer__headerTable__item">Operador</div>

                        </div>

                    </div>
                }


                <div className="cPanelSalesContainer__salesTable">

                    {
                        isLoadingTickets ? 
                            <>
                                <div className="cPanelSalesContainer__salesTable__isLoadingLabel">
                                    Cargando ventas&nbsp;&nbsp;<Spinner/>
                                </div>
                            </>
                        : tickets.length != 0 ?

                            <>
                                {
                                    tickets.map((ticket) => (
                                        <ItemTicket
                                        ticket={ticket}
                                        fetchTickets={fetchTickets}
                                        />
                                    ))
                                }
                                <div className='cPanelSalesContainer__btnsPagesContainer'>
                                    <button className='cPanelSalesContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfo.hasPrevPage}
                                        onClick={() => fetchTickets(pageInfo.prevPage)}
                                        >
                                        Anterior
                                    </button>
                                    
                                    <span>Página {pageInfo.page} de {pageInfo.totalPages}</span>

                                    <button className='cPanelSalesContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfo.hasNextPage}
                                        onClick={() => fetchTickets(pageInfo.nextPage)}
                                        >
                                        Siguiente
                                    </button>
                                </div>
                            </>
                            
                        :
                            <div className="cPanelSalesContainer__salesTable__isLoadingLabel">
                                Aún no existen compras
                            </div>

                    }

                </div>

            </div>  
        
        </>

    )

}

export default MyPurchases