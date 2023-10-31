import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import React from 'react'

const Paginate = ({ pages, page, isAdmin = false }) => {
  return (
    //If there is more than one page, then show the Paginate component.
    pages > 1 && (
      //Create an array of page numbers and map through the array to create a pagination item for each page.
      <Pagination>
        {[...Array(pages).keys()].map((page) => (
          <LinkContainer //Wrap each pagination item in a LinkContainer component to make each pagination item a link.
            key={page + 1}
            //If the user is not an admin, then link to the page number. If the user is an admin, then link to the admin product list page number.
            to={
              !isAdmin ? `/page/${page + 1}` : `/admin/productlist/${page + 1}`
            }
          >
            <Pagination.Item active={page + 1 === page}>
              {page + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
}

export default Paginate