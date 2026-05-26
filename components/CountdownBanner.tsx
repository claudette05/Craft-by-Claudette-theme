import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const CountdownBanner: React.FC = () => {
    const { countdownBannerConfig } = useAppContext();
    const [timeLeft, setTimeLeft] = React.useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

    React.useEffect(() => {
        if (!countdownBannerConfig.enabled) return;

        const target = new Date(countdownBannerConfig.targetDate).getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = target - now;

            if (difference <= 0) {
                setTimeLeft(null);
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [countdownBannerConfig]);

    if (!countdownBannerConfig.enabled) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ 
                    backgroundColor: countdownBannerConfig.backgroundColor,
                    color: countdownBannerConfig.textColor
                }}
                className="w-full text-center py-2 px-4 text-sm font-semibold relative z-[60]"
            >
                {timeLeft ? (
                    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                        <span>{countdownBannerConfig.preSaleText}</span>
                        <span className="tabular-nums font-bold">
                            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                        </span>
                    </div>
                ) : (
                    <span>{countdownBannerConfig.postSaleText}</span>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default CountdownBanner;
