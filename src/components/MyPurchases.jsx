import {useState,useEffect} from 'react'
import NavBar from './NavBar'
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import ItemTicket from './ItemTicket';
import { Link, useNavigate } from 'react-router-dom';

const MyPurchases = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState('');
    const [categories, setCategories] = useState([]);
    const [userCart, setUserCart] = useState({});
    const [showLogOutContainer, setShowLogOutContainer] = useState(false);
    const [cookieValue, setCookieValue] = useState('');
    const [isLoadingTickets, setIsLoadingTickets] = useState(true);
    const [inputFilteredPurchases, setInputFilteredPurchases] = useState('');
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

    function filtrarPorTitle(valorIngresado) {
        const valorMinusculas = valorIngresado.toLowerCase();
        const objetosFiltrados = tickets.filter(objeto => {
            const nombreMinusculas = objeto.payer_email.toLowerCase();
            return nombreMinusculas.includes(valorMinusculas);
        });
        return objetosFiltrados;
    }
    const objetosFiltrados = filtrarPorTitle(inputFilteredPurchases);

    const ticketsOrdenados = [...objetosFiltrados].sort((a, b) => new Date(b.purchase_datetime) - new Date(a.purchase_datetime));

    const ticketsByVisibilityTrue = ticketsOrdenados.filter(ticket => ticket.visibility.user == true)
    //console.log(ticketsByVisibilityTrue)

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

    const handleInputFilteredPurchases = (e) => {
        const value = e.target.value;
        setInputFilteredPurchases(value)
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

            <div className='myPurchasesContainer'>
                
                <div className='myPurchasesContainer__title'>
                    <div className='myPurchasesContainer__title__prop'>Mis compras</div>        
                </div>

                <div className='myPurchasesContainer__inputSearchPurchase'>
                    <input type="text" onChange={handleInputFilteredPurchases} value={inputFilteredPurchases} placeholder='Buscar por email' className='myPurchasesContainer__inputSearchPurchase__input' name="" id="" />
                </div>

                {
                    ticketsByVisibilityTrue.length != 0 &&
                    <div className='myPurchasesContainer__quantityPurchases'>
                        <div className='myPurchasesContainer__quantityPurchases__prop'>Cantidad de compras: {ticketsByVisibilityTrue.length}</div>        
                    </div>
                }

                {
                    ticketsByVisibilityTrue.length != 0 &&
                    <div className='myPurchasesContainer__headerTableContainer'>

                        <div className="myPurchasesContainer__headerTableMyPurchasesContainer__headerTable">

                            <div className="myPurchasesContainer__headerTableMyPurchasesContainer__headerTable__item">Fecha y hora</div>
                            <div className="myPurchasesContainer__headerTableMyPurchasesContainer__headerTable__item">Código</div>
                            <div className="myPurchasesContainer__headerTableMyPurchasesContainer__headerTable__item">Productos</div>
                            <div className="myPurchasesContainer__headerTableMyPurchasesContainer__headerTable__item">Precio</div>

                        </div>

                    </div>
                }


                <div className="myPurchasesContainer__purchasesTable">

                    {
                        isLoadingTickets ? 
                            <>
                                <div className="myPurchasesContainer__purchasesTable__isLoadingLabel">
                                    Cargando compras&nbsp;&nbsp;<Spinner/>
                                </div>
                            </>
                        : ticketsByVisibilityTrue.length != 0 ?

                            <>
                                {
                                    ticketsByVisibilityTrue.map((ticket, index) => {
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

                                        // Verificar si es la primera iteración o si cambió la fecha
                                        const previousDate = index > 0
                                            ? new Date(ticketsOrdenados[index - 1].purchase_datetime).toLocaleDateString('es-AR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })
                                            : null;

                                        const isNewDateGroup = formattedDate !== previousDate;

                                        return (
                                            <div key={ticket._id}>
                                                {isNewDateGroup && (
                                                    <div className="myPurchasesContainer__purchasesTable__dayContainer">
                                                        <strong className='myPurchasesContainer__purchasesTable__dayContainer__day'>📅 {formattedDate}</strong>
                                                        {/* <strong className='myPurchasesContainer__purchasesTable__dayContainer__day'></strong> */}
                                                    </div>
                                                )}
                                                <ItemTicket
                                                    ticket={ticket}
                                                    fechaHora={`${formattedDate} ${formattedTime}`}
                                                    fetchTickets={fetchTickets}
                                                    email={user.email}
                                                    role={user.role}
                                                />
                                            </div>
                                        );
                                    })
                                }

                                <div className='myPurchasesContainer__btnsPagesContainer'>
                                    <button className='myPurchasesContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfo.hasPrevPage}
                                        onClick={() => fetchTickets(pageInfo.prevPage, "", user.email)}
                                        >
                                        Anterior
                                    </button>
                                    
                                    <span>Página {pageInfo.page} de {pageInfo.totalPages}</span>

                                    <button className='myPurchasesContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfo.hasNextPage}
                                        onClick={() => fetchTickets(pageInfo.nextPage, "", user.email)}
                                        >
                                        Siguiente
                                    </button>
                                </div>
                            </>
                            
                        :
                            <div className="myPurchasesContainer__purchasesTable__isLoadingLabel">
                                <div>Aún no existen compras</div>
                                <Link to={'/#catalog'} className='myPurchasesContainer__purchasesTable__isLoadingLabel__label'>
                                    Ir a comprar
                                </Link>
                            </div>

                    }

                </div>

            </div>  
        
        </>

    )

}

export default MyPurchases