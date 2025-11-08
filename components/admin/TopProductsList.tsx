import React from 'react';
import { AdminTopProduct } from '../../types';

interface TopProductsListProps {
    products: AdminTopProduct[];
}

const TopProductsList: React.FC<TopProductsListProps> = ({ products }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-800 mb-4">Top Products</h2>
            <ul className="space-y-4">
                {products.map((product) => (
                    <li key={product.id} className="flex items-center gap-4">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                            <p className="font-medium text-zinc-800 truncate">{product.name}</p>
                            <p className="text-sm text-zinc-500">{product.sales} sales</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopProductsList;
