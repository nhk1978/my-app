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
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import Registration from './pages/Registration';

function App() {
  return (
    
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Provider>
    
  );
}

export default App;
