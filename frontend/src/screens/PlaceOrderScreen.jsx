import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row, ListGroup, Image, Card, Button } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";

const PlaceOrderScreen = () => {
  // useNavigate() is a hook that returns the navigate function which takes a string as an argument and navigates to the path.
  const navigate = useNavigate();

  // Use the useSelector hook to select the cart state.
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    // If there is no address in the shippingAddress object of the cart state, then navigate to the shipping screen.
    // If there is no payment method in the paymentMethod object of the cart state, then navigate to the payment screen.
    if (!cart.shippingAddress?.address) {
      navigate("/shipping")
    } else if (!cart.paymentMethod) {
      navigate("/payment")
    }
  }, [cart.shippingAddress?.address, cart.paymentMethod, navigate]);
  return <div>
    <CheckoutSteps step1 step2 step3 step4 />
    <Row>
      <Col md={8}>Column!</Col>
      <Col md={4}>Column!</Col>
    </Row>
  </div>;
};

export default PlaceOrderScreen;
