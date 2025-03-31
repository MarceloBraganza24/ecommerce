import { createContext, useState } from "react"
import { toast } from "react-toastify"

export const CartContext = createContext(null)

export const ShoppingCartContext = ({children}) => {

    const [cart, setCart] = useState([])

    const updateQuantity = async (user_id,id, newQuantity) => {
        // Actualizar el carrito en el estado local de React
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );

        // Ahora actualizar la base de datos
        try {
            await fetch(`http://localhost:8081/api/carts/update-quantity/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id,quantity: newQuantity }),
            });
            console.log('Cantidad actualizada en la base de datos');
        } catch (error) {
            console.error('Error al actualizar la cantidad en la base de datos:', error);
        }
    };

    const deleteItemCart = async (id) => {
        // Eliminar del estado local
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));

        // Eliminar del backend
        try {
            await fetch(`http://localhost:8081/api/carts/delete-item/${id}`, {
                method: 'DELETE',
            });
            console.log('Producto eliminado de la base de datos');
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
    };

    const deleteAllItemCart = async(id) => {
        try {
            await fetch(`http://localhost:8081/api/carts/${id}`, {
                method: 'DELETE',
            });
            console.log('Carrito eliminado de la base de datos');
            toast('El carrito está vacío!', {
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
            setCart([])
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
    }

    return (

        <CartContext.Provider value={{cart, setCart, deleteItemCart, deleteAllItemCart, updateQuantity}}>
            {children}
        </CartContext.Provider>

    )

}