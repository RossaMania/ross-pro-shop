import React, { useState } from 'react'
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (event) => {
    event.preventdefault();
    console.log("Submitted search!")
  }
  return (
    <Form onSubmit={submitHandler} className="d-flex">
    <Form.Control
    type="text"
    name="q"
    onChange={(event) => setKeyword(event.target.value)}
    value={keyword}
    placeholder="Search products..."
    className="mr-sm-2 ml-sm-5"
    ></Form.Control>
    </Form>
  )
}

export default SearchBox