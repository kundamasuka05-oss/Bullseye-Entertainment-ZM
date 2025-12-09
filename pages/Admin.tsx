import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Trash2, Edit, Plus, Check, X, LogOut, Package, Calendar as CalendarIcon, Wand2, Image as ImageIcon, Download } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';
import ImageUpload from '../components/ImageUpload';

const Admin: React.FC = () => {
  const { 
    isAdmin, login, logout, 
    products, addProduct, updateProduct, deleteProduct, toggleProductAvailability,
    bookings,
    gallery, addGalleryItem, removeGalleryItem
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'bookings' | 'gallery'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Login View
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bullseye-base px-4">
        <div className="glass-panel p-8 rounded-2xl w-full max-w-md border border-white/10">
          <h2 className="text-3xl font-display font-bold mb-6 text-center text-white">Admin Access</h2>
          <form onSubmit={async (e) => { e.preventDefault(); await login(email, password); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-bullseye-blue uppercase mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-bullseye-blue outline-none" placeholder="admin@bullseye.zm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-bullseye-blue uppercase mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-bullseye-blue outline-none" placeholder="bullseye123" />
            </div>
            <button type="submit" className="w-full bg-bullseye-red text-white py-3 rounded font-bold uppercase hover:bg-red-700 transition-colors shadow-neon-red">Login</button>
          </form>
          <div className="mt-6 text-xs text-gray-500 text-center">
            (Demo: admin@bullseye.zm / bullseye123)
          </div>
        </div>
      </div>
    );
  }

  // --- Handlers ---
  const handleSaveProduct = () => {
    if (editingProduct && editingProduct.name && editingProduct.price) {
      if (editingProduct.id) {
        updateProduct(editingProduct as Product);
      } else {
        addProduct({ ...editingProduct, id: Math.random().toString(36).substr(2, 9), available: true } as Product);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleCreateNew = () => {
    setEditingProduct({ category: 'Games', image: 'https://picsum.photos/400/300' });
    setIsModalOpen(true);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleGenerateDescription = async () => {
    if (editingProduct?.name && editingProduct?.category) {
      setGeneratingAI(true);
      const desc = await generateProductDescription(editingProduct.name, editingProduct.category);
      setEditingProduct({ ...editingProduct, description: desc });
      setGeneratingAI(false);
    } else {
      alert("Please enter a name and category first.");
    }
  };

  const handleGalleryUpload = (url: string) => {
    addGalleryItem({ id: Math.random().toString(36).substr(2, 9), url });
  };

  const handleExportBookings = () => {
    const headers = ["ID", "Customer", "Email", "Phone", "Date", "Status", "Message"];
    const rows = bookings.map(b => [b.id, b.customerName, b.email, b.phone, b.date, b.status, b.message]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bullseye_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-bullseye-base text-gray-200">
      <header className="bg-bullseye-surface border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-display font-bold text-white tracking-widest">ADMIN DASHBOARD</h1>
          <button onClick={logout} className="flex items-center text-red-500 hover:text-red-400 text-sm font-bold uppercase">
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-2 mb-8 border-b border-white/10 overflow-x-auto">
          {['products', 'bookings', 'gallery'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)} 
              className={`pb-3 px-6 whitespace-nowrap font-bold uppercase text-xs tracking-wider transition-all ${
                activeTab === tab 
                ? 'border-b-2 border-bullseye-red text-bullseye-red' 
                : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={handleCreateNew} className="bg-green-600 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center hover:bg-green-500">
                <Plus size={16} className="mr-2" /> Add Item
              </button>
            </div>
            <div className="bg-bullseye-surface rounded-lg border border-white/5 overflow-hidden">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-bullseye-blue uppercase">Item</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-bullseye-blue uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-bullseye-blue uppercase">Price</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-bullseye-blue uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-bullseye-blue uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded object-cover mr-3 bg-gray-800" src={product.image} alt="" />
                          <div className="text-sm font-bold text-white">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-bullseye-red">{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button onClick={() => toggleProductAvailability(product.id)}>
                          {product.available ? <Check size={18} className="text-green-500 mx-auto" /> : <X size={18} className="text-red-500 mx-auto" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(product)} className="text-bullseye-blue hover:text-white mr-4"><Edit size={16} /></button>
                        <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-white"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- BOOKINGS TAB --- */}
        {activeTab === 'bookings' && (
          <div className="bg-bullseye-surface rounded-lg border border-white/5 overflow-hidden">
             <div className="p-4 bg-black/20 border-b border-white/10 flex justify-between items-center">
               <span className="text-gray-400 text-xs uppercase font-bold">Incoming Transmissions</span>
               <button onClick={handleExportBookings} className="flex items-center text-xs text-bullseye-red hover:text-white font-bold uppercase">
                 <Download size={14} className="mr-2"/> Export Data
               </button>
             </div>
             {bookings.length === 0 ? (
               <div className="p-8 text-center text-gray-500 font-mono">NO ACTIVE MISSIONS.</div>
             ) : (
               <ul className="divide-y divide-white/5">
                 {bookings.map(booking => (
                   <li key={booking.id} className="p-6 hover:bg-white/5 transition-colors">
                     <div className="flex justify-between items-start">
                       <div>
                         <h3 className="text-lg font-bold text-white">{booking.customerName}</h3>
                         <p className="text-sm text-gray-400 font-mono">{booking.email} | {booking.phone}</p>
                         <p className="text-xs text-bullseye-blue mt-1 uppercase tracking-wide">Date: {booking.date}</p>
                       </div>
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                         {booking.status}
                       </span>
                     </div>
                     <div className="mt-4 bg-black/40 p-4 rounded border border-white/5">
                       <p className="text-xs font-bold text-gray-500 uppercase mb-2">Loadout:</p>
                       <div className="flex flex-wrap gap-2">
                         {booking.items.map(itemId => {
                           const item = products.find(p => p.id === itemId);
                           return item ? (
                             <span key={itemId} className="bg-white/10 text-xs px-2 py-1 rounded text-gray-300">{item.name}</span>
                           ) : null;
                         })}
                       </div>
                       {booking.message && <p className="mt-3 text-sm text-gray-400 italic">"{booking.message}"</p>}
                     </div>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        )}

        {/* --- GALLERY TAB --- */}
        {activeTab === 'gallery' && (
          <div>
            <div className="glass-panel p-6 rounded-lg mb-6">
              <h3 className="text-sm font-bold text-white uppercase mb-4">Upload Asset</h3>
              <ImageUpload 
                onUploadComplete={handleGalleryUpload} 
                folderPath="gallery" 
                collectionName="gallery_items"
                label="Select File"
                className="text-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {gallery.map(item => (
                <div key={item.id} className="relative group bg-black rounded overflow-hidden border border-white/10">
                  <img src={item.url} alt="Gallery" className="w-full h-40 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={() => removeGalleryItem(item.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-bullseye-surface border border-white/10 rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">{editingProduct.id ? 'Edit Spec' : 'New Item'}</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Item Name" 
                className="w-full bg-black/50 border border-white/10 p-3 rounded text-white focus:border-bullseye-blue outline-none"
                value={editingProduct.name || ''}
                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
              <div className="flex gap-4">
                <select 
                  className="bg-black/50 border border-white/10 p-3 rounded w-1/2 text-white outline-none"
                  value={editingProduct.category}
                  onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                >
                  <option value="Games">Games</option>
                  <option value="Inflatables">Inflatables</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Team Building">Team Building</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Price" 
                  className="w-1/2 bg-black/50 border border-white/10 p-3 rounded text-white focus:border-bullseye-blue outline-none"
                  value={editingProduct.price || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Visual Asset</label>
                <div className="flex gap-4 items-start">
                   <div className="flex-grow">
                      <ImageUpload 
                        onUploadComplete={(url) => setEditingProduct({ ...editingProduct, image: url })}
                        folderPath="products"
                        label=""
                        className="mb-2"
                      />
                   </div>
                   {editingProduct.image && (
                     <div className="w-20 h-20 flex-shrink-0 bg-black rounded border border-white/10 overflow-hidden">
                       <img src={editingProduct.image} className="w-full h-full object-cover" alt="Preview" />
                     </div>
                   )}
                </div>
              </div>
              
              <div className="relative">
                <textarea 
                  placeholder="Description" 
                  className="w-full bg-black/50 border border-white/10 p-3 rounded h-24 text-white focus:border-bullseye-blue outline-none"
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                ></textarea>
                <button 
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={generatingAI}
                  className="absolute bottom-2 right-2 text-xs bg-bullseye-purple/20 text-bullseye-purple px-2 py-1 rounded flex items-center hover:bg-bullseye-purple/30 transition-colors uppercase font-bold"
                >
                  {generatingAI ? 'Computing...' : <><Wand2 size={12} className="mr-1"/> AI Generate</>}
                </button>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-400 hover:text-white font-bold uppercase text-xs">Cancel</button>
              <button onClick={handleSaveProduct} className="px-6 py-2 bg-bullseye-blue text-white rounded font-bold uppercase text-xs hover:bg-blue-600 shadow-neon-blue">Save Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;