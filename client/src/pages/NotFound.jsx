import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                <p className="text-lg text-gray-700 mb-8">The page you are looking for does not exist.</p>
                <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
                    Go back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
