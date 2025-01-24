import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Navbar/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import AddProduct from '../../Components/Navbar/AddProduct/AddProduct'
import ListProduct from '../../Components/Navbar/ListProduct/ListProduct'
import AddPromo from '../../Components/Navbar/AddPromo/AddPromo'
import RemovePromo from '../../Components/Navbar/RemovePromo/RemovePromo'
import Requests from '../../Components/Navbar/Requests/Requests'

const Admin = () => {
  return (
    <div className="admin">
        <Sidebar />
        <Routes>
           <Route path='/listproduct' element={<ListProduct/>} />
            <Route path ='/addproduct' element={<AddProduct/>}/>
            <Route path='/addpromo'element={<AddPromo/>} />
            <Route path='/removepromo' element={<RemovePromo/>} />
            <Route path = '/requests' element = {<Requests/>} />
        </Routes>
      
    </div>
  )
}

export default Admin
