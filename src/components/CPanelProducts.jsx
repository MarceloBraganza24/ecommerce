import React, {useState} from 'react'
import NavBar from './NavBar'
import ItemCPanelProduct from './ItemCPanelProduct';

const products = [
    { id: 1, images: ["/src/assets/body_micromorley.jpg"], title: "Body micromorley", description: '(disponible en blanco y rojo)', price: 15500, stock: 5, color: ["blanco","rojo"], size: ["1","2","3"], category: 'bodies', state: ["nuevo"] },
    { id: 2, images: ["/src/assets/body_lentejuelas.jpg"], title: "Body lentejuelas", description: '(disponible en cobre y plateado)', price: 16000, stock: 2, color: ["cobre","plateado"], size: ["2","3"], category: 'bodies', state: ["nuevo"] },
    { id: 3, images: ["/src/assets/body_bretel.jpg"], title: "Body bretel", description: 'Escote pinzado con abertura microfibra (disponible en negro)', price: 14800, stock: 10, color: ["negro"], size: ["3"], category: 'bodies', state: ["nuevo"] },
    { id: 4, images: ["/src/assets/cintos_elastizados_dorados.jpg"], title: "Cintos elastizados", description: 'Dorados', price: 6000, stock: 5, color: ["único"], size: ["único"], category: 'cintos', state: ["nuevo"] },
    { id: 5, images: ["/src/assets/cintos_elastizados_plateados.webP"], title: "Cintos elastizados", description: 'Plateados', price: 7000, stock: 6, color: ["único"], size: ["único"], category: 'cintos', state: ["nuevo"] },
    { id: 6, images: ["/src/assets/short_jean_1.webP","/src/assets/short_jean_2.webP","/src/assets/short_jean_3.webP","/src/assets/short_jean_1.webP","/src/assets/short_jean_2.webP","/src/assets/short_jean_3.webP"], title: "Short jean", description: 'Blanco ( disponible en talle 40)', price: 10000, stock: 1, color: ["único"], size: ["40"], category: 'shorts', state: ["nuevo"] },
    { id: 7, images: ["/src/assets/top_push_up_lentejuelas.jpg"], title: "Top push up", description: 'Lazo en la espalda para atar (disponible en plateado)', price: 12000, stock: 12, color: ["plateado"], size: ["único"], category: 'tops', state: ["nuevo"] },
    { id: 8, images: ["/src/assets/bando_de_lentejuelas.jpg"], title: "Bando de lentejuelas", description: '(disponible los tres colores)', price: 14000, stock: 4, color: ["negro","rojo","plateado"], size: ["1","2","3"], category: 'tops', state: ["nuevo"] },
    { id: 9, images: ["/src/assets/pollera_frunce_microfibra.jpg"], title: "Pollera frunce microfibra", description: '(disponible en negro blanco y rojo)', price: 16000, stock: 9, color: ["negro","blanco","rojo"], size: ["2","3"], category: 'polleras', state: ["nuevo"] },
    { id: 10, images: ["/src/assets/vestido_un_hombro.jpg"], title: "Vestido un hombro", description: 'Abertura en la cintura (disponible en negro)', price: 19500, stock: 6, color: ["negro"], size: ["1","2"], category: 'vestidos', state: ["nuevo"] },
    { id: 11, images: ["/src/assets/pollera_de_jean_cargo.jpg","/src/assets/pollera_de_jean_cargo_1.jpg"], title: "Pollera de jean cargo", description: '(disponible en talle 38 y 40)', price: 17500, stock: 8, color: ["único"], size: ["38","40"], category: 'polleras', state: ["nuevo"] },
    { id: 12, images: ["/src/assets/bodies_especial.png"], title: "Body especial", description: '(disponible en talle 38 y 40)', price: 15500, stock: 3, color: ["blanco","rojo","negro"], size: ["38","40"], category: 'bodies', state: ["nuevo"] },
    { id: 12, images: ["/src/assets/bodies_tradicional.png"], title: "Body tradicional", description: '(disponible en talle 38 y 40)', price: 12500, stock: 5, color: ["blanco","negro","marrón"], size: ["38","40"], category: 'bodies', state: ["nuevo"] },
];

const CPanelProducts = () => {

    const [inputFilteredProducts, setInputFilteredProducts] = useState('');

    function filtrarPorTitle(valorIngresado) {
        const valorMinusculas = valorIngresado.toLowerCase();
        const objetosFiltrados = products.filter(objeto => {
            const nombreMinusculas = objeto.title.toLowerCase();
            return nombreMinusculas.includes(valorMinusculas);
        });
        return objetosFiltrados;
    }
    const objetosFiltrados = filtrarPorTitle(inputFilteredProducts);

    const handleInputFilteredProducts = (e) => {
        const value = e.target.value;
        setInputFilteredProducts(value)
    }

    return (

        <>
            <div className='navbarContainer'>
                <NavBar/>
            </div>
            <div className='cPanelProductsContainer'>
                
                <div className='cPanelProductsContainer__title'>
                    <div className='cPanelProductsContainer__title__prop'>Productos</div>        
                </div>

                <div className='cPanelProductsContainer__inputSearchProduct'>
                    <input type="text" onChange={handleInputFilteredProducts} value={inputFilteredProducts} placeholder='Buscar por título' className='cPanelProductsContainer__inputSearchProduct__input' name="" id="" />
                </div>

                <div className='cPanelProductsContainer__btnCreateProduct'>
                    <button className='cPanelProductsContainer__btnCreateProduct__btn'>Crear producto</button>
                </div>

                <div className='cPanelProductsContainer__quantityProducts'>
                    <div className='cPanelProductsContainer__quantityProducts__prop'>Cantidad de productos: {objetosFiltrados.length}</div>        
                </div>

                <div className='cPanelProductsContainer__headerTableContainer'>

                    <div className="cPanelProductsContainer__headerTableContainer__headerTable">

                        <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Imagen</div>
                        <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Título</div>
                        <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Descripción</div>
                        <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Precio</div>
                        <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Stock</div>
                        <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Talle</div>
                        <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Color</div>
                        <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Estado</div>
                        <div className="cPanelProductsContainer__headerTableContainer__headerTable__item">Categoría</div>

                    </div>

                </div>


                <div className="cPanelProductsContainer__productsTable">

                    {objetosFiltrados.map((product) => (
                        <>
                            <ItemCPanelProduct
                            product={product}
                            />
                            
                        </>
                    ))}

                </div>

            </div>        
        
        </>

    )

}

export default CPanelProducts