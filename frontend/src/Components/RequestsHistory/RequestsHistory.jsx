import React, { useEffect, useState } from 'react';
import './RequestsHistory.css'

const RequestsHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch requests on component mount
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:4000/getrequests', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });

        const data = await response.json();

        if (data.success) {
          setRequests(data.data);
        } else {
          setError(data.message || 'Failed to fetch requests');
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('An error occurred while fetching requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (requests.length === 0) {
    return <div>No requests found</div>;
  }

  return (
    <div className="requests-history">
      <h1>Requests History</h1>
      <div className="requests-list">
        {requests.map((request) => (
          <div key={request.id} className="request-card">
            <img src={request.image} alt={request.Product_name} className="request-image" />
            <div className="request-details">
              <h2>{request.Product_name}</h2>
              <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
              <p><strong>Pickup Address:</strong> {request.pickupAddress}</p>
              <p><strong>Available Sizes:</strong> {request.availableSizes.join(', ')}</p>
              <p><strong>Status:</strong> {request.status}</p>

              {request.status === 'Accepted' && (
                <p className="message">
                  Please check your email ({request.DonorEmail}) for contact details.
                </p>
              )}
              {request.status === 'Denied' && (
                <p className="message">Thank you!</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsHistory;
