'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import {
  Save, Loader2, User, Building2, Bell, Shield, Palette,
  Mail, Phone, MapPin, Camera, Key, Check, Plus, Trash2, List, Upload, Image, Search, RefreshCw, Wrench, X,
  LayoutDashboard, TrendingUp, Users, DollarSign, Activity, Globe, Server
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- MOCK SAAS DATA ---
const MOCK_SAAS_METRICS = {
  mrr: 45200.00,
  active_tenants: 124,
  total_users: 3502,
  churn_rate: 1.2,
  growth: 15.4
};

const MOCK_TENANTS = [
  { id: 't1', name: 'Shopping Center Norte', status: 'active', plan: 'Enterprise', users: 45, revenue: 2500.00, created_at: '2025-01-10', logo: 'S' },
  { id: 't2', name: 'Hospital Santa Clara', status: 'active', plan: 'Enterprise', users: 120, revenue: 3500.00, created_at: '2025-02-15', logo: 'H' },
  { id: 't3', name: 'Condomínio Solar', status: 'active', plan: 'Pro', users: 12, revenue: 297.00, created_at: '2025-03-20', logo: 'C' },
  { id: 't4', name: 'Tech Solutions', status: 'trialing', plan: 'Pro', users: 5, revenue: 0.00, created_at: '2025-04-05', logo: 'T' },
  { id: 't5', name: 'Padaria Central', status: 'past_due', plan: 'Starter', users: 3, revenue: 97.00, created_at: '2025-01-05', logo: 'P' },
  { id: 't6', name: 'Escola Inovação', status: 'active', plan: 'Pro', users: 25, revenue: 297.00, created_at: '2025-02-10', logo: 'E' },
  { id: 't7', name: 'Mercado Express', status: 'canceled', plan: 'Starter', users: 2, revenue: 0.00, created_at: '2024-12-01', logo: 'M' },
];

const MOCK_SEGMENTS = [
  { id: '1', name: 'Ar Condicionado', description: 'Manutenção de sistemas de climatização', icon: 'Thermometer', color: '#10b981' },
  { id: '2', name: 'Elétrica', description: 'Quadros, fiação e geradores', icon: 'Zap', color: '#f59e0b' },
  { id: '3', name: 'Hidráulica', description: 'Bombas e tubulações', icon: 'Droplets', color: '#3b82f6' },
  { id: '4', name: 'Civil', description: 'Reformas e reparos estruturais', icon: 'Hammer', color: '#6366f1' },
];


export default function SettingsPage() {
  const { profile, setProfile, isDemoMode } = useAuthStore();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'notifications' | 'checklists' | 'whatsapp' | 'segments'>('profile');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'company', 'notifications', 'checklists', 'whatsapp', 'segments'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const [saving, setSaving] = useState(false);

  // Profile State
  const [profileData, setProfileData] = useState({
    full_name: '', email: '', phone: '', cpf: '', cargo: '', avatar_url: '',
  });

  // SaaS Dashboard State
  const [saasMetrics] = useState(MOCK_SAAS_METRICS);
  const [tenants] = useState(MOCK_TENANTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Company State (Mocked)
  const [companyData, setCompanyData] = useState({
    company_name: 'ChameiApp Soluções',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 98765-4321',
    email: 'contato@chameiapp.com.br',
    street: 'Avenida Paulista',
    number: '1500',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01311-200'
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        cpf: profile.cpf || '',
        cargo: profile.cargo || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  async function saveProfile() {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      toast.success('Perfil atualizado (Demo)');
    }, 1000);
  }

  async function saveCompany() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Configurações salvas (Demo)');
    }, 1000);
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isSuperAdmin = profile?.role === 'super_admin';

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase">
          Configurações {activeTab === 'segments' && isSuperAdmin ? '& Gestão SaaS' : ''}
        </h1>
        <p className="text-slate-500 font-medium">Gerencie seu perfil, preferências e sistema.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl">
        {[
          { id: 'profile', icon: User, label: 'Meu Perfil' },
          { id: 'company', icon: Building2, label: 'Empresa', adminOnly: true },
          { id: 'segments', icon: isSuperAdmin ? LayoutDashboard : List, label: isSuperAdmin ? 'Gestão SaaS' : 'Segmentos', adminOnly: true },
          { id: 'checklists', icon: List, label: 'Checklists', adminOnly: true },
          { id: 'whatsapp', icon: Phone, label: 'WhatsApp', adminOnly: true },
        ].filter(tab => !tab.adminOnly || isAdmin).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all font-bold text-sm ${activeTab === tab.id
                ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/5'
              }`}
          >
            <tab.icon size={18} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm p-6 min-h-[400px]">

        {/* === PROFILE TAB === */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-lg overflow-hidden">
                  {profileData.avatar_url ? (
                    <img src={profileData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profileData.full_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">{profileData.full_name}</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{profileData.cargo || 'Usuário'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={e => setProfileData({ ...profileData, full_name: e.target.value })}
                  className="input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Cargo</label>
                <input
                  type="text"
                  value={profileData.cargo}
                  onChange={e => setProfileData({ ...profileData, cargo: e.target.value })}
                  className="input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="input bg-slate-50 text-slate-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Telefone</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="btn btn-primary px-8"
              >
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Salvar Alterações</>}
              </button>
            </div>
          </div>
        )}

        {/* === SAAS MANAGEMENT TAB (Super Admin) === */}
        {activeTab === 'segments' && isSuperAdmin && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-none p-5 relative overflow-hidden">
                <DollarSign className="absolute -right-4 -top-4 w-24 h-24 opacity-20 rotate-12" />
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">MRR (Mensal)</p>
                <h3 className="text-3xl font-black">R$ {saasMetrics.mrr.toLocaleString('pt-BR')}</h3>
                <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full mt-2 inline-block">
                  + {saasMetrics.growth}% vs mês anterior
                </span>
              </div>
              <div className="card bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Tenants Ativos</p>
                  <Building2 className="text-indigo-500" size={20} />
                </div>
                <h3 className="text-3xl font-black text-slate-800">{saasMetrics.active_tenants}</h3>
              </div>
              <div className="card bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Usuários Totais</p>
                  <Users className="text-emerald-500" size={20} />
                </div>
                <h3 className="text-3xl font-black text-slate-800">{saasMetrics.total_users}</h3>
              </div>
              <div className="card bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Churn Rate</p>
                  <Activity className="text-red-500" size={20} />
                </div>
                <h3 className="text-3xl font-black text-slate-800">{saasMetrics.churn_rate}%</h3>
              </div>
            </div>

            {/* Tenants Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">Organizações (Tenants)</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar empresa..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all w-64"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Empresa</th>
                      <th className="px-6 py-4">Plano</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Receita</th>
                      <th className="px-6 py-4 text-right">Usuários</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                              {tenant.logo}
                            </div>
                            <span className="font-bold text-slate-700">{tenant.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-600">{tenant.plan}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${tenant.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                              tenant.status === 'trialing' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                tenant.status === 'past_due' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                  'bg-red-50 text-red-600 border-red-200'
                            }`}>
                            {tenant.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-600">
                          R$ {tenant.revenue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-500">
                          {tenant.users}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                            <Wrench size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Segments Management (Legacy) */}
            <div className="pt-8 border-t border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">Segmentos Técnicos (Global)</h3>
                <button className="btn btn-primary px-4 py-2 text-xs flex items-center gap-2">
                  <Plus size={14} /> Novo Segmento
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_SEGMENTS.map(seg => (
                  <div key={seg.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: seg.color }}>
                        <Wrench size={14} />
                      </div>
                      <span className="font-bold text-slate-700">{seg.name}</span>
                    </div>
                    <p className="text-xs text-slate-500">{seg.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === COMPANY TAB === */}
        {activeTab === 'company' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">Dados Gerais</h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Nome da Empresa</label>
                  <input type="text" value={companyData.company_name} onChange={e => setCompanyData({ ...companyData, company_name: e.target.value })} className="input" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">CNPJ</label>
                    <input type="text" value={companyData.cnpj} onChange={e => setCompanyData({ ...companyData, cnpj: e.target.value })} className="input font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Telefone</label>
                    <input type="text" value={companyData.phone} onChange={e => setCompanyData({ ...companyData, phone: e.target.value })} className="input" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">Endereço</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-bold text-slate-500">CEP</label>
                    <input type="text" value={companyData.zip_code} onChange={e => setCompanyData({ ...companyData, zip_code: e.target.value })} className="input font-mono" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-500">Rua</label>
                    <input type="text" value={companyData.street} onChange={e => setCompanyData({ ...companyData, street: e.target.value })} className="input" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-bold text-slate-500">Número</label>
                    <input type="text" value={companyData.number} onChange={e => setCompanyData({ ...companyData, number: e.target.value })} className="input" />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-bold text-slate-500">Cidade</label>
                    <input type="text" value={companyData.city} onChange={e => setCompanyData({ ...companyData, city: e.target.value })} className="input" />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-bold text-slate-500">Estado</label>
                    <input type="text" value={companyData.state} onChange={e => setCompanyData({ ...companyData, state: e.target.value })} className="input" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button onClick={saveCompany} disabled={saving} className="btn btn-primary px-8">
                {saving ? <Loader2 className="animate-spin" /> : 'Salvar Empresa'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
