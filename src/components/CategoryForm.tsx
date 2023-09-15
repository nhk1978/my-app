import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAppDispatch from '../hooks/useAppDispatch'
import { AddCategory, Category, UpdateCategory } from '../types/Category'
import { AppDispatch, GlobalState } from '../redux/store'
import {createCategory, deleteCategory, getCategory, updateCategory } from '../redux/reducers/categoriesReducer'


const CategoryForm = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [mode, setMode] = useState("");

  const [Categories, setCategories] = useState<(Category | AddCategory)[]>([])
  const dispatch: AppDispatch = useAppDispatch();
  const [price, setPrice] = useState('0 100000');
  const [selectedCategory, setSelectedCategory] = useState<Category|null>(null);
  const [addedCategory, setAddedCategory] = useState<AddCategory|null>(null); 
  const [sort, setSort] = useState<"asc" | "desc">("asc")
  const [newTitle, setNewTitle] = useState(selectedCategory?.title);
  const [newDescription, setNewDescription] = useState(selectedCategory?.description); 
  const [newImage, setNewImage] = useState(selectedCategory?.image);
  

const fetdata = async () => {
    await dispatch(getCategory()).then((action) => {
      if (action.payload && typeof action.payload !== "string") {
          setCategories(action.payload as Category[]);
      }
    });
}

useEffect(() => {
  fetdata();
}, []);


  const handleSaveClick = async (e: React.FormEvent) => {
    // Handle saving changes to the selected Category
    e.preventDefault();
    if(mode === "Edit"){      
      const updatedCategory : UpdateCategory = {
        // id: selectedCategoryId ?? "",
        title: newTitle ?? "",
        description: newDescription ?? "",
        image: newImage ?? ""
      }
      await dispatch(updateCategory({id: selectedCategoryId, category: updatedCategory}));      
      fetdata();
      setMode("Edit");      
    }
    else if(mode === "Add"){
      // setAddedCategory({
      const newCategory : AddCategory = {  
        title: newTitle ?? "",
        description: newDescription ?? "",
        image: newImage ?? "" 
      };
      const returnCategory = (await dispatch(createCategory(newCategory))).payload as Category | AddCategory;
      setMode("");
      fetdata();
    }
  };

  const handleCancelClick = () => {
    setMode("");
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setNewTitle("");
    setNewImage("");
    setNewDescription("");
    setMode("Add");
  };
  const handleEditCategory = (category:Category) => {
    setSelectedCategory(category);
    setSelectedCategoryId(category.id);
    setNewTitle(category.title);
    setNewImage(category.image);
    setNewDescription(category.description);
    setMode("Edit");
  };

  const handleDeleteCategory = async (Category:Category) => {
    const result = await dispatch(deleteCategory(Category.id));
    fetdata();
  };

 
  const handleSortByTitle = () => {
    const newSort = sort === "asc" ? "desc" : "asc";
    setSort(newSort); 
    // dispatch(sortByTitle(sort))    
    // setData(useSelector((initialState: GlobalState ) => initialState.users))
  }

  return (
    <div >
      
      <div className='form' style={{background: 'white', width:'200px'}}>
          <button className="form__button" onClick={(e) => handleAddCategory(e)}>Add New Category</button>
        </div>
      <section className="cart__control-panel">
        <table className="cart__control-panel__items">
              <thead>
                <tr>
                  <th>ID</th>
                  <th> <a href="#" onClick={() => handleSortByTitle()} >Title</a></th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Categories.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>                  
                    <td>{item.description}</td>
                    <td><img style={{width:"100px", height:"100px"}} src={item?.image} /></td>
                    <td>
                      <div className="item__button">
                        {/* <Link to={`/user/${item.id}`}>Edit</Link> */}
                        <button onClick={() => handleEditCategory(item)}>Edit</button>
                        <button onClick={() => handleDeleteCategory(item)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>   
        </section>
      

      {(mode !=="")&& (
        <div className='form_wrapper'>
          <h2>Category Details</h2>
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
                <label className='Category-details__image'>Image:</label>
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

export default CategoryForm;
