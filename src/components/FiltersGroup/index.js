import {IoSearchSharp} from 'react-icons/io5'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    onChangeSearch,
    changeCategory,
    changeRating,
    activeRatingId,
    activeCategoryId,
    clearFilter,
    keyDownEnter,
  } = props

  const onChangeSearchInput = event => {
    const searchInputValue = event.target.value
    onChangeSearch(searchInputValue)
  }

  const onKeyDownEnter = event => {
    keyDownEnter(event.key)
  }

  const onClickCategoryBtn = categoryId => {
    changeCategory(categoryId)
  }

  const onClickRatingBtn = ratingId => {
    changeRating(ratingId)
  }

  const onClickClearFilterBtn = () => {
    clearFilter()
  }

  return (
    <div className="filters-group-container">
      <div className="input-container d-flex flex-row mb-4">
        <input
          placeholder="search"
          className="input"
          type="search"
          onChange={onChangeSearchInput}
          onKeyDown={onKeyDownEnter}
        />
        <IoSearchSharp className="search-icon" />
      </div>
      <div className="category-container d-flex flex-column">
        <h1 className="filter-heading">Category</h1>
        <ul className="category-list-container mt-2">
          {categoryOptions.map(eachCategory => (
            <li
              className="category-item mb-3"
              key={eachCategory.categoryId}
              onClick={() => onClickCategoryBtn(eachCategory.categoryId)}
            >
              <p
                className={
                  activeCategoryId === eachCategory.categoryId
                    ? 'activeCategory'
                    : ''
                }
              >
                {eachCategory.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="category-container d-flex flex-column">
        <h1 className="filter-heading">Rating</h1>
        <ul className="rating-list-container mt-2">
          {ratingsList.map(eachRating => (
            <li
              className={
                activeRatingId === eachRating.ratingId
                  ? 'activeRating rating-item mb-1 d-flex flex-row'
                  : 'rating-item mb-1 d-flex flex-row'
              }
              key={eachRating.ratingId}
              onClick={() => onClickRatingBtn(eachRating.ratingId)}
            >
              <img
                src={eachRating.imageUrl}
                alt={`rating ${eachRating.ratingId}`}
                className="rating-img mr-2"
              />
              <p className="up-desc mt-1">& up</p>
            </li>
          ))}
        </ul>
      </div>
      <button className="clear-filter-btn mt-3" onClick={onClickClearFilterBtn}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
