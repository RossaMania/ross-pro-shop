import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Col, Row, ListGroup, Image, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
  // useNavigate() is a hook that returns the navigate function which takes a string as an argument and navigates to the path.
  const navigate = useNavigate();

  // useDispatch() returns the reference to the dispatch function from the Redux store.
  const dispatch = useDispatch();

  // Use the useSelector hook to select the cart state.
  const cart = useSelector((state) => state.cart);

  const [createOrder, {isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    // If there is no address in the shippingAddress object of the cart state, then navigate to the shipping screen.
    // If there is no payment method in the paymentMethod object of the cart state, then navigate to the payment screen.
    if (!cart.shippingAddress?.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.shippingAddress?.address, cart.paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
      console.log("Order placed!");
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              {/* This shows the shipping information put in by the user for the order. */}
              <h2>Shipping</h2>
              {/* The address is put in a paragraph tag so it shows all that information in one line, like a string */}
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress?.address}, {cart.shippingAddress?.city},{" "}
                {cart.shippingAddress?.postalCode},{" "}
                {cart.shippingAddress?.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              {/* This shows the payment method put in by the user for the order. */}
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart?.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              {/* This shows the order items put in cart by the user for the order. */}
              {/* If there are items in the cartItems array we map them out, using item and index as parameters. The index is the key of the list. The item is the item in the list. */}
              {/* The order items are put in a list group item so they show up in a list. */}
              <h2>Order Items</h2>
              {/* The order items are conditionally rendered. If there are no items in this cartItems array, then a message of "Your cart is empty!" is shown. */}
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty!</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          {/* This Card shows the order summary for the order. */}
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                {/* h2 with Order Summary for the title. */}
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                {/* This shows the price of the total number of items in the cart. */}
                <Row>
                  <Col>Items:</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
                {/* This shows the price of shipping. */}
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
                {/* This shows the price of tax. */}
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
                {/* This shows the sum of the price of the total number of items in the cart, the shipping price, and the tax price. */}
                <Row>
                  <Col>Grand Total:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* This shows the error message if there is an error. */}
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
              {/* This is the button that places the order when clicked. */}
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {/* If it's loading, show the Loader component. */}
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
