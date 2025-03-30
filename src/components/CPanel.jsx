import React, {useState,useEffect,useContext,useRef} from 'react'
import {GoogleMap, useJsApiLoader, StandaloneSearchBox} from '@react-google-maps/api'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom'
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';

const CPanel = () => {
    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    //const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [sellerAddresses, setSellerAddresses] = useState([]);
    const [addressData, setAddressData] = useState({
        street: "",
        street_number: "",
        locality: "",
    });

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const fetchSellerAddresses = async () => {
        try {
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

    const handleDeleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/categories/${categoryId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast('Categoría eliminada', {
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
                fetchCategories();
            } else {
                toast('Error al eliminar la categoría', {
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

    const handleDeleteSellerAddress = async (sellerAddressId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/sellerAddresses/${sellerAddressId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast('Domicilio eliminado', {
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
                fetchSellerAddresses();
            } else {
                toast('Error al eliminar la domicilio', {
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

    const handleSubmitCategory = async (e) => {
        e.preventDefault();
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const category_datetime = `${year}-${month}-${day} ${hours}:${minutes}`;

        if (!categoryName) {
            toast("Por favor, ingresa un nombre para la categoría", {
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

        try {
            const response = await fetch('http://localhost:8081/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName, category_datetime: category_datetime}),
            });
            const data = await response.json();
            if(data.error === 'There is already a category with that name') {
                toast('Ya existe una categoría con ese nombre!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (response.ok) {
                toast('Categoría creada con éxito', {
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
                setCategoryName('');
                fetchCategories()
            } 
        } catch (error) {
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

    const handleSubmitAddress = async (e) => {
        e.preventDefault();
        if(!addressData.street || !addressData.street_number || !addressData.locality) {
            toast('Debes ingresar un domicilio', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                className: "custom-toast",
            });
        }

        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const sellerAddress_datetime = `${year}-${month}-${day} ${hours}:${minutes}`;


        try {
            const sellerAddress = {
                street: addressData.street,
                street_number: addressData.street_number,
                locality: addressData.locality,
                sellerAddress_datetime 
            }
            const response = await fetch('http://localhost:8081/api/sellerAddresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sellerAddress),
            });
            const data = await response.json();
            if(data.error === 'There is already an address with that street') {
                toast('Ya existe una domicilio con esa calle!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    className: "custom-toast",
                });
            } else if (response.ok) {
                toast('Domicilio creado con éxito', {
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
                setAddressData({
                    street: '',
                    street_number: '',
                    locality: '',
                });
                document.getElementById('inputCreateAddress').value = ''
                fetchSellerAddresses()
            } 
        } catch (error) {
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

    const handleOnPlacesChanged = () => {
        let address = inputRef.current.getPlaces()
        const desglocedAddress = address.map(dm => dm.address_components)
        const prop = desglocedAddress[0]
        const street = prop.find(dm => dm.types[0] == "route")
        const street_number = prop.find(dm => dm.types[0] == "street_number")
        const locality = prop.find(dm => dm.types[0] == "locality")
        setAddressData({
            street: street.long_name || "",
            street_number: street_number.long_name || "",
            locality: locality.long_name || "",
        });
    }

    const inputRef = useRef(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCypLLA0vWKs_lvw5zxCuGJC28iEm9Rqk8',
        libraries:["places"]
    })

    

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
        fetchSellerAddresses();
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

            <div className="cPanelContainer">

                <div className="cPanelContainer__title">

                    <div className="cPanelContainer__title__prop">Panel de control</div>

                </div>

                <div className="cPanelContainer__existingCategories">
                    <h2 className='cPanelContainer__existingCategories__title'>Categorías existentes</h2>
                    {categories.length === 0 ? (
                        <p className='cPanelContainer__existingCategories__withOutCategoriesLabel'>No hay categorías aún</p>
                        ) 
                        :
                        (
                        <ul className='cPanelContainer__existingCategories__itemCategory'>
                            {categories.map((category) => (
                                <li className='cPanelContainer__existingCategories__itemCategory__category' key={category._id}>
                                    <span className='cPanelContainer__existingCategories__itemCategory__category__name'>{capitalizeFirstLetter(category.name)}</span>
                                    <button className='cPanelContainer__existingCategories__itemCategory__category__btn' onClick={() => handleDeleteCategory(category._id)}>
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="cPanelContainer__newCategoryForm">
                    <h2 className='cPanelContainer__newCategoryForm__title'>Crear nueva categoría</h2>
                    <form onSubmit={handleSubmitCategory} className='cPanelContainer__newCategoryForm__form'>
                        <input
                        className='cPanelContainer__newCategoryForm__form__input'
                        type="text"
                        id="categoryName"
                        placeholder='Nombre categoría'
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        />
                        <button className='cPanelContainer__newCategoryForm__form__btn' type="submit">Crear categoría</button>
                    </form>
                </div>

                <div className='cPanelContainer__sellerAddressesContainer'>

                    <div className="cPanelContainer__sellerAddressesContainer__existingSellerAddresses">
                        <h2 className='cPanelContainer__sellerAddressesContainer__existingSellerAddresses__title'>Domicilios del vendedor</h2>
                        {sellerAddresses.length === 0 ? (
                            <p className='cPanelContainer__sellerAddressesContainer__existingSellerAddresses__withOutSellerAddressesLabel'>No hay domicilios aún</p>
                            ) 
                            :
                            (
                            <ul className='cPanelContainer__sellerAddressesContainer__existingSellerAddresses__itemSellerAddress'>
                                {sellerAddresses.map((item) => (
                                    <li className='cPanelContainer__sellerAddressesContainer__existingSellerAddresses__itemSellerAddress__sellerAddress' key={item._id}>
                                        <span className='cPanelContainer__sellerAddressesContainer__existingSellerAddresses__itemSellerAddress__sellerAddress__address'>{capitalizeFirstLetter(item.street)} {capitalizeFirstLetter(item.street_number)}, {capitalizeFirstLetter(item.locality)}</span>
                                        <button className='cPanelContainer__sellerAddressesContainer__existingSellerAddresses__itemSellerAddress__sellerAddress__btn' onClick={() => handleDeleteSellerAddress(item._id)}>
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="cPanelContainer__sellerAddressesContainer__createNewSellerAddress">

                        <h2 className='cPanelContainer__sellerAddressesContainer__createNewSellerAddress__title'>Crear nuevo domicilio</h2>
                        {
                            isLoaded && 
                            <StandaloneSearchBox onLoad={(ref) => inputRef.current = ref} onPlacesChanged={handleOnPlacesChanged}>
                                <input id='inputCreateAddress' className='cPanelContainer__sellerAddressesContainer__createNewSellerAddress__input' type="text" placeholder='Buscar dirección' />
                            </StandaloneSearchBox>
                        }
                        <div className='cPanelContainer__sellerAddressesContainer__createNewSellerAddress__label'>Calle: {addressData.street}</div>
                        <div className='cPanelContainer__sellerAddressesContainer__createNewSellerAddress__label'>Número: {addressData.street_number}</div>
                        <div className='cPanelContainer__sellerAddressesContainer__createNewSellerAddress__label'>Localidad: {addressData.locality}</div>
                        <button className='cPanelContainer__sellerAddressesContainer__createNewSellerAddress__btn' onClick={handleSubmitAddress}>Guardar</button>
                        
                    </div>

                </div>

            </div>

        </>

    )

}

export default CPanel