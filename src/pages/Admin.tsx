import { useEffect, useState } from "react";
import '../assets/styles/styles.scss';
import ProductForm from "../components/ProductForm";
import { User } from "../types/User";
import CategoryForm from "../components/CategoryForm";

const Admin = () => {

    const [action, setAction] = useState('');
    const loginString = localStorage.getItem("loginUser")
    const [loginUser, setLoginUser] = useState<User | null>(loginString ? JSON.parse(loginString) : null);

    useEffect(() => {
        if (action === 'Product') {
          
        }
      }, [action]);

return(

    <div>
        {(!loginUser || loginUser?.role === "User") && 
                <div> 
                    <h2>Please login as Admin role</h2>
                </div>
            }
        {loginUser?.role === "Admin" && 
            <div>    
                <div style={{display:"flex", flexDirection:"row"}}>
                <div className="form__wrapper" style={{height:"10vh", width:"100vw", display:"flex", right:"auto", left:"auto" }}>
                    <button
                    className="full-width-button__primary"
                    type="button"
                    onClick={() => setAction('Category')}
                    style={{width:"250px",margin: "40px"}}
                    >
                        Category
                    </button>
                </div>
                <div className="form__wrapper" style={{height:"10vh", width:"100vw", display:"flex", right:"auto", left:"auto" }}>
                    <button
                    className="full-width-button__primary"
                    type="button"
                    onClick={() => setAction('Product')}
                    style={{width:"250px", margin: "40px"}}
                    >
                        Product
                    </button>
                </div>
                </div>
                <div>
                    <div >
                        {action=="Product" && 
                            <div>
                                <h2 className="page__header">Product</h2>
                                <ProductForm />
                            </div>
                        } 
                        {action=="Category" && 
                            <div>
                                <h2 className="page__header">Category</h2>
                                <CategoryForm />
                            </div>
                        }   
                    </div>
                </div>
        </div>
        }
    </div>
); 
}

export default Admin;