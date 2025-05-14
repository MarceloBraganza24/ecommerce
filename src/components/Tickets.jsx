import React, {useState,useEffect} from 'react'
import NavBar from './NavBar';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import ItemTicket from './ItemTicket';
import { Link, useNavigate } from 'react-router-dom';

const Tickets = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tickets, setTickets] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
    });   
    // console.log(tickets)
    // console.log(pageInfo)

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState('');
    const [categories, setCategories] = useState([]);
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
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Enero = 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const filteredByDate = objetosFiltrados.filter(ticket => {
        const ticketDate = new Date(ticket.purchase_datetime);
        return (
            ticketDate.getFullYear() === selectedDate.getFullYear() &&
            ticketDate.getMonth() === selectedDate.getMonth() &&
            ticketDate.getDate() === selectedDate.getDate()
        );
    });

    const ticketsOrdenados = [...filteredByDate].sort((a, b) => new Date(b.purchase_datetime) - new Date(a.purchase_datetime));

    //console.log(filteredByDate)

    useEffect(() => {
        if (user?.email) {
            fetchTickets(1, "", user.email);
        }
    }, [user]);

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

    const fetchTickets = async (page = 1, search = "") => {
        try {
            setIsLoadingTickets(true)
            const response = await fetch(`http://localhost:8081/api/tickets/byPage?page=${page}&search=${search}`)
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
            fetchUser(cookieValue);
        } else {
            navigate('/')
        }
        fetchCategories();
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

            <div className='cPanelSalesContainer'>
                
                <div className='cPanelSalesContainer__title'>
                    <div className='cPanelSalesContainer__title__prop'>Ventas</div>        
                </div>

                <div className='cPanelSalesContainer__inputSearchSale'>
                    <input type="text" onChange={handleInputFilteredSales} value={inputFilteredTickets} placeholder='Buscar por email' className='cPanelSalesContainer__inputSearchSale__input' name="" id="" />
                </div>

                <div className='cPanelSalesContainer__btnCreateSale'>
                    <Link to={'/#catalog'} className='cPanelSalesContainer__btnCreateSale__btn'>
                        Crear venta
                    </Link>
                </div>

                {
                    ticketsOrdenados.length != 0 &&
                    <div className='cPanelSalesContainer__quantitySales'>
                        <div className='cPanelSalesContainer__quantitySales__prop'>Cantidad de ventas: {ticketsOrdenados.length}</div>        
                    </div>
                }

                {
                    !isLoadingTickets &&
                    <div className="cPanelSalesContainer__dateFilter">
                        <button className='cPanelSalesContainer__dateFilter__btn' onClick={goToPreviousDay}>Anterior</button>
                        <span className='cPanelSalesContainer__dateFilter__date'>{formatDateToString(selectedDate)}</span>
                        <button className='cPanelSalesContainer__dateFilter__btn' onClick={goToNextDay}>Siguiente</button>
                    </div>
                }

                {
                    ticketsOrdenados.length != 0 &&
                    <div className='cPanelSalesContainer__headerTableContainer'>

                        <div className="cPanelSalesContainer__headerTableCPanelSalesContainer__headerTable">

                            <div className="cPanelSalesContainer__headerTableCPanelSalesContainer__headerTable__item">Fecha y hora</div>
                            <div className="cPanelSalesContainer__headerTableCPanelSalesContainer__headerTable__item">Código</div>
                            <div className="cPanelSalesContainer__headerTableCPanelSalesContainer__headerTable__item">Productos</div>
                            <div className="cPanelSalesContainer__headerTableCPanelSalesContainer__headerTable__item">Precio</div>
                            <div className="cPanelSalesContainer__headerTableCPanelSalesContainer__headerTable__item">Operador</div>
                            <div className="cPanelSalesContainer__headerTableCPanelSalesContainer__headerTable__item">Rol</div>

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
                        : ticketsOrdenados.length != 0 ?

                            <>
                                {
                                    ticketsOrdenados.map((ticket) => {
                                        const currentDate = new Date(ticket.purchase_datetime);
                                        const formattedDate = currentDate.toLocaleDateString('es-AR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        });

                                        const formattedTime = currentDate.toLocaleTimeString('es-AR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        });

                                        return (
                                            <ItemTicket
                                                ticket={ticket}
                                                fechaHora={`${formattedDate} ${formattedTime}`}
                                                fetchTickets={fetchTickets}
                                                email={user.email}
                                                role={user.role}
                                            />
                                        );
                                        
                                    })
                                }
                                <div className='cPanelSalesContainer__btnsPagesContainer'>
                                    <button className='cPanelSalesContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfo.hasPrevPage}
                                        onClick={() => fetchTickets(pageInfo.prevPage, "", user.email)}
                                        >
                                        Anterior
                                    </button>
                                    
                                    <span>Página {pageInfo.page} de {pageInfo.totalPages}</span>

                                    <button className='cPanelSalesContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfo.hasNextPage}
                                        onClick={() => fetchTickets(pageInfo.nextPage, "", user.email)}
                                        >
                                        Siguiente
                                    </button>
                                </div>
                            </>
                            
                        :
                            <div className="cPanelSalesContainer__salesTable__isLoadingLabel">
                                Aún no existen ventas
                            </div>

                    }

                </div>

            </div>  

        </>

    )

}

export default Tickets