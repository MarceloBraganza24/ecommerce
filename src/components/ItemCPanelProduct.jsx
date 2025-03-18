import React, {useState} from 'react'
import UpdateProductModal from './UpdateProductModal'

const ItemCPanelProduct = ({product}) => {

    const [showUpdateModal, setShowUpdateModal] = useState(false);

    return (
        <>
            <div className="cPanelProductsContainer__productsTable__itemContainer">

                <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                    <img className="cPanelProductsContainer__productsTable__itemContainer__item__img" src={product.images[0]} alt="" />
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

                {/* <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                    <div className="cPanelProductsContainer__productsTable__itemContainer__item__labelLong">{product.size.join(',')}</div>
                </div>
                
                <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                    <div className="cPanelProductsContainer__productsTable__itemContainer__item__labelLong">{product.color.join(',')}</div>
                </div>

                <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                    <div className="cPanelProductsContainer__productsTable__itemContainer__item__labelLong">{product.state.join(',')}</div>
                </div> */}

                <div className="cPanelProductsContainer__productsTable__itemContainer__item">
                    <div className="cPanelProductsContainer__productsTable__itemContainer__item__label">{product.category}</div>
                </div>

                <div className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer'>
                    <button onClick={() => setShowUpdateModal(true)} className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer__btn'>Editar</button>
                    <button className='cPanelProductsContainer__productsTable__itemContainer__btnsContainer__btn'>Borrar</button>
                </div>

            </div>

            {
                showUpdateModal &&
                <UpdateProductModal
                product={product}
                setShowUpdateModal={setShowUpdateModal}
                />
            }
        </>
    )

}

export default ItemCPanelProduct