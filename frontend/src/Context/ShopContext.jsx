import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState([]); // Array to store cart item objects

    // Fetch all products and cart data from backend
    useEffect(() => {
        // Fetch all products
        fetch('http://localhost:4000/allproducts')
            .then((res) => res.json())
            .then((data) => setAll_Product(data));

        // Fetch user cart
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setCartItems(data);
                    } else {
                        console.warn("Invalid cart data, setting to empty array");
                        setCartItems([]); // Fallback to empty array
                    }
                })
                
                .catch((error) => console.error('Error fetching cart:', error));
        }
    }, []);

    // Add item to cart
    const addToCart = (productId, size) => {
        if (!localStorage.getItem('auth-token')) {
            alert("You must be logged in to add items to your cart!");
            return;
        }
    console.log("the products added to the cart are of id " ,productId );
        const product = all_product.find((prod) => prod.id === productId);
    
        if (product) {
            // Sync with backend first
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    size,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {// Update cart State only after successful backend sync
                        
                        const existingItemIndex = cartItems.findIndex(
                            (item) => item.productId === product._id && item.size === size
                        );
    
                        let updatedCart;
    
                        if (existingItemIndex > -1) { //if item prev existed in the cart increment its quantity
                            updatedCart = [...cartItems];
                            updatedCart[existingItemIndex].quantity += 1;
                        } else {
                            updatedCart = [
                                ...cartItems,
                                {
                                    productId: product._id,
                                    name: product.name,
                                    image: product.image,
                                    condition: product.condition , 
                                    category: product.category,
                                    price: product.new_price,
                                    size,
                                    quantity: 1,
                                },
                            ];
                        }
    
                        setCartItems(updatedCart);
                        alert('Item Added to the Cart');
                    } else {
                        alert("Failed to add item to the cart. Please try again.");
                    }
                })
                .catch((error) => {
                    console.error('Error syncing with backend:', error);
                });
        }
    };
    

    // Remove item from cart
    const removeFromCart = (productId, size) => {
        const updatedCart = cartItems.reduce((acc, item) => {
            if (item.productId != productId && item.size != size) {
            
                acc.push(item);//the reduce adds the cart items which are un intended to be deleted to the accumulator , and the we will assign the value of the acc to the updated cart
            }
            return acc;
        }, []);

        setCartItems(updatedCart);

     
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    size,
                }),
            })
                .then((res) => res.json())
                .then((data) => console.log(data))
                .catch((error) => console.error('Error:', error));
        }
    };

    // Calculate total cart amount
    const getTotalCartAmount = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity, //here the total is the accumulator
            0 //the initial value of total is zero
        );
    };

   
    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
    };

    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
