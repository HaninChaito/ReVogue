import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [showCondition, setShowCondition] = useState("New"); // Track condition to display

  const handleToggleCondition = () => {
    setShowCondition((prevCondition) => (prevCondition === "New" ? "Used" : "New"));
  };

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span> out of 36 products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>

      <div className="shopcategory-condition-toggle">
        <button onClick={handleToggleCondition}>
          {showCondition === "New" ? "Used Products" : "New Products"}
        </button>
      </div>

      <div className="shopcategory-products">
        {all_product
          .filter((item) => item.category === props.category && item.condition === showCondition)
          .map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
      </div>

      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
};

export default ShopCategory;
