import React, { useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

    const addToCartHandler = () => {
      dispatch(addToCart({ ...product, qty }));
      navigate("/cart")
    };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock!"
                            : "Out Of Stock!"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control as="select" value={qty} onChange={(event) => setQty(Number(event.target.value))}>
                          {[...Array(product.countInStock).keys()].map(i => (<option key={ i + 1} value={ i + 1}>
                          {i + 1}
                          </option>
                          ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review">
          <Col md={6}>
            <h2>Reviews</h2>
            {product.reviews.length === 0 && <Message>No reviews!</Message>}
            <ListGroup variant="flush">
            {product.reviews.map(review => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <h2>Write A Review!</h2>
              {loadingProductReview && <Loader />}
              {userInfo ? (
                <Form>
                  <Form.Group controlId="rating" className="my-2">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                  as="select"
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}>
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good!</option>
                  <option value="5">5 - Excellent!</option>
                  </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="comment" className="my-2">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                  as="textarea"
                  row="3"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}></Form.Control>
                  </Form.Group>
                  <Button disabled={loadingProductReview}
                  type="submit"
                  variant="primary">
                  Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to="/login">sign in</Link> to write a review!
                </Message>
              )}
            </ListGroup.Item>
            </ListGroup>
          </Col>
          </Row>
        </>
      )}
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
    </>
  );
}

export default ProductScreen