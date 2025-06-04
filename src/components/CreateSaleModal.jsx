import React, {useState} from 'react'

const CreateSaleModal = ({products,isLoadingProducts,totalProducts,pageInfoProducts,selectedProducts,setSelectedProducts,toggleSelectProduct}) => {
    const [selectedField, setSelectedField] = useState('title');
    const [inputFilteredProducts, setInputFilteredProducts] = useState('');

    const fieldLabels = {
        title: 'Título',
        description: 'Descripción',
        category: 'Categoría',
        state: 'Estado',
        price: 'Precio',
        stock: "Stock",
        all: 'Todos'
    };

    const handleInputFilteredProducts = (e) => {
        const value = e.target.value;
        const soloLetrasYNumeros = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');
        setInputFilteredProducts(soloLetrasYNumeros);
    }

    return (

        <>

            <div className="createSaleModalContainer">

                <div className='createSaleModalContainer__createSaleModal'>

                    <div className='createSaleModalContainer__createSaleModal__title'>
                        <div className='createSaleModalContainer__createSaleModal__title__prop'>Crear venta</div>
                    </div>

                    <div className='createSaleModalContainer__createSaleModal__inputSearchProduct'>
                        <div className='createSaleModalContainer__createSaleModal__inputSearchProduct__selectContainer'>
                            <div className='createSaleModalContainer__createSaleModal__inputSearchProduct__selectContainer__label'>Buscar por:</div>
                            <select
                                className='createSaleModalContainer__createSaleModal__inputSearchProduct__selectContainer__select'
                                value={selectedField}
                                onChange={(e) => setSelectedField(e.target.value)}
                                >
                                {Object.entries(fieldLabels).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className='createSaleModalContainer__createSaleModal__inputSearchProduct__inputContainer'>
                            <input type="text" onChange={handleInputFilteredProducts} value={inputFilteredProducts} placeholder={`Buscar por ${fieldLabels[selectedField]}`} className='createSaleModalContainer__createSaleModal__inputSearchProduct__inputContainer__input' name="" id="" />
                        </div>
                    </div>

                    <div className='createSaleModalContainer__createSaleModal__productsTable'>

                    {
                        isLoadingProducts ? 
                            <>
                                <div className="catalogContainer__grid__catalog__isLoadingLabel">
                                    Cargando productos&nbsp;&nbsp;<Spinner/>
                                </div>
                            </>
                        :
                        products.map((product) => (
                            <>

                                <div className="cPanelProductsContainer__productsTable__itemContainer">

                                    <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(product._id)}
                                            onChange={() => toggleSelectProduct(product._id)}
                                        />
                                    </div>

                                    <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                                        <img className="cPanelProductsContainer__productsTable__itemContainer__item__img" src={`http://localhost:8081/${product.images[0]}`} alt="" />
                                    </div>

                                    <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                                        <div className="cPanelProductsContainer__productsTable__itemContainer__item__label">{product.title}</div>
                                    </div>

                                    <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                                        <div className="cPanelProductsContainer__productsTable__itemContainer__item__description">{product.description}</div>
                                    </div>

                                    <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                                        <div className="cPanelProductsContainer__productsTable__itemContainer__item__label">$ {product.price}</div>
                                    </div>

                                    <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                                        <div className="cPanelProductsContainer__productsTable__itemContainer__item__label">{product.stock}</div>
                                    </div>

                                    <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                                        <div className="cPanelProductsContainer__productsTable__itemContainer__item__label">{product.category}</div>
                                    </div>

                                    <div className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer'>

                                        <button /* onClick={() => setShowUpdateModal(true)} */ className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer__btn'>Añadir</button>

                                        {/* {loading ? (
                                            <button
                                            disabled
                                            className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer__btn'
                                            >
                                            <Spinner/>
                                            </button>
                                        ) : (
                                            <button
                                            onClick={handleBtnDeleteProduct}
                                            className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer__btn'
                                            >
                                            Borrar
                                            </button>
                                        )} */}

                                    </div>

                                </div>
                                
                                <div className='cPanelProductsContainer__btnsPagesContainer'>
                                    <button className='cPanelProductsContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfoProducts.hasPrevPage}
                                        onClick={() => fetchProducts(pageInfoProducts.prevPage, inputFilteredProducts, selectedField)}
                                        >
                                        Anterior
                                    </button>
                                    
                                    <span>Página {pageInfoProducts.page} de {pageInfoProducts.totalPages}</span>

                                    <button className='cPanelProductsContainer__btnsPagesContainer__btn'
                                        disabled={!pageInfoProducts.hasNextPage}
                                        onClick={() => fetchProducts(pageInfoProducts.nextPage, inputFilteredProducts, selectedField)}
                                        >
                                        Siguiente
                                    </button>
                                </div>

                            </>
                        ))
                    }
                        {/* <div className='cPanelProductsContainer__btnsPagesContainer'>
                            <button className='cPanelProductsContainer__btnsPagesContainer__btn'
                                disabled={!pageInfoProducts.hasPrevPage}
                                onClick={() => fetchProducts(pageInfoProducts.prevPage, inputFilteredProducts, selectedField)}
                                >
                                Anterior
                            </button>
                            
                            <span>Página {pageInfoProducts.page} de {pageInfoProducts.totalPages}</span>

                            <button className='cPanelProductsContainer__btnsPagesContainer__btn'
                                disabled={!pageInfoProducts.hasNextPage}
                                onClick={() => fetchProducts(pageInfoProducts.nextPage, inputFilteredProducts, selectedField)}
                                >
                                Siguiente
                            </button>
                        </div> */}

                    </div>

                </div>

            </div>

        </>

    )

}

export default CreateSaleModal