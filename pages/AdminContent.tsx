import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { COMPANY_INFO } from '../constants';
import { Save, Upload, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminContent: React.FC = () => {
  const { siteContent, saveSiteContent, isAdmin } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    heroTitle: siteContent.heroTitle || '',
    heroSubtitle: siteContent.heroSubtitle || '',
    tagline: siteContent.tagline || COMPANY_INFO.tagline,
    aboutText: siteContent.aboutText || siteContent.heroDescription || '',
    logoUrl: siteContent.logoUrl || ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    setFormData({
      heroTitle: siteContent.heroTitle || '',
      heroSubtitle: siteContent.heroSubtitle || '',
      tagline: siteContent.tagline || COMPANY_INFO.tagline,
      aboutText: siteContent.aboutText || siteContent.heroDescription || '',
      logoUrl: siteContent.logoUrl || ''
    });
  }, [siteContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('logo', file);

    try {
      const token = localStorage.getItem('admin_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/upload-logo', {
        method: 'POST',
        headers,
        body: formDataUpload
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setFormData(prev => ({ ...prev, logoUrl: data.url }));
    } catch (err) {
      console.error('Logo upload error:', err);
      alert('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSiteContent({
        ...siteContent,
        ...formData,
        heroDescription: formData.aboutText // Keep in sync for backward compatibility if needed
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-bullseye-base text-gray-200 pb-20">
      <header className="bg-bullseye-surface border-b border-white/5 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase">Content Editor</h1>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-bullseye-red text-white px-6 py-2 rounded-lg font-black uppercase tracking-widest shadow-neon-red flex items-center disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-10">
        {saveSuccess && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 p-4 rounded-lg text-green-400 flex items-center animate-fade-in">
            <CheckCircle2 size={20} className="mr-3" />
            Content updated successfully!
          </div>
        )}

        <div className="space-y-8">
          {/* Logo Section */}
          <section className="glass-panel p-8 rounded-2xl border border-white/10">
            <h2 className="text-lg font-bold text-bullseye-blue uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Brand Identity</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-black/40 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden relative group">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-[10px] text-gray-600 font-mono uppercase">No Logo</span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-bullseye-blue" />
                  </div>
                )}
              </div>
              <div className="flex-grow space-y-4">
                <p className="text-sm text-gray-400">Upload your company logo. This will replace the default logo in the header and footer.</p>
                <div className="relative">
                  <input 
                    type="file" 
                    id="logo-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  <label 
                    htmlFor="logo-upload" 
                    className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <Upload size={14} className="mr-2" />
                    {formData.logoUrl ? 'Change Logo' : 'Upload Logo'}
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Hero Section */}
          <section className="glass-panel p-8 rounded-2xl border border-white/10">
            <h2 className="text-lg font-bold text-bullseye-blue uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Hero Section</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Main Title</label>
                <input 
                  type="text" 
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-bullseye-red outline-none"
                  placeholder="e.g. Bullseye Entertainment ZM"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subtitle / Slogan</label>
                <input 
                  type="text" 
                  name="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-bullseye-red outline-none"
                  placeholder="e.g. Get the party started!"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tagline (Navbar/Footer)</label>
                <input 
                  type="text" 
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-bullseye-red outline-none"
                  placeholder="e.g. Premium Event Rentals"
                />
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="glass-panel p-8 rounded-2xl border border-white/10">
            <h2 className="text-lg font-bold text-bullseye-blue uppercase tracking-widest mb-6 border-b border-white/5 pb-2">About / Description</h2>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Main Description Text</label>
              <textarea 
                name="aboutText"
                value={formData.aboutText}
                onChange={handleChange}
                rows={6}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-bullseye-red outline-none resize-none"
                placeholder="Describe your business and mission..."
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
