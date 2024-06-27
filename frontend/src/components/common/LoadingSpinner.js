
/** Loading message used by components that fetch API data. */

const LoadingSpinner = () => {

    return (
        <div className="LoadingSpinner">
            <div className="container text-center">
                <h1 className="mb-4 fw-bold">Loading...</h1>
            </div>
        </div>
    );
};

export default LoadingSpinner;