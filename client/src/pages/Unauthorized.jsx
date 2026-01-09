import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
                <p className="text-lg text-gray-700 mb-8">You do not have permission to view this page.</p>
                <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
                    Go back to Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
