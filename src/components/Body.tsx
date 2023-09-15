import './Body.css'
import Products from './Products';



const Body = () => {
    const browse = localStorage.getItem("browse");
        
    return (
        <div>
            {browse == 'Products' && <Products />}

        </div>
    )    
}

export default Body

