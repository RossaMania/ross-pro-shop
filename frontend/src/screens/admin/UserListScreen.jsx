import React from 'react'
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaTimes, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast} from "react-toastify";
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice";

const UserListScreen = () => {
    //Desctructure the data, isLoading state, and error state from the useGetUsersQuery hook call.
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  console.log(users); //Console log the data, called orders, from the useGetOrdersQuery hook call.

  const [deleteUser, { isLoading: loadingDeletion }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    //If the user confirms the deletion, then delete the user.
    if (window.confirm("Hey! Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id); // Delete the user by id.
        toast.success("Yay! User deleted!"); //If the user is deleted, then show a success toast message.
        refetch(); //Refetch the users from the database to update the users list in the UI after the deletion.
      } catch (error) {
        toast.error(error?.data?.message || error.message); //If there is an error, then show an error toast message with the error.
      }
    }
    console.log("Deleted!");
  }

  return (
    <>
      <h1>Users</h1>
      {loadingDeletion && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaEdit style={{margin: "5px" }}/>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default UserListScreen