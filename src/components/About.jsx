import {useEffect} from 'react'
import NavBar from './NavBar'
import Footer from './Footer'

const About = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (

        <>

            <div className="aboutContainer">
                <NavBar/>

                <div className="aboutContainer__phraseContainer">
                    <div className="aboutContainer__phraseContainer__phrase">"En Ecommerce, creemos que la moda es más que solo ropa: es una forma de expresión, una declaración de estilo y una herramienta para sentirte seguro y auténtico en cada momento de tu vida. Nos apasiona ofrecerte prendas cuidadosamente seleccionadas que combinan calidad, comodidad y las últimas tendencias, para que puedas armar looks únicos y reflejar tu personalidad sin esfuerzo. Trabajamos con materiales de primera y un equipo comprometido en brindarte una experiencia de compra fácil, segura y emocionante. Porque sabemos que la moda no solo se viste, sino que se vive. ¡Bienvenido a nuestra comunidad!"</div>
                </div>
            </div>

            <Footer/>

        </>

    )

}

export default About