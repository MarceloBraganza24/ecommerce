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
    const [idDeliveryForm, setIdDeliveryForm] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [userCart, setUserCart] = useState({});
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
    });

    const inputRef = useRef(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCypLLA0vWKs_lvw5zxCuGJC28iEm9Rqk8',
        libraries:["places"]
    })

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
                setFormData({
                    street: deliveryForm.data[0].street || "",
                    street_number: deliveryForm.data[0].street_number || "",
                    locality: deliveryForm.data[0].locality || "",
                    province: deliveryForm.data[0].province || "",
                    country: deliveryForm.data[0].country || "",
                    postal_code: deliveryForm.data[0].postal_code || "",
                    dpto: deliveryForm.data[0].dpto || "", // Si no existe, se asigna ""
                    indications: deliveryForm.data[0].indications || "", // Si no existe, se asigna ""
                    name: deliveryForm.data[0].name || "",
                    phone: deliveryForm.data[0].phone || "",
                });
                setIdDeliveryForm(deliveryForm.data[0]._id)
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
            const response = await fetch('http://localhost:8081/api/deliveryForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indicamos que estamos enviando datos JSON
                },
                body: JSON.stringify(formattedData), // Convertimos formData a JSON
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

    const handleBtnUpdateDeliveryForm = async() => {
        try {
            const formattedData = {
                ...formData,
                phone: Number(formData.phone) || 0, // Convierte a número
            };
            const response = await fetch(`http://localhost:8081/api/deliveryForm/${idDeliveryForm}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', // Indicamos que estamos enviando datos JSON
                },
                body: JSON.stringify(formattedData), // Convertimos formData a JSON
            });
            if (response.ok) {
                toast('Formulario modificado con éxito', {
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
                fetchDeliveryForm()
            } else {
                toast('Error al modificar el formulario de entrega', {
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

    const fetchCartByUserId = async (id) => {
        try {
            const response = await fetch(`http://localhost:8081/api/carts/byUserId/${id}`);
            const data = await response.json();
            //console.log(data.data); 
            if (response.ok) {
                setUserCart(data.data); 
            } else {
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
                    fetchCartByUserId(user._id);
                }
                setIsLoading(false)
                }
            } catch (error) {
                console.error('Error:', error);
            }
            };
        fetchUser();
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
            [name]: name === "phone" ? value.replace(/\D/g, '') : value, // Elimina caracteres no numéricos
        }));
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
            formData={formData}
            />

            <div className='deliveryFormContainer'>

                <div className='deliveryFormContainer__deliveryForm'>

                    <div className='deliveryFormContainer__deliveryForm__title'>
                        <div className='deliveryFormContainer__deliveryForm__title__prop'>Formulario de entrega</div>
                    </div>
                    <div className='deliveryFormContainer__deliveryForm__labelInputLoadStreet'>
                        <div className='deliveryFormContainer__deliveryForm__labelInputLoadStreet__prop'>Busca tu dirección aquí!</div>
                    </div>

                    {
                        isLoaded && 
                        <StandaloneSearchBox onLoad={(ref) => inputRef.current = ref} onPlacesChanged={handleOnPlacesChanged}>
                            <input className='deliveryFormContainer__deliveryForm__inputStreet' type="text" placeholder='Dirección' />
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
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Nombre:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.name} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='name' type="text" placeholder='Nombre' />
                            </div>
                        </div>
                        <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput'>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__label'>Teléfono:</div>
                            <div className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer'>
                                <input value={formData.phone} onChange={handleInputChange} className='deliveryFormContainer__deliveryForm__gridLabelInput__labelInput__inputContainer__input' name='phone' type="number" placeholder='Teléfono' />
                            </div>
                        </div>
                        
                    </div>

                    <div className='deliveryFormContainer__deliveryForm__btnContainer'>
                        {
                            idDeliveryForm ?
                            <button onClick={handleBtnUpdateDeliveryForm} className='deliveryFormContainer__deliveryForm__btnContainer__btn'>Guardar cambios</button>
                            :
                            <button onClick={handleBtnSaveDeliveryForm} className='deliveryFormContainer__deliveryForm__btnContainer__btn'>Guardar</button>
                        }
                    </div>

                </div>

            </div>
        
            <Footer/>

        </>

    )

}

export default DeliveryForm