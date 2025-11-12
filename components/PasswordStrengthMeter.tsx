
import * as React from 'react';
import { motion } from 'framer-motion';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const XMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PasswordStrengthMeter: React.FC<{ password?: string }> = ({ password = '' }) => {
    const checkPasswordStrength = (pass: string) => {
        let score = 0;
        const checks = {
            length: pass.length >= 8,
            lowercase: /[a-z]/.test(pass),
            uppercase: /[A-Z]/.test(pass),
            number: /[0-9]/.test(pass),
            specialChar: /[^A-Za-z0-9]/.test(pass),
        };

        if (checks.length) score++;
        if (checks.lowercase) score++;
        if (checks.uppercase) score++;
        if (checks.number) score++;
        if (checks.specialChar) score++;

        return { score, checks };
    };

    const { score, checks } = checkPasswordStrength(password);

    const strength = {
        0: { label: '', color: 'bg-zinc-200', width: '0%' },
        1: { label: 'Very Weak', color: 'bg-red-500', width: '20%' },
        2: { label: 'Weak', color: 'bg-orange-500', width: '40%' },
        3: { label: 'Medium', color: 'bg-yellow-500', width: '60%' },
        4: { label: 'Strong', color: 'bg-lime-500', width: '80%' },
        5: { label: 'Very Strong', color: 'bg-green-500', width: '100%' },
    }[score] as { label: string; color: string; width: string; };

    const criteria = [
        { label: 'At least 8 characters', met: checks.length },
        { label: 'A lowercase letter', met: checks.lowercase },
        { label: 'An uppercase letter', met: checks.uppercase },
        { label: 'A number', met: checks.number },
        { label: 'A special character', met: checks.specialChar },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-1 overflow-hidden"
        >
            <div className="w-full bg-zinc-200 rounded-full h-1.5">
                <motion.div
                    className={`h-1.5 rounded-full transition-colors duration-300 ${strength.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: strength.width }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                />
            </div>
             <p className={`text-xs font-medium text-right ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-600">
                {criteria.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                        {item.met ? <CheckIcon /> : <XMarkIcon />}
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default PasswordStrengthMeter;