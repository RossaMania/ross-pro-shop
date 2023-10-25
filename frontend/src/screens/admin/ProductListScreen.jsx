import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetProductsQuery } from "../../slices/productsApiSlice.js";

import React from 'react'

const ProductListScreen = () => {

  //Destructure the data, isLoading state, and error state from the useGetProductsQuery hook call.
  const { data: products, isLoading, error } = useGetProductsQuery();

  console.log(products);

  return <>
    <Row className="align-items-center">
      <Col>
      <h1>Products</h1>
      </Col>
      <Col className="text-end">
      <Button className="btn-sm p-1 m-3">
      <FaEdit /> Create Product
      </Button>
      </Col>
    </Row>
  </>;
}

export default ProductListScreen