import React, {useState,useEffect,useContext} from 'react'
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
        //if (!window.confirm('¿Estás seguro de que querés eliminar esta categoría?')) return;

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
                // Actualizás la lista después de borrar
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

    const handleSubmit = async (e) => {
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

        // Enviar la nueva categoría al backend (puedes usar fetch o axios)
        try {
            const category = {
                name: categoryName,
                category_datetime
            }
            const response = await fetch('http://localhost:8081/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                //body: JSON.stringify({ name: categoryName, category_datetime: category_datetime}),
                body: JSON.stringify(category),
            });

            if (response.ok) {
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
            } else {
                toast('Error al crear la categoría', {
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
                                    <span className='cPanelContainer__existingCategories__itemCategory__category__name'>{category.name}</span>
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
                    <form onSubmit={handleSubmit} className='cPanelContainer__newCategoryForm__form'>
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

            </div>

        </>

    )

}

export default CPanel