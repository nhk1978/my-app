import { CartProps } from '../../types/Product';


export const cartReducer = (state: CartProps[], action: any) => {
  const cartPropduct = action.payload
  switch (action.type) {
    case 'ADD_TO_CART':{
      const existingProduct = state.find((item) => item.product.id === cartPropduct.product.id);
      if (existingProduct) {
        return state.map((item) =>
          item.product.id === cartPropduct.product.id ? { ...item, quantity: item.quantity + cartPropduct.quantity } : item
        );
      } else {
        return [...state, cartPropduct];
      }
    }
    case  'INCREASE_QUANTITY':{
        const existingProduct = state.find((item) => item.product.id === cartPropduct.product.id);
        if (existingProduct) {
            return state.map((item) =>
            item.product.id === cartPropduct.product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            return [...state, cartPropduct];
        }
    }
    case  'DECREASE_QUANTITY':{   
        if(cartPropduct.quantity > 1)
            return state.map((item) =>
                item.product.id === cartPropduct.product.id ? { ...item, quantity: item.quantity - 1 } : item
            );
        else {
            state = state.filter(item => item.product.id !== cartPropduct.product.id)
            return state
        }
    }
    case  'DELETE_FROM_CART':{                    
      return  state = state.filter(item => item.product.id !== cartPropduct.product.id)
    }
      
    default:
      return state;
  }
};
