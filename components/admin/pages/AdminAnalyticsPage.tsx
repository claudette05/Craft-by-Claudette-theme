import React from 'react';

const AdminAnalyticsPage: React.FC = () => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Analytics</h1>
                <p className="text-[var(--text-secondary)] mt-1">Detailed reports on sales, customers, and more.</p>
            </header>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Coming Soon</h2>
                <p className="mt-2 text-[var(--text-secondary)]">
                    This section is under construction. A comprehensive analytics suite with downloadable reports (CSV, PDF) will be available here soon.
                </p>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;