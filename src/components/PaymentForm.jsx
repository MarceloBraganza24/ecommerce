/* import { useEffect,useContext, useRef } from "react";
import { CartContext } from '../context/ShoppingCartContext';

const PaymentForm = () => {
    const {cart} = useContext(CartContext);
    const cardForm = useRef(null);
    const totalAmount = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    useEffect(() => {
        const mp = new window.MercadoPago("TEST-45f14b6b-51ab-458d-8e4b-6129dc586136");
    
        cardForm.current = mp.cardForm({
            amount: "1000", // Precio final del producto
            autoMount: true,
            form: {
            id: "form-checkout", // El ID de tu form
            cardholderName: {
                id: "form-checkout__cardholderName",
                placeholder: "Nombre del titular"
            },
            cardholderEmail: {
                id: "form-checkout__cardholderEmail",
                placeholder: "Email"
            },
            cardNumber: {
                id: "form-checkout__cardNumber",
                placeholder: "Número de la tarjeta"
            },
            expirationDate: {
                id: "form-checkout__expirationDate",
                placeholder: "MM/YY"
            },
            securityCode: {
                id: "form-checkout__securityCode",
                placeholder: "CVV"
            },
            installments: {
                id: "form-checkout__installments"
            },
            identificationType: {
                id: "form-checkout__identificationType"
            },
            identificationNumber: {
                id: "form-checkout__identificationNumber",
                placeholder: "Número de documento"
            },
            issuer: {
                id: "form-checkout__issuer"
            }
            },
            callbacks: {
                onFormMounted: error => {
                  if (error) return console.warn("Error al montar el formulario: ", error);
                },
                onSubmit: event => {
                    event.preventDefault();
                
                    const {
                        paymentMethodId,
                        issuerId,
                        cardholderEmail,
                        amount,
                        token,
                        installments,
                        identificationNumber,
                        identificationType
                    } = cardForm.current.getCardFormData();
                
                    // 🚀 Mandás al backend el token del pago + carrito completo
                    fetch("http://localhost:3001/process-payment", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                        token,
                        issuer_id: issuerId,
                        payment_method_id: paymentMethodId,
                        transaction_amount: totalAmount, // Total calculado en el carrito
                        installments: Number(installments),
                        description: "Compra en mi tienda",
                        payer: {
                            email: cardholderEmail,
                            identification: {
                            type: identificationType,
                            number: identificationNumber
                            }
                        },
                        // 🚀 Mandás los items del carrito para guardar después
                        items: cart 
                        })
                    })
                        .then(response => response.json())
                        .then(result => {
                        if (result.status === "approved") {
                            // Mostrás mensaje de éxito o redirigís
                            alert("¡Pago exitoso!");
                        } else {
                            alert("Hubo un problema con el pago");
                        }
                        })
                        .catch(error => {
                        console.error(error);
                    });
                }
            }
        });
    }, []);

    return (
        
        <>

            <div className='headerPurchase'>
                            
                <img className='headerPurchase__logo__prop' src="/src/assets/logo_ecommerce_h.png" alt="logo" />
                
            </div>

            <div className="paymentFormContainer">

                <div className="paymentFormContainer__paymentForm">

                    <div className="paymentFormContainer__paymentForm__title">
                        <div className="paymentFormContainer__paymentForm__title__prop">Datos del pago</div>
                    </div>

                    <div className="paymentFormContainer__paymentForm__form">

                        <form id="form-checkout"className="paymentFormContainer__paymentForm__form__gridLabelInput">

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__cardholderName" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Nombre</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" type="text" id="form-checkout__cardholderName" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__cardholderEmail" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Email</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" type="email" id="form-checkout__cardholderEmail" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__cardNumber" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Número de la tarjeta</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input type="text" id="form-checkout__cardNumber" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__expirationDate" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Fecha de vencimiento</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input type="text" id="form-checkout__expirationDate" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__securityCode" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Código de seguridad</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input type="text" id="form-checkout__securityCode" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__installments" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Cuotas</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <select id="form-checkout__installments" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input"></select>
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__identificationType" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Tipo de documento</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <select id="form-checkout__identificationType" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input"></select>
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__identificationNumber" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Número de documento</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" type="text" id="form-checkout__identificationNumber" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__issuer" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Banco emisor</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <select className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" id="form-checkout__issuer"></select>
                                </div>
                            </div>

                            <div></div>
                            
                            <div className="paymentFormContainer__paymentForm__form__gridLabelInput__btn">
                                <button className="paymentFormContainer__paymentForm__form__gridLabelInput__btn__prop" type="submit">Pagar</button>
                            </div>

                        </form>

                    </div>

                </div>

            </div>
        
        </>
        
    )

}

export default PaymentForm */


import React, { useEffect, useState,useContext } from 'react';
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
    const [docNumber, setDocNumber] = useState('');
  
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [issuerId, setIssuerId] = useState('');
    const [installments, setInstallments] = useState([]);
    const [selectedInstallment, setSelectedInstallment] = useState('');
  
    const [issuers, setIssuers] = useState([]);
  
    const amount = totalAmount; // Monto total a pagar
  
    // Inicializamos MercadoPago SDK
    useEffect(() => {
      const mpInstance = new window.MercadoPago('TEST-45f14b6b-51ab-458d-8e4b-6129dc586136', {
        locale: 'es-AR'
      });
      setMp(mpInstance);
  
      // Cargamos los tipos de documento (DNI, etc.)
      mpInstance.getIdentificationTypes().then(types => {
        if (types.length > 0) setDocType(types[0].id);
      });
    }, []);
  
    const handleCardNumberChange = async (e) => {
      const value = e.target.value;
      setCardNumber(value);
  
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
  
      try {
        const cardData = {
          cardNumber,
          cardholderName,
          cardExpirationMonth,
          cardExpirationYear,
          securityCode,
          identificationType: docType,
          identificationNumber: docNumber
        };
  
        const { id: token } = await mp.createCardToken(cardData);
  
        // Payload para enviar al backend
        const paymentData = {
          token,
          transaction_amount: amount,
          description: 'Compra en mi tienda online',
          installments: Number(selectedInstallment),
          payment_method_id: paymentMethodId,
          issuer_id: issuerId,
          payer: {
            email: 'cliente@email.com', // Email del cliente
            identification: {
              type: docType,
              number: docNumber
            }
          },
          items: cart
        };
  
        // Enviás el pago al backend
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

                        <form id="form-checkout"className="paymentFormContainer__paymentForm__form__gridLabelInput">

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Número de tarjeta</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input
                                    className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input'
                                    type="text"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    maxLength={16}
                                    required
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
                                    />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Mes de expiración</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input
                                    className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input'
                                    type="text"
                                    value={cardExpirationMonth}
                                    onChange={e => setCardExpirationMonth(e.target.value)}
                                    maxLength={2}
                                    required
                                    />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Año de expiración</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input
                                    className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input'
                                    type="text"
                                    value={cardExpirationYear}
                                    onChange={e => setCardExpirationYear(e.target.value)}
                                    maxLength={4}
                                    required
                                    />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Código de seguridad</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input
                                    className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input'
                                    type="text"
                                    value={securityCode}
                                    onChange={e => setSecurityCode(e.target.value)}
                                    maxLength={4}
                                    required
                                    />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label'>Tipo de documento</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <select className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input' value={docType} onChange={e => setDocType(e.target.value)} required>
                                        <option value="DNI">DNI</option>
                                        <option value="CUIT">CUIT</option>
                                        <option value="CI">CI</option>
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
                                <button className='paymentFormContainer__paymentForm__form__gridLabelInput__btn__prop' type="submit" style={styles.button}>Pagar ${amount}</button>
                            </div>

                            {/* {installments.length > 0 && (
                                <div style={styles.field}>
                                    <label>Cuotas</label>
                                    <select
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
                            )} */}


                            {/* <div style={styles.field}>
                                <label>Número de tarjeta</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    maxLength={16}
                                    required
                                />
                            </div> */}

                            {/* <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__cardholderEmail" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Email</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" type="email" id="form-checkout__cardholderEmail" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__cardNumber" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Número de la tarjeta</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input type="text" id="form-checkout__cardNumber" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__expirationDate" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Fecha de vencimiento</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input type="text" id="form-checkout__expirationDate" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__securityCode" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Código de seguridad</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input type="text" id="form-checkout__securityCode" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__installments" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Cuotas</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <select id="form-checkout__installments" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input"></select>
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__identificationType" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Tipo de documento</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <select id="form-checkout__identificationType" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input"></select>
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__identificationNumber" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Número de documento</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <input className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" type="text" id="form-checkout__identificationNumber" />
                                </div>
                            </div>

                            <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput'>
                                <label htmlFor="form-checkout__issuer" className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__label">Banco emisor</label>
                                <div className='paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer'>
                                    <select className="paymentFormContainer__paymentForm__form__gridLabelInput__labelInput__inputContainer__input" id="form-checkout__issuer"></select>
                                </div>
                            </div> */}

                            {/* <div></div> */}
                            
                            {/* <div className="paymentFormContainer__paymentForm__form__gridLabelInput__btn">
                                <button className="paymentFormContainer__paymentForm__form__gridLabelInput__btn__prop" type="submit">Pagar</button>
                            </div> */}

                        </form>

                        {/* <form onSubmit={handleSubmit} className="checkout-form" style={styles.form}>

                            <div style={styles.field}>
                                <label>Número de tarjeta</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    maxLength={16}
                                    required
                                />
                            </div>

                            <div style={styles.field}>
                                <label>Nombre del titular</label>
                                <input
                                    type="text"
                                    value={cardholderName}
                                    onChange={e => setCardholderName(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={styles.row}>
                                <div style={styles.field}>
                                    <label>Mes de expiración</label>
                                    <input
                                    type="text"
                                    value={cardExpirationMonth}
                                    onChange={e => setCardExpirationMonth(e.target.value)}
                                    maxLength={2}
                                    required
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label>Año de expiración</label>
                                    <input
                                    type="text"
                                    value={cardExpirationYear}
                                    onChange={e => setCardExpirationYear(e.target.value)}
                                    maxLength={4}
                                    required
                                    />
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label>Código de seguridad</label>
                                <input
                                    type="text"
                                    value={securityCode}
                                    onChange={e => setSecurityCode(e.target.value)}
                                    maxLength={4}
                                    required
                                />
                            </div>

                            <div style={styles.field}>
                                <label>Tipo de documento</label>
                                <select value={docType} onChange={e => setDocType(e.target.value)} required>
                                    <option value="DNI">DNI</option>
                                    <option value="CUIT">CUIT</option>
                                    <option value="CI">CI</option>
                                </select>
                            </div>

                            <div style={styles.field}>
                                <label>Número de documento</label>
                                <input
                                    type="text"
                                    value={docNumber}
                                    onChange={e => setDocNumber(e.target.value)}
                                    required
                                />
                            </div>

                            {issuers.length > 0 && (
                            <div style={styles.field}>
                                <label>Banco emisor</label>
                                <select value={issuerId} onChange={e => setIssuerId(e.target.value)} required>
                                {issuers.map(issuer => (
                                    <option key={issuer.id} value={issuer.id}>{issuer.name}</option>
                                ))}
                                </select>
                            </div>
                            )}

                            {installments.length > 0 && (
                            <div style={styles.field}>
                                <label>Cuotas</label>
                                <select
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
                            )}

                            <button type="submit" style={styles.button}>Pagar ${amount}</button>

                        </form> */}

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