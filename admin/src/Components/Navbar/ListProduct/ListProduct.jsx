import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../../assets/cross_icon.png'

const ListProduct = () => {
const [allproducts , setAllproducts] = useState([]);

const fetchInfo = async () => {
  await fetch('http://localhost:4000/allproducts')
  .then((res)=>res.json())
  .then((data)=>{
    setAllproducts(data)
  });
}


const RemoveProduct = async (id)=>{
  await fetch('http://localhost:4000/removeproduct',  {
    method: 'POST',
    headers:{
      Accept:'application/json',
      'Content-Type':'application/json'
    },
    body:JSON.stringify({id:id})
  }
 ).then((res)=>res.json())
 .then((data)=> {data.success?alert("Product Removed"):alert("Failed")});

 await fetchInfo();

}


useEffect(()=>{
  fetchInfo();
},[])


  return (
    <div className='list-product'>
      <h1>All Product List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
       
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,index)=>{
   return (
    <React.Fragment key={index}>
      <div className="listproduct-format-main listproduct-format">
        <img src={product.image} alt="" className="listproduct-product-icon" />
        <p>{product.name}</p>
        <p>${product.old_price}</p>
        <p>${product.new_price}</p>
        <p>{product.category}</p>
        <img  onClick={()=>{RemoveProduct(product.id)} }
        src={cross_icon}  alt="" className="listproduct-remove-icon" />
      </div>
      <hr />
    </React.Fragment>
  );
  
        })}

      </div>

      
    </div>
  )
}

export default ListProduct
