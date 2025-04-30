import React, { useEffect, useState,useContext } from 'react';

const PaymentForm = () => {
    const [mp, setMp] = useState(null);

    const [cardNumber, setCardNumber] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cardExpirationMonth, setCardExpirationMonth] = useState('');
    const [cardExpirationYear, setCardExpirationYear] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [docType, setDocType] = useState('');
    const [docTypes, setDocTypes] = useState([]);
    const [docNumber, setDocNumber] = useState('');
  
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [issuerId, setIssuerId] = useState('');
    const [installments, setInstallments] = useState([]);
    const [selectedInstallment, setSelectedInstallment] = useState('');
  
    const [issuers, setIssuers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');
    const [userCart, setUserCart] = useState({});
  
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        
        if(userCart.products && Array.isArray(userCart.products)) {
            const total = Array.isArray(userCart.products)?userCart.products.reduce((acumulador, producto) => acumulador + (producto.product.price * producto.quantity), 0): 0;
            setAmount(total)
            /* const totalQuantity = Array.isArray(userCart.products)?userCart.products.reduce((sum, producto) => sum + producto.quantity, 0):0;
            setTotalQuantity(totalQuantity)
            const discountPercentage = validatedCoupon.discount;
            const totalWithDiscount = total - (total * (discountPercentage / 100));
            setTotalWithDiscount(totalWithDiscount) */
        }

    }, [userCart]);

    const fetchCartByUserId = async (user_id) => {
        try {
            const response = await fetch(`http://localhost:8081/api/carts/byUserId/${user_id}`);
            const data = await response.json();
    
            if (!response.ok) {
                console.error("Error al obtener el carrito:", data);
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
                setUserCart({ user_id, products: [] }); // 👈 cambio clave
                return [];
            }
    
            if (!data.data || !Array.isArray(data.data.products)) {
                console.warn("Carrito vacío o no válido, asignando array vacío.");
                setUserCart({ user_id, products: [] }); // 👈 cambio clave
                return [];
            }
    
            setUserCart(data.data);
            return data.data;
    
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
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
            setUserCart({ user_id, products: [] }); // 👈 cambio clave
            return [];
        }
    };

    const fetchUser = async (cookieValue) => {
        try {
            const response = await fetch(`http://localhost:8081/api/sessions/current?cookie=${cookieValue}`)
            const data = await response.json();
            if(data.error === 'jwt must be provided') { 
                console.log('set is loading false')
            } else {
                const user = data.data
                if(user) {
                    setUser(user)
                    fetchCartByUserId(user._id);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
  
    // Inicializamos MercadoPago SDK
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
        /* if(cookieValue) {
            setCookieValue(cookieValue)
        }  */
        fetchUser(cookieValue);
        const mpInstance = new window.MercadoPago('TEST-45f14b6b-51ab-458d-8e4b-6129dc586136', {
            locale: 'es-AR'
        });
        setMp(mpInstance);

        mpInstance.getIdentificationTypes().then(types => {
            setDocTypes(types);
            if (types.length > 0) setDocType(types[0].id);
        });
    }, []);
    
    const cleanedCardNumber = cardNumber.replace(/\s+/g, '');
    const validateForm = () => {
        const cardNumberRegex = /^[0-9]{13,19}$/;
        const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{3,50}$/;
        const cvvRegex = /^[0-9]{3,4}$/;
        const docNumberRegex = /^[0-9]{6,11}$/;
        
        /* if (!cardNumberRegex.test(cardNumber)) {
            alert('Número de tarjeta inválido');
            return false;
            } */
        if (!cardNumberRegex.test(cleanedCardNumber)) {
            alert('Número de tarjeta inválido');
            return false;
          }
      
        if (!nameRegex.test(cardholderName)) {
          alert('Nombre del titular inválido');
          return false;
        }
      
        const month = parseInt(cardExpirationMonth, 10);
        if (!(month >= 1 && month <= 12)) {
          alert('Mes de expiración inválido');
          return false;
        }
      
        const year = parseInt(cardExpirationYear, 10);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
      
        if (year < currentYear || year > currentYear + 20) {
          alert('Año de expiración inválido');
          return false;
        }
      
        if (year === currentYear && month < currentMonth) {
          alert('La tarjeta ya expiró');
          return false;
        }
      
        if (!cvvRegex.test(securityCode)) {
          alert('Código de seguridad inválido');
          return false;
        }
      
        if (!['DNI', 'CUIT', 'CI'].includes(docType)) {
          alert('Tipo de documento inválido');
          return false;
        }
      
        if (!docNumberRegex.test(docNumber)) {
          alert('Número de documento inválido');
          return false;
        }
      
        if (issuers.length > 0 && issuerId === '') {
          alert('Debes seleccionar el banco emisor');
          return false;
        }
      
        if (installments.length > 0 && selectedInstallment === '') {
          alert('Debes seleccionar las cuotas');
          return false;
        }
      
        return true;
    };
      

    const formatCardNumber = (value) => {
        return value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    };
  
    const handleCardNumberChange = async (e) => {
        const value = e.target.value.replace(/\D/g, ''); // solo números
        setCardNumber(formatCardNumber(value));
    
        if (value.length >= 6 && mp) {
            const bin = value.slice(0, 6);
    
            try {
            const { results } = await mp.getPaymentMethods({ bin });
            const method = results[0];
    
            setPaymentMethodId(method.id);
    
            if (method.additional_info_needed.includes('issuer_id')) {
                getIssuers(method.id, bin);
            } else {
                setIssuerId('');
            }
    
            getInstallments(method.id, bin, amount);
            } catch (error) {
            console.error('Error al obtener métodos de pago:', error);
            }
        }
    };
  
    const getIssuers = async (paymentMethodId, bin) => {
      try {
        const response = await mp.getIssuers({ paymentMethodId, bin });
        setIssuers(response);
        setIssuerId(response[0]?.id || '');
      } catch (error) {
        console.error('Error al obtener emisores:', error);
      }
    };
  
    const getInstallments = async (paymentMethodId, bin, amount) => {
      try {
        const response = await mp.getInstallments({
          paymentMethodId,
          amount,
          bin
        });
  
        const payerCosts = response[0]?.payer_costs || [];
        setInstallments(payerCosts);
        setSelectedInstallment(payerCosts[0]?.installments || '');
      } catch (error) {
        console.error('Error al obtener cuotas:', error);
      }
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
    
        if (!cardExpirationMonth || !cardExpirationYear || !securityCode || !cardNumber) {
            alert('Por favor completá todos los datos.');
            setLoading(false);
            return;
        }
    
        if (!validateForm()) {
            setLoading(false);
            return;
        }
    
        const cardData = {
            cardNumber: cleanedCardNumber,
            cardholderName,
            cardExpirationMonth,
            cardExpirationYear,
            securityCode,
            identificationType: docType,
            identificationNumber: docNumber
        };
    
        let token = null;
        try {
            const tokenResult = await mp.createCardToken(cardData);
            token = tokenResult.id;
        } catch (tokenError) {
            console.error('Error creando el token de la tarjeta:', tokenError);
            alert('Error con los datos de la tarjeta. Revisá los campos.');
            setLoading(false);
            return;
        }
    
        try {
            const paymentData = {
                token,
                transaction_amount: Number(amount),
                description: 'Compra Ecommerce',
                installments: Number(selectedInstallment),
                payment_method_id: paymentMethodId,
                issuer_id: issuerId,
                payer: {
                    //email: 'marceebraga@gmail.com', // Email del cliente
                    email: user.email, // Email del cliente
                    identification: {
                        type: docType,
                        number: docNumber
                    }
                },
                items: userCart.products
            };
            console.log(paymentData)
    
            const response = await fetch('http://localhost:8081/api/payments/generate-purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });
    
            const result = await response.json();
            console.error(result)
    
            if (result.status === 'approved') {
                alert('¡Pago exitoso! 🎉');
            } else {
                alert('Pago rechazado ❌');
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Error en el pago ❌');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        
        <>

            <div className='headerPurchase'>
                            
                <img className='headerPurchase__logo__prop' src="/src/assets/logo_ecommerce_h.png" alt="logo" />
                
            </div>

            <div className="paymentFormContainer">

                <div className="paymentFormContainer__paymentForm">

                    <div className="paymentFormContainer__paymentForm__title">
                        <div className="paymentFormContainer__paymentForm__title__prop">Formulario de pago</div>
                    </div>

                    <div className="paymentFormContainer__paymentForm__form">

                        <form id="form-checkout" onSubmit={handleSubmit} className="paymentFormContainer__paymentForm__form__gridLabelInput">

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Número de tarjeta</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input
                                    className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input'
                                    type="text"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    maxLength={19}
                                    required
                                    placeholder='Número de tarjeta'
                                />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Nombre del titular</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input
                                    className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input'
                                    type="text"
                                    value={cardholderName}
                                    onChange={e => setCardholderName(e.target.value)}
                                    required
                                    placeholder='Nombre del titular'
                                    />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Mes de expiración</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input
                                    className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__inputShort'
                                    type="text"
                                    value={cardExpirationMonth}
                                    onChange={e => setCardExpirationMonth(e.target.value)}
                                    maxLength={2}
                                    required
                                    placeholder='Mes'
                                    />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Año de expiración</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input
                                    className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__inputShort'
                                    type="text"
                                    value={cardExpirationYear}
                                    onChange={e => setCardExpirationYear(e.target.value)}
                                    maxLength={4}
                                    required
                                    placeholder='Año'
                                    />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Código de seguridad</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input
                                    className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__inputShort'
                                    type="text"
                                    value={securityCode}
                                    onChange={e => setSecurityCode(e.target.value)}
                                    maxLength={4}
                                    required
                                    placeholder='Código'
                                    />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Tipo de documento</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <select
                                        className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input'
                                        value={docType}
                                        onChange={e => setDocType(e.target.value)}
                                        required
                                        >
                                        {docTypes.map((type) => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Número de documento</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input
                                        className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input'
                                        type="text"
                                        value={docNumber}
                                        onChange={e => setDocNumber(e.target.value)}
                                        required
                                        placeholder='Número de documento'
                                    />
                                </div>
                            </div>

                            {issuers.length > 0 && (

                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                    <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Banco emisor</label>
                                    <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                        <select className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input' value={issuerId} onChange={e => setIssuerId(e.target.value)} required>
                                            {issuers.map(issuer => (
                                                <option key={issuer.id} value={issuer.id}>{issuer.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            )}

                            {installments.length > 0 && (

                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                    <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Cuotas</label>
                                    <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                        <select
                                            className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input'
                                            value={selectedInstallment}
                                            onChange={e => setSelectedInstallment(e.target.value)}
                                            required
                                            >
                                            {installments.map((installment, index) => (
                                                <option key={index} value={installment.installments}>
                                                {installment.recommended_message}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            )}

                            <div></div>
                            
                            <div className="paymentFormContainer__paymentForm__form__gridLabelInput__btn">
                                <button
                                    className='paymentFormContainer__paymentForm__form__gridLabelInput__btn__prop'
                                    type="submit"
                                    style={styles.button}
                                    disabled={loading}
                                    >
                                    {loading ? 'Procesando...' : `Pagar $${amount}`}
                                </button>
                            </div>

                        </form>

                    </div>

                </div>

            </div>
        
        </>
        
    )

}

const styles = {
    form: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '1rem',
      border: '1px solid #eee',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Arial'
    },
    field: {
      marginBottom: '1rem',
      display: 'flex',
      flexDirection: 'column'
    },
    row: {
      display: 'flex',
      gap: '10px'
    },
    button: {
      backgroundColor: '#3483fa',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer'
    }
  };

export default PaymentForm


/* import React, { useEffect, useState, useRef } from 'react';

const publicKey = 'TEST-45f14b6b-51ab-458d-8e4b-6129dc586136';

const PaymentForm = () => {
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        if (!window.MercadoPago) {
            console.error('Mercado Pago SDK aún no está disponible');
            return;
        }
        // Verificamos si el formulario ya fue montado
        if (formRef.current && formRef.current.querySelector('iframe')) {
            console.log('Formulario ya montado, evitando montaje duplicado');
            return;
        }
        const mp = new window.MercadoPago(publicKey);
    
        mp.cardForm({
            amount: '1000', // podés reemplazar con el total de tu carrito
            autoMount: true,
            form: {
                id: 'form-pago',
                cardholderName: { id: 'cardholderName' },
                cardholderEmail: { id: 'cardholderEmail' },
                cardNumber: { id: 'cardNumber' },
                expirationDate: { id: 'expirationDate' },
                securityCode: { id: 'securityCode' },
                installments: { id: 'installments' },
                identificationType: { id: 'identificationType' },
                identificationNumber: { id: 'identificationNumber' },
                issuer: { id: 'issuer' },
            },
            callbacks: {
                onFormMounted: error => {
                  if (error) return console.warn('Form mounted handling error: ', error);
                  console.log('Formulario montado correctamente');
                },
                onSubmit: async event => {
                    event.preventDefault();
                    setLoading(true);
            
                    try {
                        const cardFormData = await mp.cardForm().getCardFormData();
            
                        if (
                        !cardFormData.token ||
                        !cardFormData.payer.email ||
                        !cardFormData.payer.identification.number
                        ) {
                        alert('Por favor completá todos los campos.');
                        setLoading(false);
                        return;
                        }
            
                        const response = await fetch('http://localhost:8081/api/payments/generate-purchase', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                token: cardFormData.token,
                                payment_method_id: cardFormData.paymentMethodId,
                                issuer_id: cardFormData.issuer.id,
                                transaction_amount: parseFloat(cardFormData.amount),
                                installments: Number(cardFormData.installments),
                                payer: {
                                    email: cardFormData.payer.email,
                                    identification: {
                                        type: cardFormData.payer.identification.type,
                                        number: cardFormData.payer.identification.number,
                                    },
                                },
                            }),
                        });
            
                        const resultado = await response.json();
            
                        switch (resultado.status) {
                            case 'approved':
                                alert('✅ ¡Pago aprobado! Muchas gracias por tu compra.');
                                break;
                            case 'in_process':
                                alert('⏳ Tu pago está en proceso. Te avisaremos cuando se confirme.');
                                break;
                            case 'rejected':
                                alert('❌ El pago fue rechazado. Probá con otra tarjeta.');
                                break;
                            default:
                                alert(`⚠️ Estado del pago: ${resultado.status}`);
                        }
                    } catch (error) {
                        console.error('Error al enviar el pago', error);
                        alert('Hubo un error al procesar el pago. Intentá nuevamente.');
                    } finally {
                        setLoading(false);
                    }
                },
                onFetching: (resource) => {
                  console.log('Fetching resource: ', resource);
                  return () => console.log('Stop fetching');
                },
                onValidityChange: (data) => {
                  // Podés usarlo para mostrar errores de validación en tiempo real si querés
                  console.log('Validez actual del form: ', data);
                }
            },
        });
        return () => {
            formRef.current = null;
        };
    }, []);
    
    return (
        <form id="form-pago" ref={formRef}>
            <input type="text" id="cardholderName" placeholder="Nombre del titular" />
            <input type="email" id="cardholderEmail" placeholder="Email" />
            <input type="text" id="cardNumber" placeholder="Número de tarjeta" />
            <input type="text" id="expirationDate" placeholder="MM/AA" />
            <input type="text" id="securityCode" placeholder="CVV" />
            <select id="identificationType"></select>
            <input type="text" id="identificationNumber" placeholder="DNI" />
            <select id="issuer"></select>
            <select id="installments"></select>
            <button type="submit" disabled={loading}>
                {loading ? 'Procesando...' : 'Pagar'}
            </button>
        </form>
    );

}

export default PaymentForm */