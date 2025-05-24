import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

export default function RideCompleted() {
  const { rideId } = useParams();
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmit = () => {
    // You can send the rating to the backend here
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Ride Completed!</h1>
        <p className="mb-6 text-gray-700">Thank you for riding with us. We hope you had a great experience.</p>
        <div className="mb-6">
          <p className="mb-2 font-medium">Rate your ride:</p>
          <div className="flex justify-center mb-2">
            {[1,2,3,4,5].map(star => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className={`text-3xl mx-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                disabled={submitted}
              >
                ★
              </button>
            ))}
          </div>
          {submitted ? (
            <p className="text-green-600 font-medium">Thank you for your feedback!</p>
          ) : (
            <button
              onClick={handleSubmit}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={rating === 0}
            >
              Submit
            </button>
          )}
        </div>
        <Link to="/user" className="text-blue-600 hover:underline">Go to Dashboard</Link>
      </div>
    </div>
  );
} 