import React from 'react';
// import logo from './assets/to.png';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import Home from './pages/Home';
import { Provider } from 'react-redux';
import store from './redux/store';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const loginString = localStorage.getItem("loginUser");
if(!loginString)
  localStorage.setItem("loginUser","")

function App() {
  return (
    
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profile" element={<Profile />} />
          
        </Routes>
      </Provider>
    
  );
}

export default App;
