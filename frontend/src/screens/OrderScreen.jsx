import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery } from "../slices/ordersApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams(); // Get the id from the url.

  //Use the useGetOrderDetailsQuery hook to fetch the order details.
  //Pass in the orderId as an argument. Destructure the data, refetch, isLoading, and isError properties from the hook result.
  const {
    data: order,
    refetch,
    isLoading,
    isError,
  } = useGetOrderDetailsQuery(orderId);

  console.log(order);

  return <div>OrderScreen</div>;
};

export default OrderScreen;
