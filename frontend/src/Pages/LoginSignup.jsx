import React, { useState } from 'react'
import './CSS/LoginSignup.css'
const LoginSignup = () => {
const [state , setState] = useState("Login");


const [formdata , setformdata] = useState({
  username : "",
  email : "",
  password :""
}) 

const changeHandler = (e) =>{
  setformdata({...formdata,[e.target.name]:e.target.value});
}



const login = async () =>{
  console.log("Login",formdata);
  let responseData ;
  await fetch('http://localhost:4000/login',{
  
        method: 'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },

        body:JSON.stringify(formdata)

    
  }).then((res)=>res.json())
  .then((data)=> responseData=data)

  if(responseData.success){
    localStorage.setItem('auth-token',responseData.token);
    window.location.replace('/');
  }else{
    alert(responseData.errors)
  }


}


const signUp = async () =>{
  console.log("Sign Up",formdata);
  let responseData ;
  await fetch('http://localhost:4000/signup',{
  
        method: 'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },

        body:JSON.stringify(formdata)

    
  }).then((res)=>res.json())
  .then((data)=> responseData=data)

  if(responseData.success){
    localStorage.setItem('auth-token',responseData.token);
    window.location.replace('/');
  }else{
    alert(responseData.errors)
  }


}


  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === 'Sign Up'?<input type='text' name='username' value={formdata.username} onChange={changeHandler} placeholder='Your Name'/>:<></> }
          <input type='email' name='email' value={formdata.email} onChange={changeHandler} placeholder='Email Address'/>
          <input type='password' name='password' value={formdata.password} onChange={changeHandler} placeholder='Password' />
        </div>
        <button onClick={()=>{
          state==="Login"?login():signUp()
        }} >Continue</button>


   {state === "Sign Up"?<p className='loginsignup-login'>Already have a account <span onClick={()=>{setState("Login")}} >Login Here</span> </p>:
   <p className='loginsignup-login'>Create An Account <span onClick={()=>{setState("Sign Up")}}>Click Here</span> </p>}     
  
     <div className="loginsignup-agree">
      <input type="checkbox" name='' id=''/>
      <p>By Continuing I agree yo the terms of use and privacy policy.</p>
     </div>
     
      </div>
    </div>
  )
}

export default LoginSignup
