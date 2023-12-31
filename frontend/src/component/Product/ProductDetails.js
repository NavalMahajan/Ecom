import React, { Fragment, useEffect,useState} from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import { useSelector,useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { Rating } from "@material-ui/lab";
import MetaData from "../layout/MetaData.js";
import Loader from "../layout/Loader/Loader.js";
import ReviewCard from "./ReviewCard.js";
import { useAlert } from "react-alert";
import { addItemsToCart } from "../../actions/cartAction";

const ProductDetails=() =>{
  const { id } = useParams();
  const dispatch=useDispatch();
  const alert=useAlert();
  const {product,loading,error}=useSelector((state)=>state.productDetails);
  const options ={
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
}
const [quantity, setQuantity] = useState(1);
const increaseQuantity = () => {
  if (product.Stock <= quantity) return;

  const qty = quantity + 1;
  setQuantity(qty);
};

const decreaseQuantity = () => {
  if (1 >= quantity) return;

  const qty = quantity - 1;
  setQuantity(qty);
};

const AddToCartHandler = () => {
  dispatch(addItemsToCart(id, quantity));
  alert.success("Item Added To Cart");
};

  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch(clearErrors)
    }
    dispatch(getProductDetails(id))
  },[dispatch,id,error,alert]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
           
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
         

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly value={quantity} type="number"/>
                    <button onClick={increaseQuantity}>+</button>
                  </div>{""}
                  <button onClick={AddToCartHandler}>
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:{""}
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button className="submitReview">
                Submit Review
              </button>
            </div>
          </div>
          <h3 className="reviewsHeading">REVIEWS</h3>
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => 
                  <ReviewCard  review={review} />
                )}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )};
  </Fragment>
  )             
}

export default ProductDetails ;