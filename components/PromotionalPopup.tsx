
import * as React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { XIcon, ClockIcon } from './Icons';
import { useAppContext } from '../context/AppContext';
import { PopupConfig, SpinnerSegment, AnimationType } from '../types';

const GiftIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
);

// --- Helper: Animation Variant Generator ---
const getVariants = (entrance: AnimationType, exit: AnimationType, position: string): Variants => {
    const isCenter = position === 'center';
    
    const animations: Record<string, any> = {
        'fade': { opacity: 0 },
        'scale': { opacity: 0, scale: 0.8 },
        'slide-up': { opacity: 0, y: 50 },
        'slide-down': { opacity: 0, y: -50 },
        'slide-left': { opacity: 0, x: 50 },
        'slide-right': { opacity: 0, x: -50 },
        'rotate': { opacity: 0, rotate: -10, scale: 0.8 },
    };

    return {
        initial: animations[entrance] || animations['fade'],
        animate: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
        exit: animations[exit] || animations['fade']
    };
};

// --- Component: Countdown Timer ---
const CountdownTimer: React.FC<{ minutes: number }> = ({ minutes }) => {
    const [timeLeft, setTimeLeft] = React.useState(minutes * 60);

    React.useEffect(() => {
        setTimeLeft(minutes * 60);
    }, [minutes]);

    React.useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft(t => Math.max(0, t - 1));
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    
    return (
        <div className="flex items-center gap-2 font-mono text-2xl font-bold my-4 justify-center">
             <div className="bg-black/10 p-2 rounded min-w-[3ch] text-center backdrop-blur-sm">{m.toString().padStart(2, '0')}</div>
             <span className="animate-pulse">:</span>
             <div className="bg-black/10 p-2 rounded min-w-[3ch] text-center backdrop-blur-sm">{s.toString().padStart(2, '0')}</div>
        </div>
    );
};

// --- Component: Spin Wheel ---
const SpinWheel: React.FC<{ 
    segments: SpinnerSegment[]; 
    onFinished: (winningSegment: SpinnerSegment) => void;
    buttonColor: string;
    buttonTextColor: string;
}> = ({ segments, onFinished, buttonColor, buttonTextColor }) => {
    const [isSpinning, setIsSpinning] = React.useState(false);
    const [rotation, setRotation] = React.useState(0);

    const handleSpin = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isSpinning) return;

        setIsSpinning(true);

        // Determine winner based on random selection (could be weighted)
        const randomIndex = Math.floor(Math.random() * segments.length);
        const segmentAngle = 360 / segments.length;
        
        // Calculate target rotation: 
        // At least 5 full spins (1800deg) + offset to land on the chosen index
        const spinDuration = 5000; // ms
        const baseSpins = 360 * 6; // 6 full rotations
        
        const finalRotation = baseSpins + Math.floor(Math.random() * 360);
        setRotation(finalRotation);

        setTimeout(() => {
            // Calculate winner based on final rotation
            const normalizedRotation = finalRotation % 360;
            // Pointer is at top (0deg)
            const degreesPerSegment = 360 / segments.length;
            const winningIndex = Math.floor(((360 - normalizedRotation) % 360) / degreesPerSegment);
            const winner = segments[winningIndex];
            
            setIsSpinning(false);
            onFinished(winner);
        }, spinDuration);
    };

    const wheelStyle: React.CSSProperties = {
        background: `conic-gradient(${segments.map((s, i) => 
            `${s.color} ${(i * 360) / segments.length}deg ${((i + 1) * 360) / segments.length}deg`
        ).join(', ')})`,
        transform: `rotate(${rotation}deg)`,
        transition: isSpinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
    };

    return (
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto my-4">
            {/* Pointer */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white drop-shadow-md"></div>

            {/* The Wheel */}
            <div 
                className="w-full h-full rounded-full shadow-xl overflow-hidden border-4 border-white relative"
                style={wheelStyle}
            >
                {segments.map((seg, i) => {
                    const rotation = (360 / segments.length) * i + (360 / segments.length) / 2;
                    return (
                        <div 
                            key={seg.id}
                            className="absolute top-0 left-1/2 w-0 h-1/2 origin-bottom flex justify-center pt-4"
                            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                        >
                            <span 
                                className="text-xs md:text-sm font-bold uppercase whitespace-nowrap writing-mode-vertical" 
                                style={{ color: seg.textColor, writingMode: 'vertical-rl' }}
                            >
                                {seg.label}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Center Button */}
            <button 
                onClick={handleSpin}
                disabled={isSpinning}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-lg flex items-center justify-center border-4 border-white z-10 font-bold text-xs uppercase"
                style={{ backgroundColor: buttonColor, color: buttonTextColor }}
            >
                {isSpinning ? '...' : 'SPIN'}
            </button>
        </div>
    );
};


// --- Popup Content Renderer ---
export const PopupContentRenderer: React.FC<{ 
    config: PopupConfig; 
    onClose: () => void; 
    onSuccess?: () => void; 
    previewMode?: boolean 
}> = ({ config, onClose, onSuccess, previewMode = false }) => {
    const [email, setEmail] = React.useState('');
    const [step, setStep] = React.useState<'offer' | 'spin' | 'success'>('offer');
    const [winData, setWinData] = React.useState<{ code: string, label: string } | null>(null);
    const { content, style, type } = config;

    // If it's a spinner type, standard offer form might lead to "spin" step first
    const isSpinner = type === 'spinner' && config.spinnerSegments && config.spinnerSegments.length > 0;
    const isCountdown = type === 'countdown';

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!email && !previewMode) return;

        if (isSpinner) {
            setStep('spin');
        } else {
            // Standard flow
            if(previewMode) {
                setStep('success');
                return;
            }
            setTimeout(() => {
                setStep('success');
                if(onSuccess) onSuccess();
            }, 500);
        }
    };

    const handleSpinResult = (segment: SpinnerSegment) => {
         // For preview mode, just show success
         setWinData({ code: segment.value, label: segment.label });
         setTimeout(() => {
             setStep('success');
             if (!previewMode && onSuccess) onSuccess();
         }, 1500); // Delay to show what they won on the wheel
    };

    const handleCopyCode = () => {
        if(!previewMode) {
            navigator.clipboard.writeText(winData?.code || content.discountCode);
        }
    };

    // Dynamic styles
    const containerStyle: React.CSSProperties = {
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        fontFamily: style.fontFamily === 'serif' ? 'serif' : style.fontFamily === 'mono' ? 'monospace' : 'sans-serif',
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: style.buttonColor,
        color: style.buttonTextColor,
    };

    // Layout Class Logic
    const maxWidthClass = style.width === 'sm' ? 'max-w-sm' : style.width === 'lg' ? 'max-w-4xl' : 'max-w-2xl';
    const borderRadiusClass = 
        style.borderRadius === 'none' ? 'rounded-none' : 
        style.borderRadius === 'sm' ? 'rounded-sm' : 
        style.borderRadius === 'lg' ? 'rounded-xl' : 
        style.borderRadius === 'full' ? 'rounded-3xl' : 'rounded-md';

    const layoutClass = style.layout === 'image-left' ? 'flex-col md:flex-row' :
                        style.layout === 'image-right' ? 'flex-col md:flex-row-reverse' :
                        style.layout === 'image-top' ? 'flex-col' : 'flex-col';
    
    const isImageBackground = style.layout === 'background-image';
    // In spinner or countdown mode, we usually hide the side image to make room or keep layout simple
    const hasImage = style.layout !== 'no-image' && style.layout !== 'background-image';

    // Render Logic
    return (
        <div 
            className={`relative w-full ${maxWidthClass} ${borderRadiusClass} shadow-2xl overflow-hidden flex ${layoutClass}`}
            style={isImageBackground ? { 
                backgroundImage: `url(${content.imageUrl})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                ...containerStyle,
                color: '#ffffff'
            } : containerStyle}
        >
            {isImageBackground && <div className="absolute inset-0 bg-black/60 z-0" />}

            {/* Close Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                style={{ color: isImageBackground ? '#fff' : style.textColor }}
            >
                <XIcon className="w-5 h-5" />
            </button>

            {/* Image Section */}
            {hasImage && (
                <div className={`${style.layout === 'image-top' ? 'w-full h-48' : 'w-full md:w-1/2 h-48 md:h-auto'} relative overflow-hidden flex-shrink-0`}>
                    <img 
                        src={content.imageUrl} 
                        alt="Promotional Gift" 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Content Section */}
            <div className={`relative z-10 w-full ${hasImage && style.layout !== 'image-top' ? 'md:w-1/2' : ''} p-6 md:p-10 flex flex-col justify-center`}>
                <AnimatePresence mode="wait">
                    {step === 'offer' && (
                        <motion.div
                            key="offer"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full"
                        >
                            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                                 style={{ backgroundColor: style.buttonColor + '20', color: style.buttonColor }}
                            >
                                {isCountdown ? <ClockIcon className="w-4 h-4" /> : <GiftIcon className="w-4 h-4" />}
                                {isSpinner ? 'Spin to Win' : isCountdown ? 'Limited Offer' : 'Special Gift'}
                            </div>
                            
                            {isCountdown && content.timerDurationMinutes && (
                                <CountdownTimer minutes={content.timerDurationMinutes} />
                            )}

                            <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight" style={{ color: isImageBackground ? '#fff' : style.textColor }}>
                                {content.title}
                            </h2>
                            <p className="mb-6 opacity-90 text-sm md:text-base" style={{ color: isImageBackground ? '#eee' : style.textColor }}>
                                {content.description}
                            </p>

                            <form onSubmit={handleInitialSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        required
                                        placeholder={content.placeholderText}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white/90 focus:ring-2 focus:border-transparent outline-none transition-all text-black"
                                        style={{ borderRadius: style.borderRadius === 'full' ? '2rem' : undefined }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full font-bold py-3 px-4 transition-all transform hover:scale-[1.02]"
                                    style={{ 
                                        ...buttonStyle,
                                        borderRadius: style.borderRadius === 'full' ? '2rem' : 
                                                      style.borderRadius === 'none' ? '0' : '0.5rem'
                                    }}
                                >
                                    {isSpinner ? 'Try My Luck' : content.buttonText}
                                </button>
                            </form>
                            {content.disclaimerText && (
                                <p className="mt-4 text-xs opacity-60 text-center">
                                    {content.disclaimerText}
                                </p>
                            )}
                        </motion.div>
                    )}

                    {step === 'spin' && isSpinner && (
                         <motion.div
                            key="spin"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full text-center"
                        >
                            <h3 className="text-xl font-bold mb-2">Spin the Wheel!</h3>
                            <p className="text-sm mb-2 opacity-80">Click 'SPIN' to reveal your prize.</p>
                            <SpinWheel 
                                segments={config.spinnerSegments || []} 
                                onFinished={handleSpinResult}
                                buttonColor={style.buttonColor}
                                buttonTextColor={style.buttonTextColor}
                            />
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                             <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                style={{ backgroundColor: style.buttonColor + '20' }}
                             >
                                <GiftIcon className="w-8 h-8" style={{ color: style.buttonColor }} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2" style={{ color: isImageBackground ? '#fff' : style.textColor }}>
                                {isSpinner && winData ? `You Won: ${winData.label}!` : content.successTitle}
                            </h2>
                            <p className="mb-6 opacity-90" style={{ color: isImageBackground ? '#eee' : style.textColor }}>
                                {content.successMessage}
                            </p>
                            
                            <div 
                                onClick={handleCopyCode}
                                className="border-2 border-dashed p-4 rounded-lg cursor-pointer group relative overflow-hidden mb-4"
                                style={{ borderColor: style.buttonColor, backgroundColor: style.buttonColor + '10' }}
                            >
                                <p className="text-xs uppercase tracking-widest mb-1 opacity-70" style={{ color: style.textColor }}>Discount Code</p>
                                <p className="text-2xl font-mono font-bold group-hover:scale-110 transition-transform" style={{ color: style.buttonColor }}>
                                    {isSpinner && winData ? winData.code : content.discountCode}
                                </p>
                            </div>

                            <button
                                onClick={(e) => { e.preventDefault(); onClose(); }}
                                className="mt-4 w-full font-bold py-3 rounded-lg transition-colors"
                                style={{ 
                                    ...buttonStyle,
                                    borderRadius: style.borderRadius === 'full' ? '2rem' : 
                                                  style.borderRadius === 'none' ? '0' : '0.5rem'
                                }}
                            >
                                Start Shopping
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


const PromotionalPopup: React.FC = () => {
    const { addToast, popupConfig } = useAppContext();
    const [isVisible, setIsVisible] = React.useState(false);
    const STORAGE_KEY = 'craft_promo_popup_seen';

    React.useEffect(() => {
        if (!popupConfig.enabled) return;

        // Check session storage
        const hasSeen = sessionStorage.getItem(STORAGE_KEY);
        if (hasSeen) return;

        const timers: ReturnType<typeof setTimeout>[] = [];

        // Trigger: Delay
        if (popupConfig.behavior.delay > 0) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, popupConfig.behavior.delay * 1000);
            timers.push(timer);
        } else if (popupConfig.behavior.delay === 0 && !popupConfig.behavior.showOnScroll && !popupConfig.behavior.showOnExit) {
             setIsVisible(true); // Immediate show if no other triggers
        }

        // Trigger: Exit Intent
        const handleMouseLeave = (e: MouseEvent) => {
            if (popupConfig.behavior.showOnExit && e.clientY <= 0) {
                setIsVisible(true);
            }
        };

        // Trigger: Scroll
        const handleScroll = () => {
            if (popupConfig.behavior.showOnScroll) {
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                if (scrollPercent >= popupConfig.behavior.scrollPercentage) {
                    setIsVisible(true);
                }
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('scroll', handleScroll);

        return () => {
            timers.forEach(clearTimeout);
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [popupConfig]);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem(STORAGE_KEY, 'true');
    };

    const handleSuccess = () => {
        addToast('You have subscribed successfully!');
        sessionStorage.setItem(STORAGE_KEY, 'true');
    };

    if (!popupConfig.enabled) return null;

    // Positioning Logic
    const position = popupConfig.style.position || 'center';
    const isModal = position === 'center';
    
    const wrapperClasses = {
        'center': 'fixed inset-0 z-[60] flex items-center justify-center p-4',
        'bottom-right': 'fixed bottom-6 right-6 z-[60] flex flex-col items-end pointer-events-none max-w-[calc(100vw-3rem)]',
        'bottom-left': 'fixed bottom-6 left-6 z-[60] flex flex-col items-start pointer-events-none max-w-[calc(100vw-3rem)]',
        'top-center': 'fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex justify-center pointer-events-none max-w-[calc(100vw-3rem)]',
    }[position];

    // Get dynamic variants based on config
    const variants = getVariants(popupConfig.style.entranceAnimation, popupConfig.style.exitAnimation, position);

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {isModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[59] backdrop-blur-sm"
                            style={{ backgroundColor: popupConfig.style.overlayColor }}
                            onClick={handleClose}
                        />
                    )}
                    <div className={wrapperClasses}>
                        <motion.div
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={variants}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="pointer-events-auto w-full max-w-full"
                        >
                            <PopupContentRenderer 
                                config={popupConfig} 
                                onClose={handleClose} 
                                onSuccess={handleSuccess} 
                            />
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PromotionalPopup;
