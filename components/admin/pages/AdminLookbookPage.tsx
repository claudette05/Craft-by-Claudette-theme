import * as React from 'react';
import { useAppContext } from '../../../context/AppContext';
import { LookbookConfig } from '../../../types';


const AdminLookbookPage: React.FC = () => {
  const { lookbookConfig, updateLookbookConfig, uploadImage } = useAppContext();
  const [mode, setMode] = React.useState<LookbookConfig['mode']>(lookbookConfig?.mode || 'cover');
  const [images, setImages] = React.useState<string[]>(lookbookConfig?.images || []);
  const [overlayText, setOverlayText] = React.useState<string>(lookbookConfig?.overlayText || '');
  const [linkUrl, setLinkUrl] = React.useState<string>(lookbookConfig?.linkUrl || '');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      uploadedUrls.push(url);
    }
    setImages(prev => [...prev, ...uploadedUrls]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const newConfig: LookbookConfig = { mode, images, overlayText, linkUrl };
    await updateLookbookConfig(newConfig);
    setIsSaving(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-[var(--bg-secondary)] bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-amber-500">Lookbook Settings</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Display Mode</label>
        <select
          value={mode}
          onChange={e => setMode(e.target.value as LookbookConfig['mode'])}
          className="w-full p-2 border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
        >
          <option value="cover">Cover</option>
          <option value="collage">Collage</option>
          <option value="carousel">Carousel</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Images (supports multiple)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((src, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border">
              <img src={src} alt={`lookbook-${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Overlay Text</label>
        <input
          type="text"
          value={overlayText}
          onChange={e => setOverlayText(e.target.value)}
          className="w-full p-2 border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Link URL (to Customer Love page)</label>
        <input
          type="url"
          value={linkUrl}
          onChange={e => setLinkUrl(e.target.value)}
          className="w-full p-2 border rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
      >
        {isSaving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

export default AdminLookbookPage;
