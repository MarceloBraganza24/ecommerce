import { createContext, useState } from "react"
import { toast } from "react-toastify"

export const CartContext = createContext(null)

export const ShoppingCartContext = ({children}) => {

    const [cart, setCart] = useState([])

    const updateQuantity = async (user_id,id, newQuantity,fetchCartByUserId) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
        try {
            const response = await fetch(`http://localhost:8081/api/carts/update-quantity/${user_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product: id, quantity: newQuantity }),
            });
    
            const data = await response.json();
            console.log(data)
            if (!response.ok) {
                console.error("Error al actualizar la cantidad en MongoDB");
            } else {
                fetchCartByUserId(user_id)
            }
        } catch (error) {
            console.error("Error en la actualización del carrito:", error);
        }
    };

    const deleteItemCart = async (user_id,id,fetchCartByUserId) => {
        // Eliminar del estado local
        //setCart((prevCart) => prevCart?.filter((item) => item.id !== id));
        setCart((prevCart) => Array.isArray(prevCart) ? prevCart.filter((item) => item.id !== id) : []);

        try {
            const response = await fetch(`http://localhost:8081/api/carts/remove-product/${user_id}/${id}`, {
                method: "DELETE",
            });
    
            const data = await response.json();
            console.log(data)
            if(response.ok) {
                setCart(data.cart); // Actualiza el estado con el carrito actualizado
            }
            fetchCartByUserId(user_id)
        } catch (error) {
            console.error(error);
        }
    };

    const deleteAllItemCart = async(id) => {
        /* try {
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
        } */
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
    }

    return (

        <CartContext.Provider value={{cart, setCart, deleteItemCart, deleteAllItemCart, updateQuantity}}>
            {children}
        </CartContext.Provider>

    )

}