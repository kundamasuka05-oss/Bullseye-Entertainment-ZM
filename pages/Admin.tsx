import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Trash2, Edit, Plus, Check, X, LogOut, Package, Calendar as CalendarIcon, Wand2, Image as ImageIcon, Download } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';
import ImageUpload from '../components/ImageUpload';
import { deleteImage } from '../services/storageService';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Admin Login</h2>
          <form onSubmit={async (e) => { e.preventDefault(); await login(email, password); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded-md p-2" placeholder="admin@bullseye.zm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border rounded-md p-2" placeholder="bullseye123" />
            </div>
            <button type="submit" className="w-full bg-bullseye-black text-white py-2 rounded-md hover:bg-gray-800">Login</button>
          </form>
          <div className="mt-4 text-xs text-gray-400 text-center">
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

  const handleDeleteGalleryItem = async (id: string, url: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      // Attempt to find storage path from URL or assume a structure if strictly needed
      // For this demo, we just remove from store. In production, we'd store the 'path' in the GalleryItem object to delete it properly.
      // e.g. await deleteImage(item.storagePath);
      removeGalleryItem(id);
    }
  };

  const handleExportBookings = () => {
    const headers = ["ID", "Customer", "Email", "Phone", "Date", "Status", "Message"];
    const rows = bookings.map(b => [b.id, b.customerName, b.email, b.phone, b.date, b.status, b.message]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bullseye_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button onClick={logout} className="flex items-center text-red-600 hover:text-red-800">
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b overflow-x-auto">
          <button onClick={() => setActiveTab('products')} className={`pb-2 px-4 whitespace-nowrap font-medium ${activeTab === 'products' ? 'border-b-2 border-bullseye-red text-bullseye-red' : 'text-gray-500'}`}>
            <div className="flex items-center"><Package size={18} className="mr-2"/> Products</div>
          </button>
          <button onClick={() => setActiveTab('bookings')} className={`pb-2 px-4 whitespace-nowrap font-medium ${activeTab === 'bookings' ? 'border-b-2 border-bullseye-red text-bullseye-red' : 'text-gray-500'}`}>
            <div className="flex items-center"><CalendarIcon size={18} className="mr-2"/> Bookings ({bookings.length})</div>
          </button>
          <button onClick={() => setActiveTab('gallery')} className={`pb-2 px-4 whitespace-nowrap font-medium ${activeTab === 'gallery' ? 'border-b-2 border-bullseye-red text-bullseye-red' : 'text-gray-500'}`}>
            <div className="flex items-center"><ImageIcon size={18} className="mr-2"/> Gallery ({gallery.length})</div>
          </button>
        </div>

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={handleCreateNew} className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700">
                <Plus size={18} className="mr-2" /> Add Item
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avail</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full object-cover mr-3" src={product.image} alt="" />
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button onClick={() => toggleProductAvailability(product.id)}>
                          {product.available ? <Check className="text-green-500 mx-auto" /> : <X className="text-red-500 mx-auto" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                        <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
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
          <div className="bg-white rounded-lg shadow overflow-hidden">
             <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
               <span className="text-gray-500 text-sm">Manage incoming requests</span>
               <button onClick={handleExportBookings} className="flex items-center text-sm text-bullseye-red hover:text-red-800 font-medium">
                 <Download size={16} className="mr-2"/> Export CSV
               </button>
             </div>
             {bookings.length === 0 ? (
               <div className="p-8 text-center text-gray-500">No bookings yet.</div>
             ) : (
               <ul className="divide-y divide-gray-200">
                 {bookings.map(booking => (
                   <li key={booking.id} className="p-6 hover:bg-gray-50">
                     <div className="flex justify-between">
                       <div>
                         <h3 className="text-lg font-bold text-gray-900">{booking.customerName}</h3>
                         <p className="text-sm text-gray-500">{booking.email} | {booking.phone}</p>
                         <p className="text-sm font-semibold mt-1">Date: {booking.date}</p>
                       </div>
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                         {booking.status}
                       </span>
                     </div>
                     <div className="mt-4 bg-gray-50 p-3 rounded">
                       <p className="text-sm font-bold text-gray-700">Requested Items:</p>
                       <div className="flex flex-wrap gap-2 mt-2">
                         {booking.items.map(itemId => {
                           const item = products.find(p => p.id === itemId);
                           return item ? (
                             <span key={itemId} className="bg-white border text-xs px-2 py-1 rounded shadow-sm">{item.name}</span>
                           ) : null;
                         })}
                       </div>
                       {booking.message && <p className="mt-2 text-sm text-gray-600 italic">" {booking.message} "</p>}
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
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-bold mb-4">Add New Image</h3>
              <ImageUpload 
                onUploadComplete={handleGalleryUpload} 
                folderPath="gallery" 
                collectionName="gallery_items"
                label="Upload to Gallery"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {gallery.map(item => (
                <div key={item.id} className="relative group bg-white p-2 rounded shadow">
                  <img src={item.url} alt="Gallery" className="w-full h-40 object-cover rounded" />
                  <button 
                    onClick={() => handleDeleteGalleryItem(item.id, item.url)}
                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-md"
                    title="Delete Image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* --- MODAL (For Products) --- */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full border p-2 rounded"
                value={editingProduct.name || ''}
                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
              <div className="flex gap-4">
                <select 
                  className="border p-2 rounded w-1/2"
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
                  className="w-1/2 border p-2 rounded"
                  value={editingProduct.price || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Image</label>
                <div className="flex gap-2 items-start">
                   <div className="flex-grow">
                      <ImageUpload 
                        onUploadComplete={(url) => setEditingProduct({ ...editingProduct, image: url })}
                        folderPath="products"
                        label=""
                        className="mb-2"
                      />
                      <input 
                        type="text" 
                        placeholder="Or enter Image URL manually" 
                        className="w-full border p-2 rounded text-sm"
                        value={editingProduct.image || ''}
                        onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      />
                   </div>
                   {editingProduct.image && (
                     <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden border">
                       <img src={editingProduct.image} className="w-full h-full object-cover" alt="Preview" />
                     </div>
                   )}
                </div>
              </div>
              
              <div className="relative">
                <textarea 
                  placeholder="Description" 
                  className="w-full border p-2 rounded h-24"
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                ></textarea>
                <button 
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={generatingAI}
                  className="absolute bottom-2 right-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center hover:bg-purple-200"
                >
                  {generatingAI ? 'Thinking...' : <><Wand2 size={12} className="mr-1"/> AI Write</>}
                </button>
              </div>

            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={handleSaveProduct} className="px-4 py-2 bg-bullseye-red text-white rounded hover:bg-red-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;