import React from 'react'
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = () => {

  const { data: products, isLoading, error } = useGetTopProductsQuery()

  return (
    <div>ProductCarousel</div>
  )
}

export default ProductCarousel