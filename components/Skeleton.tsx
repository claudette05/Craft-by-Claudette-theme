
import * as React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded ${className}`} />
);

export const HomeSkeleton = () => {
    return (
        <div className="w-full min-h-screen bg-bg-primary">
            {/* Navbar Placeholder */}
            <div className="h-20 w-full bg-bg-secondary mb-4 flex items-center px-8 justify-between">
                <Skeleton className="h-8 w-40" />
                <div className="flex gap-4">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
            
            {/* Hero Placeholder */}
            <div className="h-[70vh] w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse relative mb-12">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Skeleton className="h-12 w-64 md:w-96" />
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-12 w-32 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Categories Placeholder */}
            <div className="container mx-auto px-4 mb-16">
                <Skeleton className="h-8 w-48 mx-auto mb-8" />
                <div className="flex gap-4 overflow-hidden justify-center">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Grid Placeholder */}
            <div className="container mx-auto px-4 pb-20">
                <Skeleton className="h-8 w-64 mx-auto mb-8" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-64 w-full rounded-lg" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
