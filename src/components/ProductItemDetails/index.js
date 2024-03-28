import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'
import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants2 = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productlist: [],
    quantity: 1,
    similarProductsData: [],
    apistatus: apiStatusConstants2.initial,
  }

  componentDidMount() {
    this.getproductDetails()
    this.setState({apistatus: apiStatusConstants2.inProgress})
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getproductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const api = 'https://apis.ccbp.in/products/'
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `${api}${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        price: fetchedData.price,
        rating: fetchedData.rating,
        title: fetchedData.title,
        totalReviews: fetchedData.total_reviews,
      }

      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )

      this.setState({
        productlist: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apistatus: apiStatusConstants2.success,
      })
    } else {
      this.setState({apistatus: apiStatusConstants2.failure})
    }
  }

  increment = () => {
    const {quantity} = this.state
    if (quantity > 0) {
      this.setState(prevState => ({quantity: prevState.quantity + 1}))
    }
  }

  decrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderproductitemDetails = () => {
    const {similarProductsData, productlist, quantity} = this.state
    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productlist

    return (
      <div className="success-container">
        <div className="first-container">
          <img src={imageUrl} className="src-image" alt="product" />
          <div className="first-content">
            <h1 className="first-heading">{title}</h1>
            <p className="first-price">Rs {price}/- </p>
            <div className="rating-holder">
              <div className="rating">
                <p className="para">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star-img"
                  alt="star"
                />
              </div>
              <p className="review">{totalReviews} Reviews</p>
            </div>
            <p className="first-para">{description}</p>
            <p className="review">
              <span className="first-bold">Available: </span>
              {availability}
            </p>
            <p className="review">
              <span className="first-bold">Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="quantity-holder">
              <button
                type="button"
                className="btn"
                data-testid="minus"
                onClick={this.decrement}
              >
                <BsDashSquare className="search-icon" />
              </button>
              <p className="number">{quantity}</p>
              <button
                type="button"
                className="btn"
                data-testid="plus"
                onClick={this.increment}
              >
                <BsPlusSquare className="search-icon" />
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-heading">Similar Products</h1>
        <ul className="similar-list">
          {similarProductsData.map(eachItem => (
            <SimilarProductItem key={eachItem.id} productDetails={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="primedeals-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderresults = () => {
    const {apistatus} = this.state

    switch (apistatus) {
      case apiStatusConstants2.success:
        return this.renderproductitemDetails()
      case apiStatusConstants2.failure:
        return this.renderFailureView()
      case apiStatusConstants2.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderresults()}
      </div>
    )
  }
}

export default ProductItemDetails
