
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Trash2, Edit, Plus, Check, X, LogOut, ShieldAlert, Wand2, Terminal, Loader2 } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';
import ImageUpload from '../components/ImageUpload';

const Admin: React.FC = () => {
  const { 
    isAdmin, login, logout, 
    products, addProduct, updateProduct, deleteProduct, toggleProductAvailability
  } = useStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || 'Access Denied');
    }
    setIsLoggingIn(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bullseye-base px-4 py-12">
        <div className="glass-panel p-8 rounded-2xl w-full max-w-xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-bullseye-red"></div>
          <h2 className="text-3xl font-display font-black mb-8 text-center text-white tracking-widest uppercase">Admin Verification</h2>
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 p-5 rounded-lg text-red-400 text-sm animate-fade-in">
              <div className="flex items-center mb-3">
                <ShieldAlert size={20} className="mr-3 flex-shrink-0 text-red-500" />
                <span className="font-bold text-base">Security Restriction</span>
              </div>
              <p className="mb-2 text-gray-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-bullseye-red outline-none" placeholder="Username" />
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-bullseye-red outline-none" placeholder="••••••••••••" />
            <button type="submit" disabled={isLoggingIn} className="w-full bg-bullseye-red text-white py-4 rounded-lg font-black uppercase tracking-widest shadow-neon-red">
              {isLoggingIn ? 'Decrypting...' : 'Access Terminal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleSaveProduct = async () => {
    if (!editingProduct.name || !editingProduct.price) {
      alert("Please enter both Name and Price.");
      return;
    }
    
    setIsSaving(true);
    try {
      if (editingProduct.id) {
        await updateProduct(editingProduct as Product);
      } else {
        await addProduct(editingProduct as Omit<Product, 'id'>);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Save failed: " + (err.message || "Server Error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bullseye-base text-gray-200">
      <header className="bg-bullseye-surface border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase">Operator Panel</h1>
            <div className={`flex items-center text-[10px] font-bold uppercase px-2 py-1 rounded border text-green-400 border-green-500/20`}>
              <Terminal size={10} className="mr-1" />
              Local System Active
            </div>
          </div>
          <button onClick={logout} className="text-red-500 hover:text-white font-bold uppercase tracking-wider text-xs flex items-center transition-all bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
            <LogOut size={16} className="mr-2"/> End Session
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">Game Management</h2>
          <button onClick={() => { setEditingProduct({ category: 'Games', image: '', available: true }); setIsModalOpen(true); }} className="bg-green-600 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center hover:bg-green-500 transition-colors shadow-lg">
            <Plus size={16} className="mr-2" /> New Game
          </button>
        </div>
        
        <div className="bg-bullseye-surface rounded-lg border border-white/5 overflow-hidden overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-bullseye-blue uppercase tracking-widest">Asset</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-bullseye-blue uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-bullseye-blue uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-bullseye-blue uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-mono text-[10px]">NO ASSETS FOUND.</td>
                </tr>
              ) : products.map(product => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded object-cover mr-3 bg-gray-900 border border-white/10" src={product.image} alt="" />
                      <div className="text-sm font-bold text-white">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-bullseye-red">ZMW {product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button onClick={() => toggleProductAvailability(product.id)}>
                      {product.available ? <Check size={18} className="text-green-500 mx-auto" /> : <X size={18} className="text-red-500 mx-auto" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="text-bullseye-blue hover:text-white mr-4"><Edit size={16} /></button>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-white"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-bullseye-surface border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-bullseye-blue"></div>
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">Asset Details</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Game Name" className="w-full bg-black/60 border border-white/10 p-3 rounded-lg text-white" value={editingProduct.name || ''} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
              <div className="flex gap-4">
                <select className="bg-black/60 border border-white/10 p-3 rounded-lg w-1/2 text-white" value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })}>
                  <option value="Games">Games</option><option value="Inflatables">Inflatables</option><option value="Equipment">Equipment</option><option value="Team Building">Team Building</option>
                </select>
                <input type="number" placeholder="Price ZMW" className="w-1/2 bg-black/60 border border-white/10 p-3 rounded-lg text-white" value={editingProduct.price || ''} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} />
              </div>
              <ImageUpload onUploadComplete={url => setEditingProduct({ ...editingProduct, image: url })} label="Game Image" />
              <div className="relative">
                <textarea placeholder="Description" className="w-full bg-black/60 border border-white/10 p-3 rounded-lg h-24 text-white text-sm" value={editingProduct.description || ''} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}></textarea>
                <button onClick={async () => {
                  if (editingProduct.name) {
                    setGeneratingAI(true);
                    const desc = await generateProductDescription(editingProduct.name, editingProduct.category || 'Games');
                    setEditingProduct({...editingProduct, description: desc});
                    setGeneratingAI(false);
                  }
                }} disabled={generatingAI} className="absolute bottom-3 right-3 text-[10px] bg-bullseye-purple/20 text-bullseye-purple px-2 py-1 rounded flex items-center">
                  {generatingAI ? 'Computing...' : <><Wand2 size={12} className="mr-2"/> AI Build</>}
                </button>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-white/5">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-500 font-bold uppercase text-xs">Abort</button>
              <button 
                onClick={handleSaveProduct} 
                disabled={isSaving}
                className="px-8 py-2 bg-bullseye-blue text-white rounded-lg font-bold uppercase text-xs shadow-neon-blue flex items-center"
              >
                {isSaving ? (
                  <><Loader2 size={14} className="mr-2 animate-spin" /> Processing...</>
                ) : 'Save Game'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
