




import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../../context/AppContext';
import { EmailLog } from '../../../types';
import { EyeIcon } from '../../Icons';
import Modal from '../ui/Modal';

const EmailStatusBadge: React.FC<{ status: EmailLog['status'] }> = ({ status }) => {
    const colors = {
        Sent: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
        Failed: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
        Queued: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
            {status}
        </span>
    );
};

const AdminEmailsPage: React.FC = () => {
    const { emailLogs } = useAppContext();
    const [selectedEmail, setSelectedEmail] = React.useState<EmailLog | null>(null);

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Email Logs</h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    Monitor all system emails sent to users. 
                    <span className="block text-xs text-amber-600 mt-1">
                        (Note: In this demo environment, these are simulated emails. In production, this would connect to SendGrid/Mailgun.)
                    </span>
                </p>
            </header>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-sm border border-[var(--border-primary)]">
                {emailLogs.length === 0 ? (
                    <div className="text-center py-12 text-[var(--text-secondary)]">
                        No emails sent yet. Try placing an order or signing up to see logs here.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                            <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-tertiary)]">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Recipient</th>
                                    <th className="px-6 py-3">Subject</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emailLogs.map((log, index) => (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">{log.date}</td>
                                        <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{log.recipient}</td>
                                        <td className="px-6 py-4">{log.subject}</td>
                                        <td className="px-6 py-4 capitalize">{log.template.replace('_', ' ')}</td>
                                        <td className="px-6 py-4">
                                            <EmailStatusBadge status={log.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedEmail(log)}
                                                className="text-zinc-500 hover:text-amber-600 transition-colors p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                            >
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedEmail && (
                    <Modal title={`Email Preview: ${selectedEmail.subject}`} onClose={() => setSelectedEmail(null)}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] p-4 rounded-lg">
                                <div><strong>To:</strong> {selectedEmail.recipient}</div>
                                <div><strong>Date:</strong> {selectedEmail.date}</div>
                                <div><strong>Template:</strong> {selectedEmail.template}</div>
                                <div><strong>Status:</strong> {selectedEmail.status}</div>
                            </div>
                            <div className="border border-[var(--border-primary)] rounded-lg p-6 bg-white min-h-[300px] text-zinc-800 shadow-inner">
                                <div dangerouslySetInnerHTML={{ __html: selectedEmail.content }} />
                            </div>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminEmailsPage;
