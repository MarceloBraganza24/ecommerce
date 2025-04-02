import { createContext, useState } from "react"
import { toast } from "react-toastify"

export const CartContext = createContext(null)

export const ShoppingCartContext = ({children}) => {

    const [cart, setCart] = useState([])

    const updateQuantity = async (user_id, id, newQuantity, fetchCartByUserId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/carts/update-quantity/${user_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product: id, quantity: newQuantity }),
            });
            if (!response.ok) {
                console.error("Error al actualizar la cantidad en MongoDB");
                return;
            }
            const updatedCart = await fetchCartByUserId(user_id);
        } catch (error) {
            console.error("Error en la actualización del carrito:", error);
        }
    };
    
    
    

    const deleteItemCart = async (user_id,id,fetchCartByUserId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/carts/remove-product/${user_id}/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchCartByUserId(user_id)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteAllItemCart = async (user_id, fetchCartByUserId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/carts/${user_id}`, {
                method: "DELETE",
            });
    
            // console.log("Response status:", response.status); // 🛠 Verificar status
            // console.log("Response headers:", response.headers.get("content-type")); // 🛠 Verificar si devuelve JSON
    
            let data = null;
            if (response.headers.get("content-type")?.includes("application/json")) {
                data = await response.json();
            } else {
                console.warn("La respuesta no es JSON");
            }
    
            if (response.ok) {
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
                fetchCartByUserId(user_id);
            } else {
                throw new Error("Error al eliminar el carrito");
            }
    
        } catch (error) {
            console.error("Error en deleteAllItemCart:", error); // 🛠 Verifica el error exacto
            toast('Error al eliminar el producto del carrito!', {
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
            fetchCartByUserId(user_id);
        }
    };
    

    /* const deleteAllItemCart = async(user_id,fetchCartByUserId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/carts/${user_id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            console.log(response)
            if (response.ok) {
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
                fetchCartByUserId(user_id)
            }
        } catch (error) {
            toast('Error al eliminar el producto del carrito!', {
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
            fetchCartByUserId(user_id)
        }
    } */

    return (

        <CartContext.Provider value={{cart, setCart, deleteItemCart, deleteAllItemCart, updateQuantity}}>
            {children}
        </CartContext.Provider>

    )

}