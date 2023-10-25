import React from 'react'
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";

const OrderListScreen = () => {
  //Desctructure the data, isLoading state, and error state from the useGetOrdersQuery hook call.
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  console.log(orders); //Console log the data, called orders, from the useGetOrdersQuery hook call.

  return <div>OrderListScreen</div>;
}

export default OrderListScreen