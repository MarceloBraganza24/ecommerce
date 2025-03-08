import NavBar from './components/NavBar.jsx';
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Login from './components/Login.jsx';
import Cart from './components/Cart.jsx';
import ItemDetailContainer from './components/ItemDetailContainer.jsx';
import CategoryContainer from './components/CategoryContainer.jsx';

import { ShoppingCartContext } from './context/ShoppingCartContext'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignIn from './components/SignIn.jsx';
import Shipping from './components/Shipping.jsx';

function App() {

    return (

        <BrowserRouter>

            <ShoppingCartContext>

                <Routes>

                    <Route exact path="/" element={<Home/>}/>
                    <Route exact path="/about" element={<About/>}/>
                    <Route exact path="/contact" element={<Contact/>}/>
                    <Route exact path="/logIn" element={<Login/>}/>
                    <Route exact path="/signIn" element={<SignIn/>}/>
                    <Route exact path="/cart" element={<Cart/>}/>
                    <Route exact path="/item/:id" element={<ItemDetailContainer/>}/>
                    <Route exact path="/category/:category" element={<CategoryContainer/>}/>
                    <Route exact path="/shipping" element={<Shipping/>}/>

                </Routes>

                <ToastContainer />

            </ShoppingCartContext>

        </BrowserRouter>
        
    )
}

export default App
