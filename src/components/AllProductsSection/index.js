import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  notFound: 'NOT_FOUND',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    activeOptionId: sortbyOptions[0].optionId,
    searchInputValue: '',
    activeCategoryId: '',
    activeRatingId: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, activeCategoryId, activeRatingId, searchInputValue} =
      this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInputValue}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const productsResponse = await fetch(apiUrl, options)
    const fetchedData = await productsResponse.json()
    console.log(fetchedData.total)
    if (productsResponse.ok) {
      if (fetchedData.total > 0) {
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        this.setState({
          productsList: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      }
       else {
        this.setState({apiStatus: apiStatusConstants.notFound})
      }
    } else {
      // console.log(true)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onChangeSearch = searchInputValue => {
    this.setState({searchInputValue: searchInputValue})
  }

  changeCategory = categoryId => {
    this.setState({activeCategoryId: categoryId}, this.getProducts)
  }

  changeRating = ratingId => {
    this.setState({activeRatingId: ratingId}, this.getProducts)
  }

  keyDownEnter = keyValue => {
    const {searchInputValue} = this.state
    if (keyValue === 'Enter' && searchInputValue !== '') {
      this.getProducts()
    }
  }

  clearFilter = () => {
    this.setState(
      {
        searchInputValue: '',
        activeCategoryId: '',
        activeRatingId: '',
        apiStatus: apiStatusConstants.initial,
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {apiStatus} = this.state
    // TODO: Add No Products View
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsSuccessView()
      case apiStatusConstants.failure:
        return this.renderProductsFailureView()
      case apiStatusConstants.notFound:
        return this.renderNoProductView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderProductsSuccessView = () => {
    const {productsList, activeOptionId} = this.state

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list mt-3">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductsFailureView = () => {
    return (
      <div className="product-failure-container d-flex flex-column">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
          alt="products failure"
          className="failure-product-img"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>
          We are having some trouble processing your request. Please try again.
        </p>
      </div>
    )
  }

  renderNoProductView = () => {
    return (
      <div className="product-failure-container d-flex flex-column">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
          className="failure-product-img"
        />
        <h1>No Products Found</h1>
        <p>We could not find any products. Try other filters</p>
      </div>
    )
  }

  renderLoader = () => {
    console.log('render')
    return (
      <div className="products-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    )
  }

  // TODO: Add failure view

  render() {
    const {activeCategoryId, activeRatingId} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onChangeSearch={this.onChangeSearch}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          clearFilter={this.clearFilter}
          keyDownEnter={this.keyDownEnter}
        />

        {this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
