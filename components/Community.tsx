
import * as React from 'react';

const Community: React.FC = () => {
  return (
    <div className="bg-amber-50 dark:bg-zinc-800 py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Be the First to See New Drops
        </h2>
        <p className="mt-4 text-lg leading-6 text-zinc-600 dark:text-zinc-300">
          Join our WhatsApp group for exclusive offers, restock alerts and opening sales up to 50% off.
        </p>
        <a
          href="https://chat.whatsapp.com/I6F6FNW1jPb7Yu5T6siEMb?mode=hqctcla" // You can replace this with your WhatsApp group link
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-amber-500 hover:bg-amber-600 transition-transform transform hover:scale-105 shadow-lg"
        >
          Join Now
        </a>
      </div>
    </div>
  );
};

export default Community;
