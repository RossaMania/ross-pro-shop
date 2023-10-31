import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice.js";
import { toast } from "react-toastify";

import React from "react";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  //Destructure the data, isLoading state, and error state from the useGetProductsQuery hook call.
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreation }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDeletion }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    //If the user confirms the deletion, then delete the product.
    if (window.confirm("Hey! Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id); //Delete the product.
        console.log("Deleted!", id); //If the product is deleted, then log the deleted product's id to the console.
        toast.success("Yay! Product deleted"); //If the product is deleted, then show a success toast message.
        refetch(); //Refetch the products from the database to update the products list in the UI after the deletion.
      } catch (error) {
        toast.error(error?.data?.message || error.message); //If there is an error, then show an error toast message with the error.
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Hey! Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        console.log("Created!");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm p-1 m-3" onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>

      {loadingCreation && <Loader />}
      {loadingDeletion && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit style={{ margin: "5px" }} />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
