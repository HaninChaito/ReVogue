import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
           <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>  

        <div className="descriptionbox-description">
            <p>
                An e-commerce website is an online website that facilitate buying and selling of products..
            </p>
            <p>
                E-commerce websites usually display products .. 
            </p>
        </div>

      
    </div>
  )
}

export default DescriptionBox
