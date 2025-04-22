/* import React, { useEffect, useState,useContext } from 'react';
import { CartContext } from '../context/ShoppingCartContext';

const PaymentForm = () => {

    const {cart} = useContext(CartContext);
    const totalAmount = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

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
  
    const amount = totalAmount; // Monto total a pagar
  
    // Inicializamos MercadoPago SDK
    useEffect(() => {
        const mpInstance = new window.MercadoPago('TEST-45f14b6b-51ab-458d-8e4b-6129dc586136', {
            locale: 'es-AR'
        });
        setMp(mpInstance);

        mpInstance.getIdentificationTypes().then(types => {
            setDocTypes(types);
            if (types.length > 0) setDocType(types[0].id);
        });
    }, []);

    const validateForm = () => {
        const cardNumberRegex = /^[0-9]{13,19}$/;
        const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{3,50}$/;
        const cvvRegex = /^[0-9]{3,4}$/;
        const docNumberRegex = /^[0-9]{6,11}$/;
      
        if (!cardNumberRegex.test(cardNumber)) {
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
            cardNumber,
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
                transaction_amount: amount,
                description: 'Compra Ecommerce',
                installments: Number(selectedInstallment),
                payment_method_id: paymentMethodId,
                issuer_id: issuerId,
                payer: {
                    email: 'marceebraga@gmail.com', // Email del cliente
                    identification: {
                        type: docType,
                        number: docNumber
                    }
                },
                items: cart
            };
    
            const response = await fetch('http://localhost:3001/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });
    
            const result = await response.json();
    
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

export default PaymentForm */


import React, { useEffect } from 'react';

const publicKey = 'TEST-45f14b6b-51ab-458d-8e4b-6129dc586136';

const PaymentForm = () => {

    useEffect(() => {
        const mp = new window.MercadoPago(publicKey);
        mp.cardForm({
            amount: '1000', // Podés actualizar este valor con el total del carrito
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
            },
            callbacks: {
                onFormMounted: error => {
                if (error) console.error('Error al montar el formulario', error);
                },
                onSubmit: async event => {
                event.preventDefault();
        
                const cardFormData = await mp.cardForm().getCardFormData();
        
                const response = await fetch('/api/payments/generate-purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    token: cardFormData.token,
                    payment_method_id: cardFormData.paymentMethodId,
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
                console.log('Resultado del pago:', resultado);
        
                if (resultado.status === 'approved') {
                    alert('¡Pago aprobado!');
                } else {
                    alert(`Estado del pago: ${resultado.status}`);
                }
                },
            },
        });
    }, []);
    

    return (
        
        <>
            <form id="form-pago" onSubmit={handleSubmit}>
                <input type="text" id="cardholderName" placeholder="Nombre del titular" />
                <input type="email" id="cardholderEmail" placeholder="Email" />
                <input type="text" id="cardNumber" placeholder="Número de tarjeta" />
                <input type="text" id="expirationDate" placeholder="MM/AA" />
                <input type="text" id="securityCode" placeholder="CVV" />
                <select id="identificationType"></select>
                <input type="text" id="identificationNumber" placeholder="DNI" />
                <select id="installments"></select>
                <button type="submit">Pagar</button>
            </form>
        </>
        
    )

}

export default PaymentForm