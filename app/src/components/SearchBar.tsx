import Icon from './Icon'

const SearchBar = () => {
    return (
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="search-button"
            />
            <button className="btn btn-primary" type="button" id="search-button">
                <Icon icon="search" />
            </button>
        </div>
    )
}

export default SearchBar