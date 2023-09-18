import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import { Product, CartProps } from '../types/Product';
// import { CartContext } from './CartContext';
import './ProductDetail.css'
import useAppDispatch from '../hooks/useAppDispatch';
import { CartState, addToCart } from '../redux/reducers/CartSlice';
import { useSelector } from 'react-redux';
import { GlobalState } from '../redux/store';
import { CartItem } from '../types/CartItem';


const ProductDetail = ({ item }: {
  item: Product;
}) => {

  const cart = useSelector((state: GlobalState) => state.cart.cart)

  const dispatch = useAppDispatch()
  const handleAddtoCart = (prod: Product) => {
    // console.log("cart: "+JSON.stringify(cart))
    dispatch(addToCart(prod))
  }



  if (!item) {
    return <div>Loading...</div>;
  }

 

  return (
    <div className='productDetail'>
      <img style={{ width: 200, height: 200, marginLeft: "auto", marginRight: "auto" }} src={item.images[0].link} alt={item.title} />
      {/* title of product */}
      <p>{item?.title.length > 30 ? item?.title.substring(0, 30) : item?.title}</p>
      {/* description of product */}
      <p>{item?.description.length > 60 ? item?.description.substring(0, 60) : item?.description}</p>
      <p>${item.price}</p>
      {/* Add to cart button */}
      {cart && cart.length > 0 && cart.some((x: CartProps) => x.product.id === item.id) ? (
        <button className='productItemButton' onClick={() => handleAddtoCart(item)}>Remove From Cart</button>
      ) : (
        <button className='productItemButton' onClick={() => handleAddtoCart(item)}>Add To Cart</button>
      )
      }
      
      {/* Buy Now Button */}
      <button className='productItemBuy' >Buy Now</button>
      {/* <Link to="/cart">Go to Cart</Link> */}
    </div>
  );
};

export default ProductDetail;
