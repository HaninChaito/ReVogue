import React, { useEffect, useState } from 'react';
import './Requests.css';
import cross_icon from '../../../assets/cross_icon.png'; // Replace with your actual path

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [price, setPrice] = useState(""); // To set price during accept
  const [showPriceInput, setShowPriceInput] = useState(null); // To track which request is being processed

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:4000/AdminGetRequest');
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
      } else {
        console.error('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleDeny = async (id) => {
    try {
      const response = await fetch('http://localhost:4000/AdminDenyRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        setRequests(requests.filter((request) => request.id !== id));
        alert('Request Denied');
      } else {
        console.error('Failed to deny request');
      }
    } catch (error) {
      console.error('Error denying request:', error);
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await fetch('http://localhost:4000/AdminAcceptRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, price }),
      });
      const data = await response.json();
      if (data.success) {
        setRequests(requests.filter((request) => request.id !== id));
        setShowPriceInput(null);
        alert('Request Accepted and Product Added');
      } else {
        console.error('Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="requests">
      <h1>Requests</h1>
      <div className="requests-header">
        <p>Image</p>
        <p>Product Name</p>
        <p>Available Sizes</p>
        <p>Pickup Address</p>
        <p>Suggested Price</p>
        <p>Category</p>
        <p>Sender Email</p>
        <p>Actions</p>
      </div>
      <div className="requests-body">
        <hr />
        {requests.length === 0 ? (
          <p>No requests available</p>
        ) : (
          requests.map((request, index) => (
            <React.Fragment key={index}>
              <div className="requests-row">
                <img src={request.image} alt="Product" className="requests-product-image" />
                <p>{request.Product_name}</p>
                <p>{request.availableSizes.join(', ')}</p>
                <p>{request.pickupAddress}</p>
                <p></p>
                <p>{request.suggestedPrice}</p>
                <p>{request.category}</p>
                <p>{request.DonorEmail }</p>
                <div className="requests-actions">
                  <img
                    src={cross_icon}
                    alt="Deny"
                    className="requests-remove-icon"
                    onClick={() => handleDeny(request.id)}
                  />
                  <button
                    onClick={() => setShowPriceInput(request.id)}
                    className="requests-accept-btn"
                  >
                    ✔️
                  </button>
                </div>
                {showPriceInput === request.id && (
                  <div className="requests-price-input">
                    <input
                      type="number"
                      placeholder="Set price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <button onClick={() => handleAccept(request.id)}>Confirm</button>
                  </div>
                )}
              </div>
              <hr />
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default Requests;
