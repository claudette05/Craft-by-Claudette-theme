import React from 'react';

const AdminContentPage: React.FC = () => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Site Content</h1>
                <p className="text-[var(--text-secondary)] mt-1">Manage homepage banners, featured sections, and more.</p>
            </header>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Coming Soon</h2>
                <p className="mt-2 text-[var(--text-secondary)]">
                    This section is under construction. You will soon be able to manage all dynamic content on your homepage from this panel.
                </p>
            </div>
        </div>
    );
};

export default AdminContentPage;