import React from 'react'
import "./Order.css"
import { useLocation } from 'react-router-dom'
import { CartProps } from '../types/Product'
import { forEachChild } from 'typescript'

const Order = () => {
    const location = useLocation()
    const orders = location.state.orders
    // console.log("order: " + JSON.stringify(location.state.orders))
    return (
        <div className='orders'>
            <div>
                <h3>Your Orders:</h3>
                {orders.map((element: CartProps, index: number) => {
                    return (
                        <div className='orderContainer' key={index}>
                            <img style={{ width: 140, height: 140 }} src={element.product.images[0].link} alt={element.product.title} />
                            <div className='orderDescription'>
                                <p style={{marginTop:8}}>{element.product.title}</p>
                                <p style={{marginTop:8}}>{element.product.description.length > 60 ? element.product?.description.substring(0, 60) : element.product?.description}</p>
                                <p style={{marginTop:8}}>{element.product.price * element.quantity}</p>
                            </div>
                            <div className='orderButtons'>
                                <button className='orderButton'>Return product</button>
                                <button className='orderButton'>Download invoice</button>
                                <button className='orderButton'>Rate Product</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Order