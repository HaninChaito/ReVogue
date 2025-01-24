import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
    availableSizes: [],
    condition: "New", // Default condition
  });

  const [sizeOptions] = useState(["S", "M", "L", "XL", "XXL"]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
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
        availableSizes: selectedSizes,
      };

      console.log("Product details after image upload:", updatedProductDetails);

      const addProductResponse = await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductDetails),
      });

      const addProductData = await addProductResponse.json();
      if (addProductData.success) {
        alert("Product Added");
      } else {
        alert("Failed to add product");
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

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type='text' name='old_price' placeholder='Type Here' />
        </div>

        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type='text' name='new_price' placeholder='Type Here' />
        </div>
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
        <p>Condition</p>
        <select value={productDetails.condition} onChange={changeHandler} name="condition" className='add-product-selector'>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <p>Available Sizes</p>
        <div className="addproduct-sizes">
          {sizeOptions.map((size) => (
            <button
              key={size}
              className={selectedSizes.includes(size) ? 'size-selected' : ''}
              onClick={() => toggleSize(size)}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor='file-input'>
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>

      <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
    </div>
  );
};

export default AddProduct;
