import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useDeliverOrderMutation } from "../slices/ordersApiSlice.js";

const OrderScreen = () => {

  const { id: orderId } = useParams(); // Get the id from the url.

  //Use the useGetOrderDetailsQuery hook to fetch the order details.
  //Pass in the orderId as an argument. Destructure the data, refetch, isLoading, and isError properties from the hook result.
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // Destructure the payOrder mutation and the loadingPayment boolean from the usePayOrderMutation hook result.
  // loadingPayment is true if the order is being paid for. loadingPayment is false if the order has been paid for.
  const [payOrder, { isLoading: loadingPayment }] = usePayOrderMutation();

  const [deliverOrder, {isLoading: loadingDeliver }] = useDeliverOrderMutation();

  // Destructure the isPending boolean from the usePayPalScriptReducer hook result.
  // isPending is true if the PayPal SDK is loading. isPending is false if the PayPal SDK is loaded.
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // Get the PayPal client ID. Destructure the data, isLoading, and error properties from the useGetPayPalClientIdQuery hook result.
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  // Get the userInfo from the auth state. The userInfo has the user's name and email address.
  const { userInfo } = useSelector((state) => state.auth);

// Use the useEffect hook to refetch the order details when the order is paid for.
  useEffect(() => {
    // If there is no error in PayPal, and PayPal is not loading, and the PayPal client ID exists, then load the PayPal SDK.
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          }
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      }
      // If the order exists, and the order is not paid for, and the PayPal SDK is not already loaded, then load the PayPal SDK.
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [ //This is order data in an array that is sent to PayPal.
        {
          amount: {
            value: order.totalPrice, //This is the total price of the order.
          },
        },
      ],
    }).then((orderId) => {
      return orderId;
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) { //This triggers PayPal to capture the funds from the transaction.
      try {
        await payOrder({ orderId, details }); //Pay for the order with the payOrder function from the usePayOrderMutation.
        refetch(); //Once the order is paid for, refetch the order details.
        toast.success("Yay! Payment successful!"); //Show a success message.
      } catch (error) {
        toast.error(error?.data?.message || error.message); //If there's an error, show the error message.
      }
    })
  }

  // THIS IS FOR TESTING ONLY.
  // const onApproveTest = async () => {
  //   await payOrder({ orderId, details: { payer: {} } }); //Pay for the order with the payOrder function from the usePayOrderMutation.
  //       refetch(); //Once the order is paid for, refetch the order details.
  //       toast.success("Yay! Payment successful!"); //Show a success message.
  // };

  const onError = (error) => {
    toast.error(error.message); //If there's an error, show the error message.
  };

const deliverOrderHandler = async () => {
  try {
    await deliverOrder(orderId); //Await on deliverOrder func from the useDeliverOrderMutation slice. Pass in the orderId as an argument.
    refetch(); //Refetch the order details so the red changes to green.
    toast.success("Yay! Order delivered!");
  } catch (error) {
    toast.error(error?.data?.message || error.message);
  }
}


  // First, if it's loading, then we show the Loader component. If there's an error, we show the Message component.
  //If there's no error and it's not loading, then we show the order details.
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>E-mail: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {/* Conditionally show if the order has been delivered or not. If delivered, the date is shown. If not, "Not delivered!" is shown.*/}
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not delivered!</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {/* Conditionally show if the order has been paid for or not. If it has been paid, we show the date it was paid. If not, we show a "Not paid!" message. */}
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not paid!</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                {/* This shows the price of the total number of items in the cart. */}
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
                {/* This shows the price of shipping. */}
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
                {/* This shows the price of tax. */}
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
                {/* This shows the sum of the price of the total number of items in the cart, the shipping price, and the tax price. */}
                <Row>
                  <Col>Grand Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* If the order is not paid for, then we show the PayPal buttons. */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPayment && <Loader />}

                  {isPending ? <Loader /> : (
                    <div>
                      {/* <Button onClick={onApproveTest} style={{ marginBottom: "10px" }}>
                        Test Pay Order
                      </Button> */}
                      <div>
                        <PayPalButtons createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}>

                        </PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              { loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
