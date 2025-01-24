import React, { useState } from 'react';
import './RemovePromo.css';

const RemovePromo = () => {
  const [promocode, setPromo] = useState(""); 

  const handleInputChange = (e) => {
    setPromo(e.target.value); 
  };


  const Remove_Promo = async ()=>{
    await fetch('http://localhost:4000/removepromo',  {
      method: 'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json'
      },
      body:JSON.stringify({ name: promocode })
    }
   ).then((res)=>res.json())
   .then((data)=> {data.success?alert("Code Removed"):alert("Couldn't Remove PromoCode")});
  }  

  

  return (
    <div className='promo'>
      <div className='promo-name'>
        <p>The PromoCode you want to Delete</p>
        <input 
          type="text" 
          placeholder='XX10' 
          value={promocode} 
          onChange={handleInputChange} 
        />
      </div>


      <button onClick={Remove_Promo} className='removepromo-btn'>Remove</button>
    </div>
  );
};

export default RemovePromo;
