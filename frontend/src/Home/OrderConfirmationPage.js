import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './css/OrderConfirmationPage.css'; // Import your CSS file for styling
import { OrderContext } from '../Providers/OrderProvider';

const OrderConfirmationPage = () => {
    const { order, updateOrder } = useContext(OrderContext);
    const cart = order?.items || [];
    const orderType = order.orderType;

    const location = useLocation();
    const {
        //orderType,
        address,
        branch,
        paymentMethod,
        //cart = [], // Default to an empty array if cart is undefined
        fullName,
    } = location.state || {}; // Added fullName and branch

    const getPickupTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 25);
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getTotalPrice = () => {
        //return cart.reduce((total, item) => total + item.totalPrice, 0);
        return order.total;
    };

    return (
        <div className="confirmation-page">
            <div className="header">
                <h1>ההזמנה אושרה!</h1>
            </div>

            <div className="order-summary">
                <h2>תודה, {fullName}!</h2>
                {orderType === 'delivery' ? (
                    <p>ההזמנה תגיע ב {getPickupTime()}.</p>
                ) : (
                    <p>ההזמנה שלך מסניף {order.branch} תהיה מוכנה ב {getPickupTime()}.</p>
                )}
            </div>

            <div className="order-details">
                <h3>פרטי הזמנה</h3>
                {cart.map((item, index) => (
                    <div key={index} className="summary-item">
                        <h4>{item.dish}</h4>
                        <p>כמות: {item.quantity}</p>
                        <p>תוספות: {Object.entries(item.extras).flatMap(([category, extras]) => 
                            extras.map(extra => extra.name)
                        ).join(', ')}</p>
                        <p>מחיר: ₪{item.totalPrice.toFixed(2)}</p>
                    </div>
                ))}
                <p className="total-price">סה"כ: ₪{getTotalPrice().toFixed(2)}</p>
            </div>

            <div className="footer">
                <p>0000-000-000 אם יש לך עוד שאלות או שברצונך לבצע שינויים בהזמנה, אנא צור קשר בטלפון </p>
            </div>
        </div>
    );
};


export default OrderConfirmationPage;
