'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
// import { supabase } from '@/lib/supabase'; // Decoupled
import { Plus, Search, Edit, Trash2, Loader2, Package, ArrowUp, ArrowDown, AlertCircle, TrendingUp, Filter, ScanBarcode, MoreVertical, LayoutGrid, List as ListIcon, MapPin, Tag, Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePermissions } from '@/hooks/usePermissions';

// Interface for Mock Product
interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category: string;
  quantity: number;
  min_quantity: number;
  unit_price: number;
  location: string;
  image_url?: string; // New: Image for visual appeal
  status: 'active' | 'archived';
  last_movement?: string;
  created_at: string;
}

export default function InventoryPage() {
  const { can } = usePermissions(); // Keep for structure, though we'll mock permission check if needed
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Forms
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', sku: '', description: '', category: '', quantity: 0, min_quantity: 5, unit_price: 0, location: ''
  });

  const [movementData, setMovementData] = useState({
    type: 'in',
    quantity: 1,
    reason: '',
  });

  const [saving, setSaving] = useState(false);

  // Mock Data Loading
  useEffect(() => {
    loadMockProducts();
  }, []);

  async function loadMockProducts() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

    const categories = ['Hardware', 'Periféricos', 'Cabos', 'Rede', 'Ferramentas'];
    const locations = ['A1', 'A2', 'B1', 'Almoxarifado Principal', 'Depósito Externo'];

    // Generate robust mock data
    const mockProducts: Product[] = Array.from({ length: 25 }).map((_, i) => {
      const isCritical = Math.random() > 0.8;
      const qty = isCritical ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 100) + 10;

      return {
        id: `prod-${i}`,
        name: [
          'Cabo de Rede CAT6', 'Roteador Wi-Fi 6', 'Switch 24 Portas', 'Conector RJ45', 'Alicate de Crimpar',
          'Câmera IP Dome', 'DVR 16 Canais', 'HD 4TB Surveillance', 'Fonte 12V 5A', 'Bateria 7Ah',
          'Filamento PLA', 'Sensor de Presença', 'Central de Alarme', 'Sirene 120dB', 'Controle de Acesso'
        ][i % 15] + (i > 14 ? ` (Geração ${i})` : ''),
        sku: `SKU-${1000 + i}`,
        description: 'Item de alta performance para instalações profissionais.',
        category: categories[Math.floor(Math.random() * categories.length)],
        quantity: qty,
        min_quantity: 10,
        unit_price: Math.floor(Math.random() * 500) + 15,
        location: locations[Math.floor(Math.random() * locations.length)],
        status: 'active',
        created_at: new Date().toISOString(),
        image_url: `https://source.unsplash.com/random/200x200?tech,hardware&sig=${i}`, // Placeholder
      };
    });

    setProducts(mockProducts);
    setLoading(false);
  }

  // Derived State
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const criticalStock = products.filter(p => p.quantity <= p.min_quantity).length;
  const totalValue = products.reduce((acc, p) => acc + (p.quantity * p.unit_price), 0);
  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);

  // Actions
  function openModal(product?: Product) {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', sku: `SKU-${Math.floor(Math.random() * 9000) + 1000}`, description: '', category: '',
        quantity: 0, min_quantity: 5, unit_price: 0, location: '', status: 'active'
      });
    }
    setShowModal(true);
  }

  function openMovementModal(product: Product, type: 'in' | 'out') {
    setSelectedProduct(product);
    setMovementData({ type, quantity: 1, reason: '' });
    setShowMovementModal(true);
  }

  async function handleSave() {
    if (!formData.name) return toast.error('Nome obrigatório');

    setSaving(true);
    setTimeout(() => { // Simulate API
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p));
        toast.success('Produto atualizado (Mock)!');
      } else {
        const newProduct = { ...formData, id: `prod-${Date.now()}`, created_at: new Date().toISOString() } as Product;
        setProducts(prev => [newProduct, ...prev]);
        toast.success('Produto criado (Mock)!');
      }
      setShowModal(false);
      setSaving(false);
    }, 500);
  }

  async function handleMovement() {
    if (!selectedProduct) return;

    const qty = Number(movementData.quantity);
    if (qty <= 0) return toast.error('Quantidade inválida');

    const newQty = movementData.type === 'in' ? selectedProduct.quantity + qty : selectedProduct.quantity - qty;

    if (newQty < 0) return toast.error('Estoque insuficiente');

    setSaving(true);
    setTimeout(() => {
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, quantity: newQty } : p));
      toast.success(`Movimentação de ${movementData.type === 'in' ? 'Entrada' : 'Saída'} realizada!`);
      setShowMovementModal(false);
      setSaving(false);
    }, 400);
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza?')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Produto excluído (Mock)!');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-fadeIn text-slate-800 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <Package className="text-indigo-600" size={32} />
            Gestão de Estoque
          </h1>
          <p className="text-slate-500 mt-1">
            Controle de inventário, movimentações e valores em tempo real.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')} className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
            {viewMode === 'grid' ? <ListIcon size={18} /> : <LayoutGrid size={18} />}
          </button>
          <button
            onClick={() => openModal()}
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105"
          >
            <Plus size={18} className="mr-2" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-white p-6 shadow-sm border border-slate-100 rounded-2xl flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Itens</p>
            <p className="text-3xl font-bold text-slate-800">{totalItems}</p>
          </div>
        </div>

        <div className="card bg-white p-6 shadow-sm border border-slate-100 rounded-2xl flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Valor em Estoque</p>
            <p className="text-3xl font-bold text-slate-800">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className={`card p-6 shadow-sm border rounded-2xl flex items-center gap-5 hover:shadow-md transition-shadow ${criticalStock > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${criticalStock > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
            <AlertCircle size={28} />
          </div>
          <div>
            <p className={`text-sm font-medium ${criticalStock > 0 ? 'text-red-600' : 'text-slate-500'}`}>Estoque Crítico</p>
            <p className={`text-3xl font-bold ${criticalStock > 0 ? 'text-red-700' : 'text-slate-800'}`}>{criticalStock} itens</p>
          </div>
        </div>

        <div className="card bg-white p-6 shadow-sm border border-slate-100 rounded-2xl flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
            <ScanBarcode size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Produtos Únicos</p>
            <p className="text-3xl font-bold text-slate-800">{products.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, SKU ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500/20 text-slate-600 placeholder:text-slate-400 transition-all font-medium"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${categoryFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            Todas
          </button>
          {Array.from(new Set(products.map(p => p.category))).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${categoryFilter === cat ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU & Categoria</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Localização</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Estoque</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor Unit.</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-500">Nenhum produto encontrado.</td></tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                            <Package className="text-slate-300" size={24} />
                            {/* Using icon as placeholder, in real app would be <img src={product.image_url} /> */}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{product.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit">{product.sku}</span>
                          <span className="text-sm text-slate-600">{product.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin size={14} className="text-indigo-400" />
                          {product.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-sm font-bold ${product.quantity <= product.min_quantity ? 'text-red-600' : 'text-slate-700'}`}>
                            {product.quantity} un
                          </span>
                          {/* Progress Bar */}
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${product.quantity <= product.min_quantity ? 'bg-red-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min((product.quantity / (product.min_quantity * 3)) * 100, 100)}%` }}
                            />
                          </div>
                          {product.quantity <= product.min_quantity && (
                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-tight">Repor Estoque</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-medium text-slate-700">R$ {product.unit_price.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openMovementModal(product, 'in')} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg" title="Entrada">
                            <ArrowUp size={18} />
                          </button>
                          <button onClick={() => openMovementModal(product, 'out')} className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg" title="Saída">
                            <ArrowDown size={18} />
                          </button>
                          <button onClick={() => openModal(product)} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg" title="Editar">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg" title="Excluir">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group overflow-hidden">
              <div className="h-32 bg-slate-50 flex items-center justify-center relative">
                <Package className="text-slate-300" size={48} />
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${product.quantity <= product.min_quantity ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {product.quantity <= product.min_quantity ? 'Crítico' : 'Normal'}
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 line-clamp-1" title={product.name}>{product.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{product.sku}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Estoque</p>
                    <p className={`text-lg font-bold ${product.quantity <= product.min_quantity ? 'text-red-600' : 'text-slate-700'}`}>
                      {product.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Valor</p>
                    <p className="text-lg font-bold text-indigo-600">
                      R$ {product.unit_price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500 font-medium">{product.location}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openMovementModal(product, 'in')} className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-md">
                      <ArrowUp size={16} />
                    </button>
                    <button onClick={() => openMovementModal(product, 'out')} className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-md">
                      <ArrowDown size={16} />
                    </button>
                    <button onClick={() => openModal(product)} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-md">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Movement Modal */}
      {showMovementModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slideUp">
            <div className={`p-6 border-b border-slate-100 flex items-center gap-3 ${movementData.type === 'in' ? 'bg-emerald-50/50' : 'bg-amber-50/50'}`}>
              <div className={`p-2 rounded-lg ${movementData.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {movementData.type === 'in' ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
              </div>
              <div>
                <h2 className={`text-lg font-bold ${movementData.type === 'in' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {movementData.type === 'in' ? 'Registrar Entrada' : 'Registrar Saída'}
                </h2>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{selectedProduct.name}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Estoque Atual</p>
                <p className="text-3xl font-black text-slate-800">{selectedProduct.quantity} <span className="text-sm font-medium text-slate-400">un</span></p>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Quantidade</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMovementData(prev => ({ ...prev, quantity: Math.max(1, Number(prev.quantity) - 1) }))}
                    className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={movementData.quantity}
                    onChange={(e) => setMovementData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    className="flex-1 text-center font-bold text-lg bg-white border border-slate-200 rounded-lg py-2 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                  <button
                    onClick={() => setMovementData(prev => ({ ...prev, quantity: Number(prev.quantity) + 1 }))}
                    className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Motivo (Opcional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Ex: Nota Fiscal 1234..."
                  value={movementData.reason}
                  onChange={(e) => setMovementData(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowMovementModal(false)} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={handleMovement} disabled={saving} className={`px-4 py-2 text-white rounded-lg shadow-md transition-all flex items-center gap-2 ${movementData.type === 'in' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
                {saving && <Loader2 className="animate-spin" size={16} />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                <p className="text-xs text-slate-500">Informações detalhadas do item</p>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Nome do Produto</label>
                  <input className="input-modern w-full mt-1" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Câmera IP..." />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">SKU / Código</label>
                  <input className="input-modern w-full mt-1" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="SKU-000" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Categoria</label>
                  <input className="input-modern w-full mt-1" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Hardware" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Qtd. Inicial</label>
                  <input type="number" className="input-modern w-full mt-1 text-center font-bold" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Mínimo</label>
                  <input type="number" className="input-modern w-full mt-1 text-center font-bold text-red-600" value={formData.min_quantity} onChange={(e) => setFormData({ ...formData, min_quantity: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Valor Un.</label>
                  <input type="number" className="input-modern w-full mt-1 text-center font-bold text-emerald-600" value={formData.unit_price} onChange={(e) => setFormData({ ...formData, unit_price: Number(e.target.value) })} />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Localização</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input className="input-modern w-full pl-10 mt-1" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Corredor A, Prateleira 2" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Descrição</label>
                <textarea className="input-modern w-full mt-1 min-h-[80px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Detalhes técnicos..." />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-100">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                {saving ? <Loader2 className="animate-spin" size={18} /> : 'Salvar Produto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
