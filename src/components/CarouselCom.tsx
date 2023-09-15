import React from 'react'
import { useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useLocation } from 'react-router-dom';
import { GlobalState } from '../redux/store';
import { Product } from '../types/Product';

export const CarouselCom = () => {
    const products = useSelector((state: GlobalState) => state.products)

    return (
        <div>
            <Carousel swipeable={true} autoPlay={true} showArrows={true}>
                {/* {(products && products.length > 0)  &&  products.map((prod, index) => (
                    <div key={index}>
                        <img style={{width:150,height:150}} src={prod.images[0]} />
                        <p className="legend">{prod.title}</p>
                    </div>
                ))} */}
            </Carousel>
        </div>
    )
}
