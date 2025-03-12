import React, { useState,useEffect,useRef  } from 'react';
import {GoogleMap, useJsApiLoader, StandaloneSearchBox} from '@react-google-maps/api'

const DeliveryAddressModal = () => {

    const inputRef = useRef(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCypLLA0vWKs_lvw5zxCuGJC28iEm9Rqk8',
        libraries:["places"]
    })

    //console.log(isLoaded)

    const handleOnPlacesChanged = () => {
        let address = inputRef.current.getPlaces()
        const desglocedAddress = address.map(dm => dm.address_components)
        const prop = desglocedAddress[0]
        const street_number = prop.find(dm => dm.types[0] == "street_number")
        const street = prop.find(dm => dm.types[0] == "route")
        const locality = prop.find(dm => dm.types[0] == "locality")
        const province = prop.find(dm => dm.types[0] == "administrative_area_level_1")
        const postal_code = prop.find(dm => dm.types[0] == "postal_code")
        const country = prop.find(dm => dm.types[0] == "country")
        //console.log(prop)
        console.log('Calle: ',street.long_name,street_number.long_name)
        console.log('Ciudad: ',locality.long_name)
        console.log('Provincia: ',province.long_name)
        console.log('Pais: ',country.long_name)
        console.log('Código postal: ',postal_code.long_name)
        //console.log(street.long_name)
        // console.log(locality.long_name)
        // console.log(province.long_name)
        // console.log(postal_code.long_name)
        // console.log(country.long_name)
    }

  return (
    <>

        {
            isLoaded && 
            <StandaloneSearchBox onLoad={(ref) => inputRef.current = ref} onPlacesChanged={handleOnPlacesChanged}>

                <input className='inputDeliveryAddressModal' type="text" placeholder='Dirección' />

            </StandaloneSearchBox>
        }
    
        <div>DeliveryAddressModal</div>
    </>
  )
}

export default DeliveryAddressModal