import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAppDispatch from '../hooks/useAppDispatch'
import { AddProduct, Product, UpdateProduct } from '../types/Product'
import { Category } from '../types/Category'
import { AppDispatch, GlobalState } from '../redux/store'
import { createProduct, deleteProduct, fetchAllProducts, updateProduct } from '../redux/reducers/productsReducer'
import { getCategory } from '../redux/reducers/categoriesReducer';


const ProductForm = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [mode, setMode] = useState("");

  const [products, setProducts] = useState<(Product | AddProduct)[]>([])
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const [categoryList, setCategoryList] = useState<Category[]>([])
  // const [category, setCategory] = useState<Category | null>(null)
  const [price, setPrice] = useState('0 100000');
  const [action, setAction] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product|null>(null);
  const [addedProduct, setAddedProduct] = useState<AddProduct|null>(null); 
  const [sort, setSort] = useState<"asc" | "desc">("asc")
  const [newTitle, setNewTitle] = useState(selectedProduct?.title);
  const [newDescription, setNewDescription] = useState(selectedProduct?.description);
  const [newPrice, setNewPrice] = useState<number>(selectedProduct?.price ?? 0);
  const [newCategory, setNewCategory] = useState(selectedProduct?.category.id);
  const [newImage, setNewImage] = useState(selectedProduct?.images[0]);
  const [newInventory, setNewInventory] = useState<number>(selectedProduct?.inventory ?? 0);
  const returnPrice = (priceString: string) => {
    let priceRange = { min: 0, max: 0 };
    switch (priceString) {
        case 'under 100':
            priceRange.min = 1;
            priceRange.max = 100;
            break;
        case '100 to 200':
            priceRange.min = 100;
            priceRange.max = 200;
            break;
        case '200 to 400':
            priceRange.min = 200;
            priceRange.max = 400;
            break;
        case '400 to 600':
            priceRange.min = 400;
            priceRange.max = 600;
            break;
        case '600 to 800':
            priceRange.min = 600;
            priceRange.max = 800;
            break;
        case '800 above':
            priceRange.min = 800;
            priceRange.max = 10000000;
            break;
        default:
            priceRange.min = 0;
            priceRange.max = 10000000;
    }
    return priceRange;
}

const fetdata = async () => {
  console.log("action: " + action);
    await dispatch(getCategory()).then((action) => {
      if (action.payload && typeof action.payload !== "string") {
          setCategoryList(action.payload as Category[]);
      }
    });
    let price_range = returnPrice(price);
    await dispatch(fetchAllProducts({min: price_range.min, max: price_range.max})).then((action) => {
        if (action.payload && typeof action.payload !== "string") {
            setProducts(action.payload as Product[]);
        }
    });
}

useEffect(() => {
  fetdata();
}, []);


  const SortItem = async () => {
      let price_range = returnPrice(price);
      // console.log("cate: " + category + " price: " + price + " range: " + price_range)
      // if (category === null && price === '') {
          await dispatch(fetchAllProducts({min: price_range.min, max: price_range.max})).then((action) => {
              if (action && Array.isArray(action.payload)) {
                  // console.log("pro: " + JSON.stringify(action.payload))
                  setProducts(action.payload);
              } else {
                  setError("Product loading error")
              }
          })
      // }
  }


  const handleEditClick = () => {
    setMode("Edit");
  };

  const handleSaveClick = async (e: React.FormEvent) => {
    // Handle saving changes to the selected product
    e.preventDefault();
    if(mode === "Edit"){      
      const updatedProduct : UpdateProduct = {
        title: newTitle ?? "",
        price: typeof newPrice === 'number' ? newPrice : parseFloat(newPrice ?? "0"),
        categoryId: newCategory ?? "",
        description: newDescription ?? "",
        inventory: typeof newInventory === 'number' ? newInventory : parseInt(newInventory ?? "0"),
        images: [...(newImage ? [newImage] : [])] 
      }
      await dispatch(updateProduct({id: selectedProductId, product: updatedProduct}));
      fetdata();
      setMode("Edit");
      
    }
    else if(mode === "Add"){
      // setAddedProduct({
      const newProduct : AddProduct = {  
        title: newTitle ?? "",
        price: typeof newPrice === 'number' ? newPrice : parseFloat(newPrice ?? "0"),
        categoryId: newCategory ?? "",
        description: newDescription ?? "",
        inventory: typeof newInventory === 'number' ? newInventory : parseInt(newInventory ?? "0"),
        images: [...(newImage ? [newImage] : [])] 
      };
      const returnProduct = (await dispatch(createProduct(newProduct))).payload as Product | AddProduct;
             
      setMode("");
      fetdata();
    }
  };

  const handleCancelClick = () => {
    // Handle canceling edit mode
    setMode("");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    setMode("Add");
    e.preventDefault();
    setNewTitle("");
    setNewCategory(categoryList[0]?.id || "");
    setNewImage("");
    setNewInventory(0);
    setNewPrice(0);
    setNewDescription("");
    setSelectedProduct(null);
    setSelectedProductId("");    
  };

  const handleEditProduct = (product:Product) => {
    setMode("Edit");
    setSelectedProduct(product);
    setSelectedProductId(product.id);
    setNewTitle(product.title);
    setNewImage(product.images[0]);
    setNewDescription(product.description);
    setNewPrice(product.price);
    setNewInventory(product.inventory);
    setNewDescription(product.description);
    setNewCategory(product.category.id)
  };

  const handleDeleteProduct = async (product:Product) => {
    await dispatch(deleteProduct(product.id));
    fetdata();
  };

 
  const handleSortByTitle = () => {
    const newSort = sort === "asc" ? "desc" : "asc";
    setSort(newSort); 
  }

  return (
    <div >
      
      <div className='form' style={{background: 'white', width:'200px'}}>
          <button className="form__button" onClick={(e) => handleAddProduct(e)}>Add New Product</button>
        </div>
      <section className="cart__control-panel">
        <table className="cart__control-panel__items">
              <thead>
                <tr>
                  <th>ID</th>
                  <th> <a href="#" onClick={() => handleSortByTitle()} >Title</a></th>
                  <th>Price</th>
                  <th>Inventory</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>   
                    <td className="item__price">{item.price}</td>   
                    <td>{item.inventory}</td>                  
                    <td>{item.description}</td>
                    <td><img style={{width:"100px", height:"100px"}} src={item?.images[0]} /></td>
                    <td>
                      <div className="item__button">
                        {/* <Link to={`/user/${item.id}`}>Edit</Link> */}
                        <button onClick={() => handleEditProduct(item)}>Edit</button>
                        <button onClick={() => handleDeleteProduct(item)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>   
        </section>
      

      {(mode !=="")&& (
        <div className='form_wrapper'>
          <h2>Product Details</h2>
          { 
            <form className='form' onSubmit={handleSaveClick}>  
            <div className='form__group'>
                <label className='user-profile--edit__section__header'>Title:</label>
                <input 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  // Handle changes to the description textarea
                />
              </div>            
              <div className='form__group'>
                <label className='user-profile--edit__section__header'>Description:</label>
                <textarea 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  // Handle changes to the description textarea
                />
              </div>
              <div className='form__group'>
                <label className='user-profile--edit__section__header'>Price:</label>
                <input 
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                  // Handle changes to the price input
                />
              </div >
              <div className='form__group'>
                <label className='user-profile--edit__section__header'>Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {categoryList.map(cate => 
                    cate.id !== "" && (
                      <option key={cate.id} value={cate.id}>
                        {cate.title}
                      </option>
                    )
                  )}
                </select>
              </div >
              <div className='form__group'>
                <label className='user-profile--edit__section__header'>Inventory:</label>
                <input
                  type="number"
                  value={newInventory}
                  onChange={(e) => setNewInventory(parseFloat(e.target.value))}
                  // Handle changes to the price input
                />
              </div >
              <div className='form__group'>
                <label className='product-details__image'>Image:</label>
                <input type='text'  
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}/>
              </div >
              <div style={{alignSelf: "center"}}>
                <button className="form__button" >Save</button>
                <button className="form__button" onClick={handleCancelClick}>Cancel</button>
              </div>
            </form>
           }
        </div>
      )}
    </div>
  );
}

export default ProductForm;
