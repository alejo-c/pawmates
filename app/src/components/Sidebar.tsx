import React, { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import Icon from './Icon'

const Sidebar: React.FC = () => <>
    <div id='sidebar' className='offcanvas offcanvas-start' tabIndex={-1}>
        <div className='offcanvas-header'>
            <h5 className='offcanvas-title' id='offcanvasExampleLabel'>
                <img src='/pets.png' alt='logo' width={40} className='m-0 p-0 me-1' />
                <span>PawMates Adoption Center</span>
            </h5>
            <button id='close-sidebar' className='btn-close' data-bs-dismiss='offcanvas'></button>
        </div>
        <div className='offcanvas-body'>
            <div className='list-group'>
                <IconLink path='/' text='Adopt' icon={<Icon icon='home' />} />
                <IconLink path='/requests' text='Requests' icon={<Icon icon='file-pen' />} />
                <IconLink path='/pets' text='Pets' icon={<Icon icon='paw' />} />
                <IconLink path='/adopters' text='Adopters' icon={<Icon icon='person' style='mx-1' />} />
            </div>
        </div>
    </div>
</>

type IconLinkProps = { path: string, text: string, icon: ReactNode }

const IconLink: React.FC<IconLinkProps> = ({ path, text, icon }) => {
    const location = useLocation()
    const isActive = (path: string) => location.pathname === path ? 'active' : ''

    const linkClass = `list-group-item list-group-item-action ${isActive(path)}`
    return <>
        <div data-bs-dismiss='offcanvas'>
            <NavLink to={path} className={linkClass}>{icon} {text}</NavLink>
        </div>
    </>
}

export default Sidebar