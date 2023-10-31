import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import React from 'react'

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  return (
    //If there is more than one page, then show the Paginate component.
    pages > 1 && (
      //Create an array of page numbers and map through the array to create a pagination item for each page.
      <Pagination>
        {[...Array(pages).keys()].map((i) => (
          <LinkContainer //Wrap each pagination item in a LinkContainer component to make each pagination item a link.
            key={i + 1}
            //If the user is not an admin, then link to the page number. If the user is an admin, then link to the admin product list page number.
            to={
              !isAdmin ? keyword ? `/search/${keyword}/page/${i + 1}` : `/page/${i + 1}` : `/admin/productlist/${i + 1}`
            }
          >
            <Pagination.Item active={i + 1 === page}>
              {i + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
}

export default Paginate