import React, { useState } from 'react'
import './CartItems.css'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'
import { useNavigate } from 'react-router-dom';


const CartItems = () => {
   const navigate = useNavigate();
    const {getTotalCartAmount,all_product,cartItems,removeFromCart}= useContext(ShopContext);
    const [promo,setPromo] = useState("");
    const [discount , setDiscount] = useState("");
    const [checkoutDetails , setcheckoutDetails] = useState(
        {
          email : "",
          username :"",
          finalprice : ""
      
        }
      )

    const handleInputChange = (e) => {
        setPromo(e.target.value); 
      };




      const Find_Promo = async ()=>{
        await fetch('http://localhost:4000/getpromocode',  {
          method: 'POST',
          headers:{
            Accept:'application/json',
            'Content-Type':'application/json'
          },
          body:JSON.stringify({ name: promo })
        }
       ).then((res)=>res.json())
       .then((data) => {
        if (data.success) {
            setDiscount(data.discount);
            alert(`You got your ${data.discount}% discount!`);
        } else {
            alert("Promocode Not Valid");
        }
    });
    
      }  



      const Checkout = async ()=>{
        const totalPrice = getTotalCartAmount();
        if (localStorage.getItem('auth-token')){
await fetch('http://localhost:4000/checkout', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'auth-token': `${localStorage.getItem('auth-token')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ discount, totalPrice }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      setcheckoutDetails({
        email: data.email,
        username: data.username,
        finalprice: data.finalPrice,
      });
     

      navigate('/checkout', {
        state: { checkoutDetails : data},
      });
    } else {
      alert('Could not proceed to checkout');
    }
  }); }

    
      }  
    


  return (
    <div className='cartitems'>
        <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Size</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
            
        </div>
        <hr />
       
  {console.log("fetching cart items in the cart part") }    
{console.log(cartItems)}
  
 
        {all_product.map((e) => {
    // Find all cart items matching this product
   
    const matchingCartItems = cartItems.filter((item) => item.productId === e._id);
   
    

    // If there are matching cart items, render them
    if (matchingCartItems.length > 0) {
        return (
            <div key={e.id}>
                {matchingCartItems.map((cartItem, index) => (
                    <div key={index} className="cartitems-format cartitems-format-main">
                        <img src={e.image} alt="" className="carticon-product-icon" />
                        <p>{e.name}</p>
                        <p>{cartItem.size}</p> 
                        <p>${cartItem.price}</p> 
                        <button className="cartitems-quantity">{cartItem.quantity}</button>
                        <p>${cartItem.price * cartItem.quantity}</p> 
                        <img
                            className="carticon-remove-icon"
                            src={remove_icon}
                            onClick={() => {
                                removeFromCart(cartItem.productId,cartItem.size);
                            }}
                            alt=""
                        />
                    </div>
                ))}
                <hr />
            </div>
        );
    }

    return null; 
})}

 <div className="cartitems-down">
    <div className="cartitems-total">
        <h1>Cart Totals</h1>
        <div>
            <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${getTotalCartAmount()}</h3>
            </div>
        </div>
        </div>
<div className="cartitems-promocode">
    <p>If you have a promo code enter it here </p>
    <div className="cartitems-promobox">
        < input  type="text" 
          placeholder='XX10' 
          value={promo} 
          onChange={handleInputChange} />
       {promo? <button onClick={Find_Promo}>Submit</button> : <></>}
      
    </div>
</div>
<div className="checkout">
<button onClick={Checkout}>PROCEED TO CHECKOUT</button>

</div>
 </div>


    </div>
  )
}

export default CartItems
