import React, {useState,useEffect} from 'react'


const CreateProductModal = ({setShowCreateProductModal}) => {

    const [product, setProduct] = useState({
        images: [],
        title: '',
        description: '',
        price: '',
        stock: '',
        size: [],
        color: [],
        category: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Validaciones en tiempo real
        if (name === 'state') {
          // Solo letras y espacios
          const regex = /^[a-zA-Z\s]*$/;
          if (!regex.test(value)) return; // Ignora si no cumple
        }
    
        if (name === 'price' || name === 'stock') {
          // Solo números positivos
          const regex = /^[0-9]*$/;
          if (!regex.test(value)) return; // Ignora si no cumple
        }
    
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
    
        if (files.length > 6) {
          alert('Máximo 6 imágenes');
          e.target.value = '';
          return;
        }
    
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxFileSize = 2 * 1024 * 1024; // 2MB
        const minWidth = 500;
        const minHeight = 500;
        const maxWidth = 5000;
        const maxHeight = 5000;
    
        const processedImages = [];
    
        for (let file of files) {
          if (!allowedTypes.includes(file.type)) {
            alert(`El archivo ${file.name} no es un tipo de imagen permitido (JPG, PNG, WEBP).`);
            e.target.value = '';
            return;
          }
    
          if (file.size > maxFileSize) {
            alert(`El archivo ${file.name} supera el tamaño máximo de 2MB.`);
            e.target.value = '';
            return;
          }
    
          // Validación de dimensiones
          const imageDimensions = await getImageDimensions(file);
    
          if (
            imageDimensions.width < minWidth ||
            imageDimensions.height < minHeight ||
            imageDimensions.width > maxWidth ||
            imageDimensions.height > maxHeight
          ) {
            alert(`El archivo ${file.name} no cumple con las dimensiones mínimas/máximas (${minWidth}x${minHeight} - ${maxWidth}x${maxHeight} px).`);
            e.target.value = '';
            return;
          }
    
          // Comprimir la imagen
          const compressedImage = await compressImage(file, 0.7); // 70% calidad (podés ajustar)
          processedImages.push(compressedImage);
        }
    
        setProduct({ ...product, images: processedImages });
    };
    
      // Función para obtener dimensiones de una imagen
    const getImageDimensions = (file) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
    
          img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(objectUrl);
          };
    
          img.onerror = () => {
            reject(new Error('Error al cargar la imagen para obtener dimensiones.'));
          };
    
          img.src = objectUrl;
        });
    };
    
      // Función para comprimir una imagen usando Canvas
    const compressImage = (file, quality = 0.7) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
    
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            // Opcional: podés cambiar el tamaño del canvas si querés redimensionar
            canvas.width = img.width;
            canvas.height = img.height;
    
            ctx.drawImage(img, 0, 0);
    
            // Elegir el formato de salida (mantenemos el original si es posible)
            let outputFormat = 'image/jpeg';
            if (file.type === 'image/png') outputFormat = 'image/png';
            if (file.type === 'image/webp') outputFormat = 'image/webp';
    
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const compressedFile = new File([blob], file.name, {
                    type: outputFormat,
                    lastModified: Date.now()
                  });
                  resolve(compressedFile);
                } else {
                  reject(new Error('Error al comprimir la imagen.'));
                }
                URL.revokeObjectURL(objectUrl);
              },
              outputFormat,
              quality // Calidad de la compresión (0.0 - 1.0)
            );
          };
    
          img.onerror = () => {
            reject(new Error('Error al cargar la imagen para comprimir.'));
          };
    
          img.src = objectUrl;
        });
    };
    
    const validateForm = () => {
        const { title, description, price, stock, category, images } = product;
    
        // Validar campos vacíos
        if (!title.trim() || !description.trim() || !price || !stock || !category.trim()) {
          alert('Por favor, completa todos los campos.');
          return false;
        }
        
        // Validar price y stock (números mayores a 0)
        if (Number(price) <= 0 || Number(stock) < 0) {
          alert('El precio debe ser mayor a 0 y el stock no puede ser negativo.');
          return false;
        }
    
        // Validar imágenes
        if (images.length === 0) {
          alert('Debes subir al menos una imagen.');
          return false;
        }
    
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        // FormData para enviar imágenes
        const formData = new FormData();
        formData.append('title', product.title);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('size', product.size);
        formData.append('color', product.color);
        formData.append('state', product.state);
        formData.append('category', product.category);
    
        product.size.forEach((size, index) => {
          formData.append('size', size);
        });

        product.images.forEach((image, index) => {
          formData.append('images', image);
        });

        /* const productt = {
            images: ["uploads/1742271397903-images.jpg","uploads/1231742271397903-images.jpg"],
            title: "akmsasd",
            description: "asdsakms",
            price: 1000,
            stock: 3,
            size: ["2","3"],
            color: ["negro","marron"],
            state: "nuevo",
            category: "remera",
        } */

        try {
            /* const res = await fetch('http://localhost:8081/api/products/', {
                method: 'POST',
                body: JSON.stringify({
                    images: product.images,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    size: product.size,
                    color: product.color,
                    state: product.state,
                    category: product.category
                })
            });
        
            const data = await res.json(); */
            console.log(product);
        
            /* if (res.ok) {
                alert('Producto cargado con éxito');
                setProduct({
                    images: [],
                    title: '',
                    description: '',
                    price: '',
                    stock: '',
                    size: '',
                    color: '',
                    category: ''
                });
            } else {
                alert('Error al cargar el producto');
            } */
        } catch (error) {
            console.error('Error:', error);
        }
    };
        
    return (
        
        <>

            <div className='createProductModalContainer'>

                <div className='createProductModalContainer__createProductModal'>

                    <div className='createProductModalContainer__createProductModal__btnCloseModal'>
                        <div onClick={()=>setShowCreateProductModal(false)} className='createProductModalContainer__createProductModal__btnCloseModal__btn'>X</div>
                    </div>

                    <div className='createProductModalContainer__createProductModal__propsContainer'>

                        <div className='createProductModalContainer__createProductModal__propsContainer__propProduct'>

                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__label'>Imágenes</div>
                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__galeryImages'>
                                <input
                                    type="file"
                                    name="images"
                                    onChange={handleImageChange}
                                    multiple
                                    accept=".jpg, .jpeg, .png, .webp"
                                    className="createProductModalContainer__createProductModal__propsContainer__propProduct__galeryImages__btn"
                                />
                                <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__galeryImages__maxLabel'>(Max 6)</div>
                            </div>

                        </div>

                        <div className='createProductModalContainer__createProductModal__propsContainer__propProduct'>

                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__label'>Título</div>
                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__input'>
                                <input className='createProductModalContainer__createProductModal__propsContainer__propProduct__input__prop' placeholder='Título' type="text" name='title' value={product.title} onChange={handleChange} />
                            </div>

                        </div>

                        <div className='createProductModalContainer__createProductModal__propsContainer__propProduct'>

                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__label'>Descripción</div>
                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__input'>
                                <input className='createProductModalContainer__createProductModal__propsContainer__propProduct__input__prop' placeholder='Descripción' type="text" name='description' value={product.description} onChange={handleChange} />
                            </div>

                        </div>

                        <div className='createProductModalContainer__createProductModal__propsContainer__propProduct'>

                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__label'>Precio</div>
                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__input'>
                                <input className='createProductModalContainer__createProductModal__propsContainer__propProduct__input__propShort' placeholder='Precio' type="text" name='price' value={product.price} onChange={handleChange} />
                            </div>

                        </div>

                        <div className='createProductModalContainer__createProductModal__propsContainer__propProduct'>

                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__label'>Stock</div>
                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__input'>
                                <input className='createProductModalContainer__createProductModal__propsContainer__propProduct__input__propShort' placeholder='Stock' type="text" name='stock' value={product.stock} onChange={handleChange} />
                            </div>

                        </div>

                        <div className='createProductModalContainer__createProductModal__propsContainer__propProduct'>

                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__label'>Talle</div>
                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__input'>
                                <input className='createProductModalContainer__createProductModal__propsContainer__propProduct__input__prop' placeholder='Valores separados por comas (38,40)' type="text" name='size' value={product.size} onChange={handleChange} />
                            </div>

                        </div>

                        <div className='createProductModalContainer__createProductModal__propsContainer__propProduct'>

                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__label'>Color</div>
                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__input'>
                                <input className='createProductModalContainer__createProductModal__propsContainer__propProduct__input__prop' placeholder='Valores separados por comas (Blanco,Negro)' type="text" name='color' value={product.color} onChange={handleChange} />
                            </div>

                        </div>

                        <div className='createProductModalContainer__createProductModal__propsContainer__propProduct'>

                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__label'>Estado</div>
                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__input'>
                                <input className='createProductModalContainer__createProductModal__propsContainer__propProduct__input__prop' placeholder='Estado' type="text" name='state' value={product.state} onChange={handleChange} />
                            </div>

                        </div>

                        <div className='createProductModalContainer__createProductModal__propsContainer__propProduct'>

                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__label'>Categoría</div>
                            <div className='createProductModalContainer__createProductModal__propsContainer__propProduct__input'>
                                <input className='createProductModalContainer__createProductModal__propsContainer__propProduct__input__prop' placeholder='Categoría' type="text" name='category' value={product.category} onChange={handleChange} />
                            </div>

                        </div>

                        <div className='createProductModalContainer__createProductModal__propsContainer__btnContainer'>
                            <button onClick={handleSubmit} className='createProductModalContainer__createProductModal__propsContainer__btnContainer__btn'>Guardar</button>
                        </div>

                    </div>

                </div>

            </div>
        
        </>

    )

}


export default CreateProductModal