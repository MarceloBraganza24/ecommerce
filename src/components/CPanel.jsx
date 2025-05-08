import React, {useState,useEffect,useContext,useRef} from 'react'
import {useJsApiLoader, StandaloneSearchBox} from '@react-google-maps/api'
import NavBar from './NavBar'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner';

const CPanel = () => {
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [deletingIdCategory, setDeletingIdCategory] = useState(null);

    const [creatingAddress, setCreatingAddress] = useState(false);
    const [deletingIdAddress, setDeletingIdAddress] = useState(null);

    const [creatingCoupon, setCreatingCoupon] = useState(false);
    const [deletingIdCoupon, setDeletingIdCoupon] = useState(null);



    const [user, setUser] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');
    const [codeCoupon, setCodeCoupon] = useState('');
    const [discount, setDiscount] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [categories, setCategories] = useState([]);
    const [userCart, setUserCart] = useState({});
    const [cookieValue, setCookieValue] = useState('');
    const [sellerAddresses, setSellerAddresses] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [showLogOutContainer, setShowLogOutContainer] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [loadingCoupons, setLoadingCoupons] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(user.isLoggedIn) {
            setShowLogOutContainer(true)
        }
    }, [user.isLoggedIn]);

    const couponsByExpirationDate = coupons.sort((a, b) => new Date(a.expiration_date) - new Date(b.expiration_date));

    const [addressData, setAddressData] = useState({
        street: "",
        street_number: "",
        locality: "",
        province: "",
        postal_code: "",
    });

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
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

    const fetchSellerAddresses = async () => {
        try {
            setLoadingAddresses(true)
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
            setLoadingAddresses(false)
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
            setLoadingCategories(true)
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
            setLoadingCategories(false)
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

    const fetchCoupons = async () => {
        try {
            setLoadingCoupons(true)
            const response = await fetch('http://localhost:8081/api/coupons');
            const data = await response.json();
            if (response.ok) {
                setCoupons(data.data); 
            } else {
                toast('Error al cargar los cupones', {
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
            setLoadingCoupons(false)
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
            setDeletingIdCategory(categoryId);
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
        } finally {
            setDeletingIdCategory(null);
        }
    };

    const handleDeleteSellerAddress = async (sellerAddressId) => {
        try {
            setDeletingIdAddress(sellerAddressId)
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
        } finally {
            setDeletingIdAddress(false)
        }
    };

    const handleDeleteCoupons = async (couponId) => {
        try {
            setDeletingIdCoupon(couponId)
            const response = await fetch(`http://localhost:8081/api/coupons/${couponId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast('Cupón eliminado', {
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
                fetchCoupons();
            } else {
                toast('Error al eliminar el cupón', {
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
            setDeletingIdCoupon(null)
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
            setCreatingCategory(true);
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
                    className: "custom-toast",
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
        } finally {
            setCreatingCategory(false);
        }
    };

    const handleSubmitAddress = async () => {
        if(!addressData.street || !addressData.street_number || !addressData.locality || !addressData.province) {
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
            setCreatingAddress(true)
            const sellerAddress = {
                street: addressData.street,
                street_number: addressData.street_number,
                locality: addressData.locality,
                province: addressData.province,
                postal_code: addressData.postal_code,
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
                    province: '',
                    postal_code: '',
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
        } finally {
            setCreatingAddress(false)
        }
    };

    const handleSubmitCoupon = async () => {
        if (!codeCoupon.trim() || !discount || !expirationDate) {
            toast('Todos los campos son obligatorios', {
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
            return
        }
        if (isNaN(discount) || discount <= 0) {
            toast('El descuento debe ser un número válido', {
                position: "top-right",
                autoClose: 1500,
                theme: "dark",
                className: "custom-toast",
            });
            return;
        }

        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const coupon_datetime = `${year}-${month}-${day} ${hours}:${minutes}`;

        try {
            setCreatingCoupon(true)
            const coupon = {
                code: codeCoupon,
                discount: Number(discount),
                expiration_date: new Date(expirationDate).toISOString(),
                coupon_datetime 
            }
            const response = await fetch('http://localhost:8081/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(coupon),
            });
            const data = await response.json();
            if(data.error === 'There is already a coupon with that code') {
                toast('Ya existe un cupón con ese código!', {
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
                toast('Cupón creado con éxito', {
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
                setCodeCoupon('')
                setDiscount('')
                setExpirationDate('');
                fetchCoupons()
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
        } finally {
            setCreatingCoupon(false)
        }
    };

    const handleOnPlacesChanged = () => {
        let address = inputRef.current.getPlaces()
        const desglocedAddress = address.map(dm => dm.address_components)
        const prop = desglocedAddress[0]
        const street = prop.find(dm => dm.types[0] == "route")
        const street_number = prop.find(dm => dm.types[0] == "street_number")
        const locality = prop.find(dm => dm.types[0] == "locality")
        const province = prop.find(dm => dm.types[0] == "administrative_area_level_1")
        const postal_code = prop.find(dm => dm.types[0] == "postal_code")
        setAddressData({
            street: street.long_name || "",
            street_number: street_number.long_name || "",
            locality: locality.long_name || "",
            province: province.long_name || "",
            postal_code: postal_code.long_name || "",
        });
    }

    const inputRef = useRef(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCypLLA0vWKs_lvw5zxCuGJC28iEm9Rqk8',
        libraries:["places"]
    })

    const fetchUser = async (cookieValue) => {
        try {
            const response = await fetch(`http://localhost:8081/api/sessions/current?cookie=${cookieValue}`)
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
        fetchSellerAddresses();
        fetchCoupons();
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

            <div className="cPanelContainer">

                <div className="cPanelContainer__title">

                    <div className="cPanelContainer__title__prop">Panel de control</div>

                </div>

                {
                    loadingCategories ?
                        <>
                            <div className="cPanelContainer__existingCategories__loadingProps">
                                Cargando categorías&nbsp;&nbsp;<Spinner/>
                            </div>
                        </>
                    :
                
                        <>
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
                                                {/* <button className='cPanelContainer__existingCategories__itemCategory__category__btn' onClick={() => handleDeleteCategory(category._id)}>
                                                    Eliminar
                                                </button> */}
                                                <button
                                                    className='cPanelContainer__existingCategories__itemCategory__category__btn'
                                                    onClick={() => handleDeleteCategory(category._id)}
                                                    disabled={deletingIdCategory === category._id}
                                                    >
                                                    {deletingIdCategory === category._id ? <Spinner/> : 'Eliminar'}
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
                                    {/* <button className='cPanelContainer__newCategoryForm__form__btn' type="submit">Crear categoría</button> */}
                                    <button
                                        className='cPanelContainer__newCategoryForm__form__btn'
                                        type="submit"
                                        disabled={creatingCategory}
                                        >
                                        {creatingCategory ? <Spinner/> : 'Crear categoría'}
                                    </button>
                                </form>
                            </div>
                        </>
                }

                {
                    loadingAddresses ?
                        <>
                            <div className="cPanelContainer__existingCategories__loadingProps">
                                Cargando domicilios&nbsp;&nbsp;<Spinner/>
                            </div>
                        </>
                    :
                        <>
                        

                            <div className="cPanelContainer__existingSellerAddresses">
                                <h2 className='cPanelContainer__existingSellerAddresses__title'>Domicilios del vendedor</h2>
                                {sellerAddresses.length === 0 ? (
                                    <p className='cPanelContainer__existingSellerAddresses__withOutSellerAddressesLabel'>No hay domicilios aún</p>
                                    ) 
                                    :
                                    (
                                    <ul className='cPanelContainer__existingSellerAddresses__itemSellerAddress'>
                                        {sellerAddresses.map((item) => (
                                            <li className='cPanelContainer__existingSellerAddresses__itemSellerAddress__sellerAddress' key={item._id}>
                                                <span className='cPanelContainer__existingSellerAddresses__itemSellerAddress__sellerAddress__address'>{capitalizeFirstLetter(item.street)} {capitalizeFirstLetter(item.street_number)}, {capitalizeFirstLetter(item.locality)}, {item.province}</span>
                                                {/* <button className='cPanelContainer__existingSellerAddresses__itemSellerAddress__sellerAddress__btn' onClick={() => handleDeleteSellerAddress(item._id)}>
                                                    Eliminar
                                                </button> */}
                                                <button
                                                    className='cPanelContainer__existingSellerAddresses__itemSellerAddress__sellerAddress__btn'
                                                    onClick={() => handleDeleteSellerAddress(item._id)}
                                                    disabled={deletingIdAddress == item._id}
                                                    >
                                                    {deletingIdAddress == item._id ? <Spinner/> : 'Eliminar'}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="cPanelContainer__createNewSellerAddress">

                                <h2 className='cPanelContainer__createNewSellerAddress__title'>Crear nuevo domicilio</h2>
                                {
                                    isLoaded && 
                                    <StandaloneSearchBox onLoad={(ref) => inputRef.current = ref} onPlacesChanged={handleOnPlacesChanged}>
                                        <input id='inputCreateAddress' className='cPanelContainer__createNewSellerAddress__input' type="text" placeholder='Buscar dirección' />
                                    </StandaloneSearchBox>
                                }
                                <div className='cPanelContainer__createNewSellerAddress__label'>Calle: {addressData.street}</div>
                                <div className='cPanelContainer__createNewSellerAddress__label'>Número: {addressData.street_number}</div>
                                <div className='cPanelContainer__createNewSellerAddress__label'>Localidad: {addressData.locality}</div>
                                <div className='cPanelContainer__createNewSellerAddress__label'>Provincia: {addressData.province}</div>
                                {/* <button className='cPanelContainer__createNewSellerAddress__btn' onClick={handleSubmitAddress}>Guardar</button> */}
                                <button
                                    className='cPanelContainer__createNewSellerAddress__btn'
                                    disabled={creatingAddress}
                                    onClick={() => handleSubmitAddress()}
                                    >
                                    {creatingAddress ? <Spinner/> : 'Guardar'}
                                </button>
                                
                            </div>
                        </>
                }

                {
                    loadingCoupons ?
                        <>
                            <div className="cPanelContainer__existingCategories__loadingProps">
                                Cargando cupones&nbsp;&nbsp;<Spinner/>
                            </div>
                        </>
                    :
                    <>
                    

                        <div className="cPanelContainer__existingCoupons">
                            <h2 className='cPanelContainer__existingCoupons__title'>Cupones</h2>
                            {couponsByExpirationDate.length === 0 ? (
                                <p className='cPanelContainer__existingCoupons__withOutCouponsLabel'>No hay cupones aún</p>
                                ) 
                                :
                                (
                                    <ul className='cPanelContainer__existingCoupons__itemCoupons'>
                                        <li className='cPanelContainer__existingCoupons__itemCoupons__couponsHeader'>
                                            <span className='cPanelContainer__existingCoupons__itemCoupons__couponsHeader__coupon'>Código</span>
                                            <span className='cPanelContainer__existingCoupons__itemCoupons__couponsHeader__coupon'>Descuento (%)</span>
                                            <span className='cPanelContainer__existingCoupons__itemCoupons__couponsHeader__coupon'>Fecha de expiración</span>
                                        </li>
                                    {couponsByExpirationDate.map((item) => {
                                        const fechaUTC = new Date(item.expiration_date);
                                        const fechaLocal = new Date(fechaUTC.getTime() + fechaUTC.getTimezoneOffset() * 60000);
                                        
                                        return (
                                            <li className='cPanelContainer__existingCoupons__itemCoupons__coupons' key={item._id}>
                                                <span className='cPanelContainer__existingCoupons__itemCoupons__coupons__coupon'>{item.code}</span>
                                                <span className='cPanelContainer__existingCoupons__itemCoupons__coupons__coupon'>{item.discount}%</span>
                                                <span className='cPanelContainer__existingCoupons__itemCoupons__coupons__coupon'>
                                                    {fechaLocal.toLocaleDateString("es-AR", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit"
                                                    })}
                                                </span>
                                                {/* <button className='cPanelContainer__existingCoupons__itemCoupons__coupons__btn' onClick={() => handleDeleteCoupons(item._id)}>
                                                    Eliminar
                                                </button> */}
                                                <button
                                                    className='cPanelContainer__existingCoupons__itemCoupons__coupons__btn'
                                                    onClick={() => handleDeleteCoupons(item._id)}
                                                    disabled={deletingIdCoupon == item._id}
                                                    >
                                                    {deletingIdCoupon == item._id ? <Spinner/> : 'Eliminar'}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                                
                            )}
                        </div>

                        <div className="cPanelContainer__createNewCoupons">

                            <h2 className='cPanelContainer__createNewCoupons__title'>Crear nuevo cupón</h2>
                            <div>Código</div>
                            <input
                            className='cPanelContainer__createNewCoupons__input'
                            type="text"
                            placeholder='Código cupón'
                            value={codeCoupon}
                            onChange={(e) => setCodeCoupon(e.target.value)}
                            required
                            />
                            <div>Descuento</div>
                            <input
                                className='cPanelContainer__createNewCoupons__input'
                                type="number"
                                placeholder='Descuento (%)'
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                required
                                />
                            <div>Fecha de expiración</div>
                            <input
                                className='cPanelContainer__createNewCoupons__input'
                                type="date"
                                placeholder='Fecha de expiración'
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                required
                                />
                            {/* <button className='cPanelContainer__createNewCoupons__btn' onClick={handleSubmitCoupon}>Guardar</button> */}
                            <button
                                className='cPanelContainer__createNewCoupons__btn'
                                disabled={creatingCoupon}
                                onClick={() => handleSubmitCoupon()}
                                >
                                {creatingCoupon ? <Spinner/> : 'Guardar'}
                            </button>
                            
                        </div>
                    </>
                }

            </div>

        </>

    )

}

export default CPanel