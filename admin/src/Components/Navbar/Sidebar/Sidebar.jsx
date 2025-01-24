import React from 'react'
import './Sidebar.css'
import {Link} from "react-router-dom"
import add_product_icon from '../../../assets/Product_Cart.svg'
import list_product_icon from '../../../assets/Product_list_icon.svg'

const Sidebar = () => {
  return (
    <div className='sidebar'>
  <Link to={'addproduct'} style={({textDecoration:"none"})}>
  <div className="sidebar-item">
  <img src={add_product_icon} alt="" />
  <p>Add Product</p>
  </div>
  </Link>


  <Link to={'listproduct'} style={({textDecoration:"none"})}>
  <div className="sidebar-item">
  <img src={list_product_icon} alt="" />
  <p>Product List</p>
  </div>
  </Link>


  <Link to={'requests'} style={({textDecoration:"none"})}>
  <div className="sidebar-item">
  <p>Manage Requests</p>
  </div>
  </Link>

  <Link to={'addpromo'} style={({textDecoration:"none"})}>
  <div className="sidebar-item">
  <p>Add PromoCode</p>
  </div>
  </Link>

  <Link to={'removepromo'} style={({textDecoration:"none"})}>
  <div className="sidebar-item">
  <p>Remove PromoCode</p>
  </div>
  </Link>
      
      
    </div>
  )
}

export default Sidebar
