
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductReview } from '../../../types';
import { StarIcon, XIcon } from '../../Icons';

type ReviewFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: ProductReview) => void;
  review: ProductReview | null;
};

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose, onSubmit, review }) => {
  const [editedReview, setEditedReview] = React.useState<ProductReview | null>(review);

  React.useEffect(() => {
    setEditedReview(review);
  }, [review]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedReview) {
      onSubmit(editedReview);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{review ? 'Edit' : 'Add'} Review</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="form-group">
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author</label>
                  <input 
                    type="text" 
                    id="author" 
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                    value={editedReview?.author || ''}
                    onChange={(e) => setEditedReview({ ...editedReview, author: e.target.value, id: editedReview?.id || Date.now() })} 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button type="button" key={i} onClick={() => setEditedReview({ ...editedReview, rating: i + 1, id: editedReview?.id || Date.now() })}>
                         <StarIcon 
                            className={`w-7 h-7 cursor-pointer transition-colors ${ (editedReview?.rating || 0) > i ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                         />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review Title</label>
                <input 
                  type="text" 
                  id="title" 
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                  value={editedReview?.title || ''}
                  onChange={(e) => setEditedReview({ ...editedReview, title: e.target.value, id: editedReview?.id || Date.now() })} 
                />
              </div>
              <div className="mb-8">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                <textarea 
                  id="comment" 
                  rows={5}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                  value={editedReview?.comment || ''}
                  onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value, id: editedReview?.id || Date.now() })} 
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors shadow-md">Save Review</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewFormModal;
