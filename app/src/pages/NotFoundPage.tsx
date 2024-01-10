import { Link } from 'react-router-dom'

const NotFoundPage = () => <>
    <div className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '100vh' }}>
        <div className='card text-center p-3 px-5' style={{ width: '22em' }}>
            <div className='card-body'>
                <h1 className='card-title'>
                    <span className='text-warning fw-bolder'>404</span> Page Not Found
                </h1>
                <div className='card-text lead'>
                    <p>
                        Sorry, the page you are looking for could not be found.
                    </p>
                    <p>
                        Please try again or go back to the home page.
                    </p>
                </div>
                <Link key='404' to='/' className='btn btn-lg btn-warning'>
                    Go to Home Page
                </Link>
            </div>
        </div>
    </div>
</>


export default NotFoundPage