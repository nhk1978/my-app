import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useAppDispatch from '../hooks/useAppDispatch'
import { Product } from '../types/Product'
import { Category } from '../types/Category'
import { AppDispatch, GlobalState } from '../redux/store'
import { fetchAllProducts } from '../redux/reducers/productsReducer'
import MenuIcon from '@mui/icons-material/Menu';
import ProductDetail from './ProductDetail';
import { getCategory } from '../redux/reducers/categoriesReducer';
// import './Body.css'
// import { useSelector } from 'react-redux';
// import { CartState } from '../redux/reducers/CartSlice';
// import { emit } from 'process';

const Products = () => {
    const [data, setData] = useState<Product[]>([])
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch: AppDispatch = useAppDispatch();
    const [categoryList, setCategoryList] = useState<Category[] | null>(null)
    const [category, setCategory] = useState<Category | null>(null)
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(30);
    const [price, setPrice] = useState('under 100');
    const [maxP, setMaxP] = useState(-1);
    const [range, setRange] = useState('');
    const [deleteClick, setDeleteClick] = useState(false)
    const perPage: number[] = [10, 20, 50, 100]
    const priceRange: string[] = ["0-100", "100-300", "300-500", "500-1000"]
    const [selectedProductId, setSelectedProductId] = useState(0);

    useEffect(() => {
        SortItem()
    }, [dispatch, category, price]);

    useEffect(() => {
        dispatch(getCategory()).then((action) => {
            if (action.payload && typeof action.payload !== "string") {
                setCategoryList(action.payload as Category[]);
            }
        })
    }, [])

    const SortItem = () => {
        let price_range = returnPrice(price);
        // console.log("cate: " + category + " price: " + price + " range: " + price_range)
        if (category === null && price === '') {
            dispatch(fetchAllProducts({min: price_range.min, max: price_range.max})).then((action) => {
                if (action && Array.isArray(action.payload)) {
                    // console.log("pro: " + JSON.stringify(action.payload))
                    setData(action.payload);
                } else {
                    setError("Product loading error")
                }
            })
        }
        else if (category === null) {
            dispatch(fetchAllProducts({ min: price_range.min, max: price_range.max })).then((action) => {
                if (action && Array.isArray(action.payload)) {
                    // console.log("pro: " + JSON.stringify(action.payload))
                    setData(action.payload);
                } else {
                    setError("Product loading error")
                }
            })
        }
        else if (price === '') {
            dispatch(fetchAllProducts({ id: category.id })).then((action) => {
                if (action && Array.isArray(action.payload)) {
                    // console.log("pro: " + JSON.stringify(action.payload))
                    setData(action.payload);
                } else {
                    setError("Product loading error")
                }
            })
        }
        else {
            dispatch(fetchAllProducts({
                id: category.id,
                min: price_range.min,
                max: price_range.max
            })).then((action) => {
                if (action && Array.isArray(action.payload)) {
                    // console.log("pro: " + JSON.stringify(action.payload))
                    setData(action.payload);
                } else {
                    setError("Product loading error")
                }
            })
        }
    }

    const rangeList = [
        'under 100',
        '100 to 200',
        '200 to 400',
        '400 to 600',
        '600 to 800',
        '800 above'
    ]

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

 

    const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        // console.log("newValue: " + newValue);
        setPrice(newValue);
    };

    const handleCategory = (cate: Category) => {
        setCategory(cate)
    }


    return (
        <div className='body'>
            {/* top body part */}
            <div className='headerBottom'>
                <MenuIcon style={{ color: "white", paddingTop: 4 }} />
                {categoryList?.map((cate: Category, index: number) => {
                    return (
                        <p onClick={() => handleCategory(cate)} className="headerBottomText" key={index}>{cate.title}</p>
                    )
                })}
                <p className='priceRange'>
                    {/* <input type="range" value={price} onChange={handlePriceChange} id="priceRangeId" list="values" /> */}
                    <label className='priceLable' htmlFor="priceRangeId">Price range</label>
                    <select className='selectRange'
                        id="PriceRange"
                        value={price}
                        onChange={handlePriceChange}
                    >
                        {rangeList.map((ran, index) => (
                            <option className='optionRange' key={index} value={ran}>{ran}</option>
                        ))}
                    </select>
                </p>

            </div>
            <div className='bodyItems'>
                {
                    data.map((prod, index) => (
                        <ProductDetail item={prod} key={index} />
                    ))
                }
            </div>
        </div>
    )
}

export default Products

