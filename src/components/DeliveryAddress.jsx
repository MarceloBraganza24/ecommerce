import React, { useState,useEffect  } from 'react';
import axios from 'axios';

const DeliveryAddress = () => {

    return (

        <>
            <div className='deliveryAddressContainer'>

                <div className='deliveryAddressContainer__label'>Enviar a:</div>
                <div className='deliveryAddressContainer__address'>Avellaneda 339, Coronel Suárez</div>
                <button className='deliveryAddressContainer__btnEdit'>Editar</button>

            </div>
            <DeliveryAddressModal/>
        </>

    )

}

export default DeliveryAddress

const DeliveryAddressModal = () => {
    /* const [address, setAddress] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [error, setError] = useState('');
  
    const API_KEY = '14b5ca7fc6c64fb1ae6db8826dc20dbf'; // Reemplaza con tu clave de API
  
    // Función para buscar direcciones mientras el usuario escribe
    const handleInputChange = async (e) => {
      const query = e.target.value;
      setAddress(query);
  
      // Solo hacer la solicitud si el campo no está vacío
      if (query.trim()) {
        try {
          const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
              q: query,
              key: API_KEY,
              no_annotations: 1, // Evita resultados innecesarios
            },
          });
  
          // Si hay resultados, se muestran las sugerencias
          if (response.data.results.length > 0) {
            setSuggestions(response.data.results);
          } else {
            setSuggestions([]);
          }
        } catch (err) {
          setError('Hubo un error al obtener las sugerencias');
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };
  
    // Función para manejar la selección de una dirección
    const handleSelectSuggestion = (suggestion) => {
      setSelectedAddress(suggestion.formatted);
      setSuggestions([]); // Limpiar las sugerencias una vez que se selecciona una
      setAddress(suggestion.formatted); // Rellenar el campo de texto con la dirección seleccionada
    }; */
    

    return (

        <>
            <div className='deliveryAddressContainerModal'>

                {/* <div className='deliveryAddressContainerModal__deliveryAddressContainer'>

                    <div className='deliveryAddressContainerModal__deliveryAddressContainer__title'>

                        <div className='deliveryAddressContainerModal__deliveryAddressContainer__title__prop'>Datos para la entrega</div>

                    </div>
                    
                    <div className="deliveryAddressContainerModal__deliveryAddressContainer__input">
                        <input placeholder='' type="text" className='deliveryAddressContainerModal__deliveryAddressContainer__input__prop' />
                    </div>

                </div> */}

                
                    {/* <div className='deliveryAddressContainerModal__deliveryAddressContainer'>
                        <h1>Buscar Dirección</h1>
                        <input
                        type="text"
                        value={address}
                        onChange={handleInputChange}
                        placeholder="Escribe una dirección"
                        />
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {suggestions.length > 0 && (
                        <ul style={{ border: '1px solid #ccc', padding: 0, marginTop: 5, listStyleType: 'none' }}>
                            {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectSuggestion(suggestion)}
                                style={{ padding: '5px 10px', cursor: 'pointer' }}
                            >
                                {suggestion.formatted}
                            </li>
                            ))}
                        </ul>
                        )}

                        {selectedAddress && (
                        <div>
                            <h3>Dirección seleccionada:</h3>
                            <p>{selectedAddress}</p>
                        </div>
                        )}
                    </div> */}

            </div>
        </>

    )

}