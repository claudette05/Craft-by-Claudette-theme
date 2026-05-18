
import * as React from 'react';
import { db } from '../../../firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAppContext } from '../../../context/AppContext';

interface MediaLibraryProps {
    onSelect: (url: string) => void;
    onClose: () => void;
}

interface MediaItem {
    id: string;
    url: string;
    createdAt: any;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelect, onClose }) => {
    const { uploadImage, addToast } = useAppContext();
    const [activeTab, setActiveTab] = React.useState('library');
    const [media, setMedia] = React.useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isUploading, setIsUploading] = React.useState(false);
    
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const fetchMedia = async () => {
        setIsLoading(true);
        try {
            const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const mediaList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaItem));
            setMedia(mediaList);
        } catch (error) {
            console.error("Error fetching media library: ", error);
            addToast("Could not load media library.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchMedia();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploading(true);
            try {
                addToast('Uploading image...', 'info');
                const url = await uploadImage(file); // uploadImage now also saves to Firestore
                addToast('Image uploaded and added to library!');
                // Manually prepend the new image to avoid a full re-fetch
                setMedia(prev => [{ id: `new-${Date.now()}`, url, createdAt: new Date() }, ...prev]);
                setActiveTab('library'); // Switch back to library view
            } catch (err: any) {
                addToast(err.message || 'Upload failed', 'error');
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-primary)] rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-[var(--border-primary)]">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Media Library</h2>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">&times;</button>
                </div>
                
                <div className="flex p-4 space-x-4 border-b border-[var(--border-primary)]">
                    <button 
                        onClick={() => setActiveTab('library')} 
                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'library' ? 'bg-amber-500 text-white' : 'bg-transparent text-[var(--text-primary)] hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
                        Media Library
                    </button>
                    <button 
                        onClick={() => setActiveTab('upload')} 
                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'upload' ? 'bg-amber-500 text-white' : 'bg-transparent text-[var(--text-primary)] hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
                        Upload New
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-4">
                    {activeTab === 'library' && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {isLoading ? (
                                Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className="aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse"></div>
                                ))
                            ) : (
                                media.map(item => (
                                    <button 
                                        key={item.id} 
                                        className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-500 focus:border-amber-500 outline-none transition-all duration-150 relative group"
                                        onClick={() => onSelect(item.url)}
                                    >
                                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-white text-xs text-center">Select</span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === 'upload' && (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-12 text-center">
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-4"></div>
                                    <p className="text-[var(--text-secondary)]">Uploading, please wait...</p>
                                </>    
                            ) : (
                                <>
                                    <svg className="mx-auto h-12 w-12 text-zinc-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-[var(--text-primary)]">Select a file to upload</h3>
                                    <p className="mt-1 text-sm text-[var(--text-secondary)]">PNG, JPG, GIF up to 10MB</p>
                                    <div className="mt-6">
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Browse Files
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-[var(--border-primary)] flex justify-end">
                     <button onClick={onClose} className="bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 text-zinc-800 dark:text-zinc-200 font-bold py-2 px-4 rounded-lg transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};

export default MediaLibrary;
