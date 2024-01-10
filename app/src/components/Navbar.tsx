import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar: React.FC = () => <>
    <nav className='navbar d-inline-flex bg-body-tertiary fixed-top m-0 p-0'>
        <div className='container-fluid'>
            <button
                className='btn btn-outline-secondary position-absolute'
                data-bs-toggle='offcanvas'
                data-bs-target='#sidebar'
            >
                <i className='navbar-toggler-icon'></i>
            </button>
            <i></i>
            <NavLink className='navbar-brand' to='/'>
                <img src='/pets.png' alt='logo' width={40} className='m-0 p-0 me-1' />
                <span>PawMates Adoption Center</span>
            </NavLink>
            <i className='d-none d-sm-inline'></i>
        </div>
    </nav>
</>

export default Navbar