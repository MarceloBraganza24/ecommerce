import React, { useState,useEffect,useRef,useContext  } from 'react';
import {GoogleMap, useJsApiLoader, StandaloneSearchBox} from '@react-google-maps/api'
import NavBar from './NavBar'
import DeliveryAddress from './DeliveryAddress'
import Footer from './Footer'
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

const DeliveryForm = () => {
    const navigate = useNavigate();
    const {isLoggedIn,login,logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [cookieValue, setCookieValue] = useState('');
    //console.log(user)
    const [products, setProducts] = useState([]);
    const [deliveryForms, setDeliveryForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [userCart, setUserCart] = useState({});
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [deliveryAddressFormData, setDeliveryAddressFormData] = useState({
        street: "",
        street_number: "",
        locality: "",
    });
    const [formData, setFormData] = useState({
        street: "",
        street_number: "",
        locality: "",
        province: "",
        country: "",
        postal_code: "",
        dpto: "",
        indications: "",
        name: "",
        phone: "",
        owner: user?user.email : ""
    });

    const inputRef = useRef(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCypLLA0vWKs_lvw5zxCuGJC28iEm9Rqk8',
        libraries:["places"]
    })

    useEffect(() => {
        if (user?.selected_addresses) {
            setSelectedAddress(user.selected_addresses);
        }
    }, [user]);

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
    

    const handleSelectAddress = async (address) => {
        setSelectedAddress(address);
        const { _id, __v, ...cleanAddress } = address;
        try {
            const response = await fetch(`http://localhost:8081/api/users/address-selected/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ selected_addresses: cleanAddress }),
            });
    
            if (response.ok) {
                toast('Domicilio actualizado con éxito', {
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
                fetchUser(cookieValue)
            } else {
                toast('Error al actualizar el domicilio', {
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
            console.error("Error al actualizar la dirección:", error);
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

    const fetchDeliveryForm = async () => {
        try {
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
        const country = prop.find(dm => dm.types[0] == "country")
        setFormData({
            street: street.long_name || "",
            street_number: street_number.long_name || "",
            locality: locality.long_name || "",
            province: province.long_name || "",
            country: country.long_name || "",
            postal_code: postal_code.long_name || "",
            dpto: "",
            indications: "",
        });
    }

    const handleBtnSaveDeliveryForm = async() => {
        try {
            const formattedData = {
                ...formData,
                phone: Number(formData.phone) || 0, // Convierte a número
            };
            const response = await fetch(`http://localhost:8081/api/deliveryForm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indicamos que estamos enviando datos JSON
                },
                body: JSON.stringify(formattedData),
            });
            if (response.ok) {
                toast('Formulario cargado con éxito', {
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
                setFormData({
                    street: "",
                    street_number: "",
                    locality: "",
                    province: "",
                    country: "",
                    postal_code: "",
                    dpto: "",
                    indications: "",
                    name: "",
                    phone: "",
                });
                document.getElementById('inputSearchAddress').value = '';
                fetchDeliveryForm();
            } else {
                toast('Error al cargar formulario', {
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
            console.error('Error al enviar el formulario:', error);
        }
    }

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
                setUserCart([]); // Si hay un error, aseguramos que el carrito esté vacío
                return [];
            }
    
            if (!data.data || !Array.isArray(data.data.products)) {
                console.warn("Carrito vacío o no válido, asignando array vacío.");
                setUserCart([]); // Si el carrito no tiene productos, lo dejamos vacío
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
            setUserCart([]); // Si hay un error en la petición, dejamos el carrito vacío
            return [];
        }
    };

    const fetchUser = async (cookieValue) => {
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
        setCookieValue(cookieValue)
        fetchUser(cookieValue);
        fetchCategories();
        fetchDeliveryForm();
        if(cookieValue) {
            login()
            } else {
            logout()
        }
        window.scrollTo(0, 0);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // Elimina caracteres no numéricos
        }));
    };

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };
    
    const handleDeleteAddress = async (addressId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/deliveryForm/${addressId}`, {
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
                fetchDeliveryForm();
            } else {
                toast('Error al eliminar el domicilio', {
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

    return (
        
        <>

            <div className='navbarContainer'>
                <NavBar
                isLoading={isLoading}
                categories={categories}
                isLoggedIn={user.isLoggedIn}
                userCart={userCart}
                role={user.role}
                />
            </div>
            <DeliveryAddress
            deliveryAddressFormData={deliveryAddressFormData}
            />

            <div className='deliveryFormContainer'>

                <div className='deliveryFormContainer__deliveryForm'>

                    <div className='deliveryFormContainer__deliveryForm__title'>
                        <div className='deliveryFormContainer__deliveryForm__title__prop'>Formulario de entrega</div>
                    </div>

                    <div className="deliveryFormContainer__deliveryForm__existingAddresses">
                        <h2 className='deliveryFormContainer__deliveryForm__existingAddresses__title'>Domicilios</h2>
                        {deliveryForms.length === 0 ? (
                            <p className='deliveryFormContainer__deliveryForm__existingAddresses__withOutAddressesLabel'>
                                No hay domicilios aún
                            </p>
                        ) : (
                            <ul className="deliveryFormContainer__deliveryForm__existingAddresses__itemAddress">
                                {deliveryForms.map((item) => (
                                    <li 
                                        key={item._id} 
                                        className={`deliveryFormContainer__deliveryForm__existingAddresses__itemAddress__addressContainer 
                                            ${selectedAddress && selectedAddress._id === item._id ? "selected" : ""}`}
                                    >
                                        <label className="deliveryFormContainer__deliveryForm__existingAddresses__itemAddress__addressContainer__label">
                                            <input
                                                type="radio"
                                                name="selectedAddress"
                                                value={item._id}
                                                checked={selectedAddress && selectedAddress._id === item._id} // Comparación correcta
                                                onChange={() => handleSelectAddress(item)} // Ejecuta petición en cada selección
                                                className="deliveryFormContainer__deliveryForm__existingAddresses__itemAddress__addressContainer__radio"
                                            />
                                            <span className="deliveryFormContainer__deliveryForm__existingAddresses__itemAddress__addressContainer__address">
                                                {capitalizeFirstLetter(item.street)} {capitalizeFirstLetter(item.street_number)}, {capitalizeFirstLetter(item.locality)}
                                            </span>
                                        </label>
                                        <button
                                            className="deliveryFormContainer__deliveryForm__existingAddresses__itemAddress__addressContainer__btn"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evita que el click en eliminar seleccione la dirección
                                                handleDeleteAddress(item._id);
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>


                        )}
                    </div>

                    <div className='deliveryFormContainer__deliveryForm__labelInputLoadStreet'>
                        <div className='deliveryFormContainer__deliveryForm__labelInputLoadStreet__prop'>Busca tu dirección aquí!</div>
                    </div>

                    {
                        isLoaded && 
                        <StandaloneSearchBox onLoad={(ref) => inputRef.current = ref} onPlacesChanged={handleOnPlacesChanged}>
                            <input id='inputSearchAddress' className='deliveryFormContainer__deliveryForm__inputStreet' type="text" placeholder='Dirección' />
                        </StandaloneSearchBox>
                    }

                    <div className='deliveryFormContainer__deliveryForm__gridLabelInput'>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Calle:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.street} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='street' type="text" placeholder='Calle' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Número:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.street_number} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='street_number' type="text" placeholder='Número' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Localidad:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.locality} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='locality' type="text" placeholder='Localidad' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Provincia:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.province} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='province' type="text" placeholder='Provincia' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>País:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.country} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='country' type="text" placeholder='País' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Código postal:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.postal_code} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='postal_code' type="text" placeholder='Código postal' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Departamento (opcional):</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.dpto} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='dpto' type="text" placeholder='Departamento' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Indicaciones (opcional):</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <textarea className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__textArea' value={formData.indications} onChange={handleInputChange} placeholder='Mensaje' name="indications" id=""></textarea>
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__labelContactData'>Datos de contacto</div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'></div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Nombre completo:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.name} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='name' type="text" placeholder='Nombre' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Teléfono:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.phone} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='phone' type="number" placeholder='Teléfono'/>
                            </div>
                        </div>
                        
                    </div>

                    <div className='deliveryFormContainer__deliveryForm__btnContainer'>
                        <button onClick={handleBtnSaveDeliveryForm} className='deliveryFormContainer__deliveryForm__btnContainer__btn'>Guardar</button>
                    </div>

                </div>

            </div>
        
            <Footer/>

        </>

    )

}

export default DeliveryForm