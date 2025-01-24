import React, { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import './RelatedProducts.css'
import Item from '../Item/Item'


const RelatedProducts = () => {
   const {all_product} = useContext(ShopContext);
  return (
    <div className='relatedproducts'>
        <h1>Related Products</h1>
        <hr />
        <div className="relatedproducts-item">
          {all_product.map((item,i)=>{
             return <Item key= {i} id={item.id} name={item.name} category={item.category}image={item.image} new_price={item.new_price} old_price={item.old_price} />
          })}
        </div>
      
    </div>
  )
}

export default RelatedProducts
