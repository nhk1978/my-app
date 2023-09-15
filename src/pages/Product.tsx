import { useState } from "react";
import ProductForm from "../components/ProductForm";
import { User } from "../types/User";

const Product = () => {
    const loginString = localStorage.getItem("loginUser")
    const [loginUser, setLoginUser] = useState<User | null>(loginString ? JSON.parse(loginString) : null);
    
    
    return (
        <div>
            {loginUser?.role === "Admin" && <ProductForm />}
            {loginUser?.role === "User" && 
                <div> 
                    <h2>Please login as Admin role</h2>
                </div>
            }

        </div>
    )    
}


export default Product;