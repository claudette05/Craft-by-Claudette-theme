
import * as React from 'react';
import { motion } from 'framer-motion';
import { ProductReview } from '../../../types';
import { StarIcon, PencilIcon, TrashIcon, PhotoIcon, PlusIcon } from '../../Icons';
import ReviewFormModal from '../ui/ReviewFormModal';

// Mock data for now, will be replaced with AppContext
const mockReviews: ProductReview[] = [
  {
    id: 1,
    author: 'Jane Doe',
    rating: 5,
    date: '2023-10-26',
    title: 'Absolutely love it!',
    comment: 'This is the best product I have ever used. Highly recommended!',
    verifiedPurchase: true,
  },
  {
    id: 2,
    author: 'John Smith',
    rating: 4,
    date: '2023-10-25',
    title: 'Great value for the price',
    comment: 'Good quality and fast shipping. Would buy again.',
    verifiedPurchase: true,
    imageUrl: 'https://placehold.co/400x300/e2e8f0/333?text=Chat+Screenshot',
  },
    {
    id: 3,
    author: 'Crafty Carol',
    rating: 5,
    date: '2023-10-24',
    title: 'So easy to use!',
    comment: 'The friendship bracelet kit is amazing. My daughter and I had so much fun making these. The instructions were clear and the materials are top-notch.',
    verifiedPurchase: false,
    featured: true,
  },
];

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = React.useState(mockReviews);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedReview, setSelectedReview] = React.useState<ProductReview | null>(null);

  const handleOpenModal = (review: ProductReview | null = null) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const handleSubmit = (submittedReview: ProductReview) => {
    if (selectedReview) {
      // Editing existing review
      setReviews(reviews.map(r => r.id === submittedReview.id ? submittedReview : r));
    } else {
      // Adding new review
      setReviews([...reviews, { ...submittedReview, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    }
    handleCloseModal();
  };

  const handleDelete = (reviewId: number) => {
    // Add a confirmation dialog before deleting
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== reviewId));
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-800 dark:text-white">Manage Reviews</h1>
        <button 
            onClick={() => handleOpenModal()}
            className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors shadow-md flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5"/>
          <span>Add New Review</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
            <thead>
                <tr className='border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Review</th>
                <th className="px-5 py-3 text-center">Type</th>
                <th className="px-5 py-3 text-center">Featured</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
                {reviews.map((review) => (
                <tr key={review.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-5 py-4 text-sm">
                        <p className="font-bold whitespace-no-wrap">{review.author}</p>
                    </td>
                    <td className="px-5 py-4 text-sm">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                    </td>
                    <td className="px-5 py-4 text-sm">
                        <p className="whitespace-no-wrap font-semibold text-gray-800 dark:text-white">{review.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{review.comment.substring(0, 40)}...</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-center">
                    {review.imageUrl ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                            <PhotoIcon className='w-3.5 h-3.5' /> Image
                        </span>
                    ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/50 dark:text-green-300">
                            Text
                        </span>
                    )}
                    </td>
                    <td className="px-5 py-4 text-sm text-center">
                        <div className={`w-4 h-4 rounded-full mx-auto ${review.featured ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </td>
                     <td className="px-5 py-4 text-sm">
                        <p className="whitespace-no-wrap">{review.date}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-right">
                        <button onClick={() => handleOpenModal(review)} className="text-gray-500 hover:text-amber-600 p-2 rounded-full transition-colors"><PencilIcon className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(review.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors"><TrashIcon className="w-4 h-4"/></button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
      
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        review={selectedReview}
      />

    </motion.div>
  );
};

export default AdminReviewsPage;
