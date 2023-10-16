import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from '../components/FormContainer';

const LoginScreen = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("Submitted!");
  };

  return (
    <FormContainer>LoginScreen</FormContainer>
  )
}

export default LoginScreen