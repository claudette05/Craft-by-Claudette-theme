
import * as React from 'react';
import { motion } from 'framer-motion';

const PreorderPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Preorder Policy
        </h1>
        <div className="prose dark:prose-invert max-w-none dark:text-gray-300">
          <p>
            When you preorder an item, you are purchasing it in advance of its official release date. Please take a moment to review our preorder policy before completing your purchase.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">Production Timelines</h2>
          <p>
            Preordered items are made-to-order. Production timelines can vary, but we will always provide an estimated delivery date on the product page. Please note that these are estimates and can change.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">Cancellations</h2>
          <p>
            You may cancel your preorder for a full refund up to 24 hours after placing your order. After 24 hours, the order is considered final and cannot be canceled.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">Handmade Variations</h2>
          <p>
            As our products are handmade, slight variations in color, shape, and size are to be expected. These are not considered defects but rather a part of the unique character of each piece.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">Delivery Delays</h2>
          <p>
            While we strive to meet our estimated delivery dates, unforeseen delays in production or delivery can occur. We will do our best to keep you informed of any significant delays.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PreorderPolicyPage;
