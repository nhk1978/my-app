import React from 'react'
import './Home.css'
import Header from '../components/Header'
import Body from '../components/Body'
import { Provider } from 'react-redux'
import store from '../redux/store';
import { CarouselCom } from '../components/CarouselCom'
const Home = () => {
    return (
        <div>
            <div className='app'>
                <Provider store={store}>
                    {/* Header part */}
                    <Header />
                    {/* Carousel Banner */}
                    <CarouselCom/>
                    {/* Body part */}
                    <Body />
                </Provider>
            </div>
        </div>
    )
}

export default Home