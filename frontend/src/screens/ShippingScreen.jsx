import React, { useState } from 'react'
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../slices/cartSlice.js";
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
  //We need to get the cart state with useSelector.
  const cart = useSelector((state) => state.cart);

  //We destructure the shipping address from the cart state.
  const { shippingAddress } = cart;

  //We need to set the initial state of the address, city, postalCode, and country to the shipping address in the cart state.
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Dispatch the saveShippingAddress action so we change the shipping address in the state and save to localStorage.
  //When we dispatch, we call saveShippingAddress and pass in the address, city, postalCode, and country.
  //Then we navigate to the payment page.

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
    console.log("Submitted!");
  };
  return (
    <FormContainer>
    <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="city" className="my-2">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="postalCode" className="my-2">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="country" className="my-2">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="my-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen