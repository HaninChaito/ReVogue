import React, { useState } from 'react';
import upload_area from '../Assets/upload_area.svg';
import './Request.css';

const Request = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    availableSizes: [], // This will hold the selected size
    pickupAddress: "",
    price:"",
    status: "Pending",
  });

  const [sizeOptions] = useState(["S", "M", "L", "XL", "XXL"]);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const selectSize = (size) => {
    setProductDetails({ ...productDetails, availableSizes: [size] }); // Allow only one size
  };

  const Add_Product = async () => {
    console.log("Product details before upload:", productDetails);

    if (!image) {
      console.error('No image selected');
      return;
    }

    let formData = new FormData();
    formData.append('product', image);

    try {
      const uploadResponse = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      console.log("Image upload response:", uploadData);

      if (!uploadData.success) {
        console.error('Image upload failed:', uploadData.message);
        return;
      }

      const updatedProductDetails = {
        ...productDetails,
        image: uploadData.image_url,
      };

      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert("Please login first");
        return;
      }

      const addProductResponse = await fetch('http://localhost:4000/addrequest', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify(updatedProductDetails),
      });

      const addProductData = await addProductResponse.json();
      if (addProductData.success) {
        alert("Request Added");
      } else {
        alert("Failed to send request");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type='text' name='name' placeholder='Type here' />
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <p>Available Size</p>
        <div className="addproduct-sizes">
          {sizeOptions.map((size) => (
            <button
              key={size}
              className={productDetails.availableSizes[0] === size ? 'size-selected' : ''}
              onClick={() => selectSize(size)}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      <div className="addproduct-itemfield">
        <p>Price</p>
        <input value={productDetails.price} onChange={changeHandler} type='number' name='price' placeholder='For how much you want to sell it?' />
      </div>


      <div className="addproduct-itemfield">
        <label htmlFor='file-input'>
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>



      <div className="addproduct-itemfield">
        <p>Pickup Address</p>
        <input value={productDetails.pickupAddress} onChange={changeHandler} type='text' name='pickupAddress' placeholder='Enter Pickup Address' />
      </div>

      <button onClick={Add_Product} className='addproduct-btn'>Send Request</button>
    </div>
  );
};

export default Request;
