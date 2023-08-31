import React, { useEffect } from 'react'
import './Cart.css'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalState } from '../redux/store'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header'
import { CartProps, Product } from '../types/Product'
import { cleanCart, decrementQuantity, incrementQuantity, removeFromCart } from '../redux/reducers/CartSlice'
import { useNavigate } from 'react-router-dom';
const Cart = () => {
  const navigate = useNavigate()
  const cart = useSelector((state: GlobalState) => state.cartReducer.cart)
  // const [total, setTotal] = useEffect(0)
  const total = cart.map((item) => item.product.price * item.quantity).reduce((curr, prev) => curr + prev, 0)
  const orders = [...cart]
  const charges = 30
  const totalPrice = total + charges
  const dispatch = useDispatch()
  const handleIncrementQuantity = (item: Product) => {
    dispatch(incrementQuantity(item))
  }
  const handleDecrementQuantity = (item: Product) => {
    dispatch(decrementQuantity(item))
  }
  const handleRemoveItemFromCart = (item: Product) => {
    dispatch(removeFromCart(item))
  }
  const placeOrder = (item: CartProps[]) => {
    toast.success('🦄 Order Placed!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }

  setTimeout(() => {
    navigate("/orders", {
      state: {
        orders: orders,
        totalPrice: totalPrice
      }
    })
  }, 3500)
  setTimeout(() => {
    dispatch(cleanCart());
  }, 4000)

  return (
    <>
      <Header />
      <div className='cart'>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        {/* Left part */}
        <div className='cartLeft'>
          {cart.map((item, index) => (
            <div className='cartContainer' key={item.product.id}>
              {/* image */}
              <div>
                <img src={item.product.images[0]} style={{ width: 100, height: 100 }} alt={item.product.title} />
              </div>
              {/* description */}
              <div className='cartDescription'>
                <p>{item?.product.title.length > 60 ? item?.product.title.substring(0, 60) : item?.product.title}</p>
                <p style={{ marginTop: 8 }}>{item?.product.description.length > 80 ? item?.product.description.substring(0, 80) : item?.product.description}</p>
                <p style={{ marginTop: 8 }}>{item.product.price}</p>
              </div>
              {/* Button */}
              <div className='cartButtonContainer'>
                <div className='cartButtons'>
                  <div onClick={() => handleDecrementQuantity(item.product)} style={{ cursor: "pointer" }}>-</div>
                  <div>
                    {item.quantity}
                  </div>
                  <div onClick={() => handleIncrementQuantity(item.product)} style={{ cursor: "pointer" }}>+</div>
                </div>
                <button onClick={() => handleRemoveItemFromCart(item.product)} className='cartButton'>Remove Item</button>
                <h5 style={{ marginTop: 7 }}>Subtotal: {item.product.price * item.quantity}</h5>
              </div>
            </div>
          ))}
        </div>
        {/* Right pat */}
        {total === 0 ? (
          <div>
            <h2>Your Cart is Empty</h2>
          </div>
        ) : (
          <div className='cartRight'>
            {/* Location infor and button */}
            <div className='cartRightLocationContainer'>
              <div className='cartRightLocation'>
                <LocationOnIcon style={{ color: "gray" }} />
                <div className='cartRightDescription'>
                  <p className='carRightText'>Select Your Location</p>
                  <p className='carRightText'>Please select a location so we can find you</p>
                  <button className='cartRightButton'>Select Location</button>
                </div>
              </div>
            </div>
            <div className='cartRightLocationContainer'>
              <div className='cartRightLocation'>
                <LocationOnIcon style={{ color: "gray" }} />
                <div className='cartRightDescription'>
                  <p className='carRightText'>Choose your saved location</p>
                  <button className='cartRightButton'>Choose Location</button>
                </div>
              </div>
            </div>
            {/* Coupon infor and description */}
            <div className='cartRightCoupon'>
              <ConfirmationNumberIcon style={{ color: "gray" }} />
              <div style={{ marginLeft: 10 }}>
                <h4 className='cartRightCouponText'>Select / Apply Coupon</h4>
                <p className='cartRightCouponSmall'>Apply coupons to avail offers on the product</p>
              </div>

            </div>
            {/* Container for check out and the total */}
            <div>
              <div className='cartRightCheckout'>
                <div className='cartRightCheckoutpart'>
                  <h5>              Total Price             </h5>
                  <h5>            {total}            </h5>
                </div>
                <div className='cartRightCheckoutpart'>
                  <h5>              Discount             </h5>
                  <h5>            -            </h5>
                </div>
                <div className='cartRightCheckoutpart'>
                  <h5>              charges             </h5>
                  <h5>            {charges}            </h5>
                </div>
                <div className='cartRightCheckoutpart'>
                  <h3>              Grand Total             </h3>
                  <h3>            {total + charges}            </h3>
                </div>
              </div>
              <button
                onClick={() => placeOrder(cart)}
                className='cartRightCheckoutButton'>Place Order</button>
            </div>

          </div>

        )}


      </div >
    </>
  )
}

export default Cart