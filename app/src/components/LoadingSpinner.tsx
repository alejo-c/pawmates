const LoadingSpinner = () => <>
    <div className='d-flex justify-content-center align-items-center text-center'
        style={{ minHeight: '100vh' }}>
        <div className='m-auto'>
            <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Loading...</span>
            </div>
            <div className='font-weight-bold'>Loading Content...</div>
        </div>
    </div>
</>

export default LoadingSpinner