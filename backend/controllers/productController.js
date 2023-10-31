import asyncHandler from "../middleware/asyncHandler.js";

import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 1; //Set the page size to 1. This is how many products will be displayed per page.
  const page = Number(req.query.pageNumber) || 1; //Get the page number from the request query string or set it to 1.

  //Get the keyword from the request query string or set it to an empty string.
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {}; //Get the keyword from the request query string or set it to an empty string.

  const count = await Product.countDocuments({...keyword}); //Count the number of products in the database.

  const products = await Product.find({...keyword})
    .limit(pageSize)
    .skip(pageSize * (page - 1)); //Find all products in the database and limit the number of products to the page size and skip the number of products based on the page number.
  res.json({ products, page, pages: Math.ceil(count / pageSize) }); //Send the products along with the page number and the total number of pages in JSON format.
});

// @desc    Fetch single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found!");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  //Create a new product object with the data from the request body.
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  //Save the product to the database and send the product data in JSON format.
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name; //If the name is provided, update the name.
    product.price = price; //If the price is provided, update the price.
    product.description = description; //If the description is provided, update the description.
    product.image = image; //If the image is provided, update the image.
    product.brand = brand; //If the brand is provided, update the brand.
    product.category = category; //If the category is provided, update the category.
    product.countInStock = countInStock; //If the countInStock is provided, update the countInStock.

    const updatedProduct = await product.save(); //Save the updated product to the database.
    res.json(updatedProduct);
  } else {
    res.status(404); //That means the product is not found.
    throw new Error("Oops! Product not found!");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Yay! Product deleted!" });
  } else {
    res.status(404); //That means the product is not found.
    throw new Error("Oops! Product not found!");
  }
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body; //Get the rating and comment from the request body.

  const product = await Product.findById(req.params.id); //Find the product in the database using the id from the request parameters.

  if (product) {
    //If the product is found, then add the review to the product reviews array.
    const alreadyReviewed = product.reviews.find(
      //Check if the user has already reviewed the product by comparing the user id of the review with the user id of the logged in user.
      (review) => review.user.toString() === req.user._id.toString()
    );

    // If the alreadyReviewed const is true, that means the user has already reviewed the product.
    // If the user has already reviewed the product, then throw an error.
    if (alreadyReviewed) {
      res.status(400); //Bad request.
      throw new Error("Oops! You already reviewed this!");
    }
    // If the alreadyReviewed const doesn't exist, that means the user has not already reviewed the product.
    // If the user has not already reviewed the product, then add the review to the product reviews array.
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review); //Add the review to the product reviews array.

    product.numReviews = product.reviews.length; //Update the number of reviews.

    //Update the rating of the product by calculating the average rating of the product reviews.
    product.rating =
      product.reviews.reduce(
        (accumulator, review) => accumulator + review.rating,
        0
      ) / product.reviews.length;

    await product.save(); //Save the product to the database.

    res.status(201).json({ message: "Yay! Review added!" });
  } else {
    res.status(404); //This means the product is not found.
    throw new Error("Oops! Resource not found!");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
