import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice.js";
import { setCredentials } from "../slices/authSlice.js";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch(); // useDispatch hook to dispatch actions
  const navigate = useNavigate(); // useNavigate hook to navigate programmatically

  // useLoginMutation hook to login.
  // It is destructured as an array with the login function and a boolean indicating if the request is loading.
  const [login, { isLoading }] = useLoginMutation();

  // Destructure userInfo from the auth state by using useSelector hook.
  // The useSelector takes in a function that passes in the state.
  // We want the auth part of the state because that is where the userInfo is.
  const { userInfo } = useSelector((state) => state.auth);

  // Destructure the search property from the useLocation hook.
  const { search } = useLocation();

  // Create a new URLSearchParams object from the search property, then pass the search property into the urlSearchParams constructor.
  // This allows us to get the redirect query parameter from the URL.
  const searchParams = new URLSearchParams(search);

  // We create a variable named redirect. We want to see if there is this redirect query parameter in the URL.
  // If there is, we want to use that as the redirect path. If not, we want to use the root path.
  const redirect = searchParams.get("redirect") || "/";

  // useEffect hook to check if the user is logged in.
  // If the user is logged in, we want to redirect them to the redirect path or the homepage using navigate func.
  // We pass in the userInfo and the redirect variable as a dependency.
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  // submitHandler function to handle the form submission. Prevent the component from reloading by default with preventDefault.
  // We call the login function from the useLoginMutation hook that's part of the usersApiSlice.
  // We use a try-catch block for the response back. We await the email and password.
  // The email and password is in the component state because it is coming in from the form as an object.
  // We use unwrap which will extract that resolved value from the promise.
  // Once we get the response, we then dispatch the setCredentials func. We send that userInfo to the setCredentials func.
  // This will then change the state by saving whoever the user is to local storage.
  // If there's an error, we want to display it.
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
    console.log("Submitted!");
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
          Sign In
        </Button>

        { isLoading && <Loader/>}

      </Form>
      <Row className="py-3">
        <Col>
          New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register here!</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
