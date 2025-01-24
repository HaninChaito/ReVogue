import React, { useState } from 'react'
import './AddPromo.css'

const AddPromo = () => {

    const [promo , setpromo] = useState({
        name:"",
        discount:""
    })

    const changeHandler = (e) => {
        setpromo({...promo,[e.target.name]:e.target.value})
      }


      const Add_PromoCode = async () => {
        console.log(promo);
        let code = promo;
      
        await fetch('http://localhost:4000/addpromo', {
          method: 'POST',
          headers:{
            Accept:'application/json',
            'Content-Type':'application/json'
          },
          body: JSON.stringify(code)
        }).then((resp)=>resp.json()).then((data)=>{
          data.success?alert("Promo Code Added"):alert("PromoCode Name Already Exists")
        })
      };



  return (
    <div className='promo'>
        <div className="addpromo">
        <p>PromoCode Name</p>
        <input value={promo.name}onChange={changeHandler} type='text' name='name' placeholder='Type here'/>
      </div>

      <div className="addpromo">
        <p>PromoCode Discount Value</p>
        <input value={promo.discount}onChange={changeHandler} type='text' name='discount' placeholder='Type here'/>
      </div>


      <button onClick={()=>{Add_PromoCode()}} className='addpromo-btn'>ADD</button>
      
    </div>
  )
}

export default AddPromo
