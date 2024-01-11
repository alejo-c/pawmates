import { NavLink } from 'react-router-dom'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'

const Navbar = () => (
    <nav className='navbar bg-body-tertiary fixed-top'>
        <div className='container-fluid m-0 p-0 mx-1'>
            <div className=''>
                <button
                    className='btn btn-outline-secondary'
                    data-bs-toggle='offcanvas'
                    data-bs-target='#sidebar'
                >
                    <i className='navbar-toggler-icon'></i>
                </button>
                <NavLink className='navbar-brand d-none d-md-inline m-0 p-0 ms-2' to='/'>
                    <img src='/pets.png' alt='logo' width={40} className='' />
                    <span>PawMates Adoption Center</span>
                </NavLink>
            </div>
            <div className='ms-md-auto'>
                <SearchBar />
            </div>
            <div className='ms-0 ms-md-3'>
                <UserMenu />
            </div>
        </div>
    </nav>
)

export default Navbar