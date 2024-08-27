import React from 'react';
import { useLocation } from 'react-router-dom';
import './OrderConfirmationPage.css'; // Import your CSS file for styling

const OrderConfirmationPage = () => {
    const location = useLocation();
    const {
        orderType,
        address,
        branch,
        paymentMethod,
        cart = [], // Default to an empty array if cart is undefined
        fullName,
    } = location.state || {}; // Added fullName and branch

    const getPickupTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 25);
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    };

    return (
        <div className="confirmation-page">
            <div className="header">
                <h1>Order Confirmed!</h1>
            </div>

            <div className="order-summary">
                <h2>Thank you, {fullName}!</h2>
                {orderType === 'delivery' ? (
                    <p>The order will arrive at {getPickupTime()}.</p>
                ) : (
                    <p>Your order from {branch} will be ready at {getPickupTime()}.</p>
                )}
            </div>

            <div className="order-details">
                <h3>Order Details</h3>
                {cart.map((item, index) => (
                    <div key={index} className="summary-item">
                        <h4>{item.dish}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>Extras: {Object.entries(item.extras).flatMap(([category, extras]) => 
                            extras.map(extra => extra.name)
                        ).join(', ')}</p>
                        <p>Price: ₪{item.totalPrice.toFixed(2)}</p>
                    </div>
                ))}
                <p className="total-price">Total: ₪{getTotalPrice().toFixed(2)}</p>
            </div>

            <div className="footer">
                <p>If you have any questions or need to make changes to your order, please contact us at 0000-000-000.</p>
            </div>
        </div>
    );
};


export default OrderConfirmationPage;
