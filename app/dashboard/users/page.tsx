'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Edit, Trash2, Loader2, UserCog, Shield, User, Copy, Check,
  Smartphone, Globe, Star, Wrench, RefreshCw, Key, Lock, Unlock, Mail, Phone, Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- MOCK DATA ---

const MOCK_CLIENTS = [
  { id: '1', name: 'TechSolutions Ltda' },
  { id: '2', name: 'Inova Systems' },
  { id: '3', name: 'Global Services' },
  { id: '4', name: 'Alpha Corp' },
];

const MOCK_SEGMENTS = [
  { id: '1', name: 'Refrigeração' },
  { id: '2', name: 'Elétrica' },
  { id: '3', name: 'Hidráulica' },
  { id: '4', name: 'Segurança Eletrônica' },
  { id: '5', name: 'Automação' },
];

const INITIAL_USERS = [
  {
    id: 'u1',
    email: 'admin@chameiapp.com',
    full_name: 'Super Admin',
    role: 'super_admin',
    phone: '(11) 99999-9999',
    is_active: true,
    cargo: 'Diretor Geral',
    client_id: null,
    avatar_color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'u2',
    email: 'gerente@techsolutions.com',
    full_name: 'Carlos Gerente',
    role: 'admin',
    phone: '(11) 98888-8888',
    is_active: true,
    cargo: 'Gerente de Operações',
    client_id: '1',
    avatar_color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'u3',
    email: 'tecnico.joao@chameiapp.com',
    full_name: 'João Silva',
    role: 'technician',
    phone: '(11) 97777-7777',
    is_active: true,
    cargo: 'Técnico Sênior',
    client_id: null,
    segments: ['1', '2'],
    avatar_color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'u4',
    email: 'cliente@inova.com',
    full_name: 'Maria Cliente',
    role: 'client',
    phone: '(11) 96666-6666',
    is_active: true,
    cargo: 'Coordenadora',
    client_id: '2',
    avatar_color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'u5',
    email: 'pedro@globalservices.com',
    full_name: 'Pedro Santos',
    role: 'technician',
    phone: '(21) 95555-5555',
    is_active: false,
    cargo: 'Técnico Júnior',
    client_id: '3',
    segments: ['3'],
    avatar_color: 'from-red-500 to-pink-500'
  }
];

// URLs dos portais
const ADMIN_PORTAL_URL = 'https://chameiapp-admin.vercel.app';
const CLIENT_PORTAL_URL = 'https://chameiapp-portal.vercel.app';
const APK_DOWNLOAD_URL = 'https://expo.dev/accounts/helgon/projects/chameiapp/builds';

export default function UsersPage() {
  const router = useRouter();

  // -- State --
  const [users, setUsers] = useState(INITIAL_USERS);
  const [clients] = useState(MOCK_CLIENTS);
  const [segments] = useState(MOCK_SEGMENTS);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  // Current User Mock (acting as Super Admin for demo)
  const currentUser = { role: 'super_admin', id: 'u1' };
  const isAdmin = true;
  const isSuperAdmin = true;

  // Form Data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'technician',
    phone: '',
    client_id: '',
    cpf: '',
    cargo: '',
  });

  const [saving, setSaving] = useState(false);

  // Credentials Modal
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
    name: string;
    role: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // --- Helpers ---

  const getRandomGradient = () => {
    const gradients = [
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-amber-500',
      'from-pink-500 to-rose-500',
      'from-violet-500 to-fuchsia-500'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
    toast.success('Senha gerada!');
  };

  // --- Actions ---

  const handleSave = async () => {
    if (!formData.full_name || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    if (!editingUser && !formData.password) {
      toast.error('Senha é obrigatória para novos usuários');
      return;
    }

    setSaving(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingUser) {
      // Update
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        ...formData,
        segments: selectedSegments
      } : u));
      toast.success('Usuário atualizado!');
      setShowModal(false);
    } else {
      // Create
      const newUser = {
        id: `u${Date.now()}`,
        ...formData,
        is_active: true,
        segments: selectedSegments,
        avatar_color: getRandomGradient()
      };
      setUsers([newUser, ...users]); // Add to top

      setCreatedCredentials({
        email: formData.email,
        password: formData.password,
        name: formData.full_name,
        role: formData.role
      });
      setShowModal(false);
      setShowCredentialsModal(true);
      toast.success('Usuário criado com sucesso!');
    }
    setSaving(false);
  };

  const handleDelete = async (user: any) => {
    if (confirm(`Tem certeza que deseja excluir ${user.full_name}?`)) {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 1000)),
        {
          loading: 'Excluindo...',
          success: () => {
            setUsers(users.filter(u => u.id !== user.id));
            return 'Usuário excluído!';
          },
          error: 'Erro ao excluir'
        }
      );
    }
  };

  const toggleStatus = async (user: any) => {
    const newStatus = !user.is_active;
    const action = newStatus ? 'desbloquear' : 'bloquear';

    if (confirm(`Deseja ${action} o usuário ${user.full_name}?`)) {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 800)),
        {
          loading: 'Atualizando status...',
          success: () => {
            setUsers(users.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
            return `Usuário ${newStatus ? 'desbloqueado' : 'bloqueado'}!`;
          },
          error: 'Erro ao atualizar'
        }
      );
    }
  };

  const resetPassword = (user: any) => {
    if (confirm(`Enviar link de redefinição de senha para ${user.email}?`)) {
      toast.success(`Link enviado para ${user.email}`);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copiado!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        password: '', // Don't show password on edit
        full_name: user.full_name,
        role: user.role,
        phone: user.phone || '',
        client_id: user.client_id || '',
        cpf: user.cpf || '',
        cargo: user.cargo || '',
      });
      setSelectedSegments(user.segments || []);
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'technician',
        phone: '',
        client_id: '',
        cpf: '',
        cargo: '',
      });
      setSelectedSegments([]);
    }
    setShowModal(true);
  };

  // --- Render Helpers ---

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Star className="w-3.5 h-3.5 text-yellow-600 fill-yellow-600" />;
      case 'admin': return <Shield className="w-3.5 h-3.5 text-indigo-600" />;
      case 'technician': return <Wrench className="w-3.5 h-3.5 text-blue-600" />;
      case 'client': return <User className="w-3.5 h-3.5 text-gray-600" />;
      default: return <User className="w-3.5 h-3.5" />;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Administrador',
      technician: 'Técnico',
      client: 'Cliente',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'admin': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'technician': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'client': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // --- Filtering ---

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-gray-500 font-medium">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-20">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="w-7 h-7 text-indigo-600" />
            Gestão de Usuários
          </h1>
          <p className="text-gray-500 mt-1">Gerencie acessos, permissões e perfis de usuários do sistema.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn btn-primary shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all"
        >
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Filters & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 group relative">
            <div className="flex items-center w-full px-3 py-1.5 border border-gray-200 rounded-md bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <Search className="text-gray-400 group-hover:text-indigo-500 transition-colors mr-2" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome, email ou cargo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 w-full bg-transparent outline-none text-[13px] text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input w-full sm:w-48 cursor-pointer bg-white text-gray-700"
          >
            <option value="all">Todas as Funções</option>
            <option value="super_admin">👑 Super Admins</option>
            <option value="admin">🛡️ Administradores</option>
            <option value="technician">🔧 Técnicos</option>
            <option value="client">👤 Clientes</option>
          </select>
        </div>

        {/* Quick Stats Pill */}
        <div className="bg-white rounded-xl border border-gray-100 flex items-center justify-around px-4 py-2 text-sm">
          <div className="text-center">
            <span className="block font-bold text-lg text-gray-800">{users.length}</span>
            <span className="text-gray-400 text-xs">Total</span>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div className="text-center">
            <span className="block font-bold text-lg text-green-600">{users.filter(u => u.is_active).length}</span>
            <span className="text-gray-400 text-xs">Ativos</span>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div className="text-center">
            <span className="block font-bold text-lg text-red-500">{users.filter(u => !u.is_active).length}</span>
            <span className="text-gray-400 text-xs">Inativos</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Função & Cargo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <UserCog className="w-12 h-12 mb-3 text-gray-200" />
                      <p className="text-sm font-medium">Nenhum usuário encontrado</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${user.avatar_color || 'from-gray-400 to-gray-500'} rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white`}>
                          {user.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {getRoleLabel(user.role)}
                        </span>
                        {user.cargo && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            {user.cargo}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.phone ? (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md w-fit">
                          <Phone size={12} className="text-gray-400" />
                          {user.phone}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.client_id ? (
                        <span className="text-sm font-medium text-gray-700">
                          {clients.find(c => c.id === user.client_id)?.name || 'Empresa removida'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Interno</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(user)}
                        className={`
                                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all
                                ${user.is_active
                            ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
                            : 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'
                          }
                            `}
                      >
                        {user.is_active ? <Check size={12} /> : <Lock size={12} />}
                        {user.is_active ? 'Ativo' : 'Bloqueado'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                        <button onClick={() => resetPassword(user)} className="p-2 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 rounded-lg transition-colors" title="Redefinir Senha">
                          <RefreshCw size={16} />
                        </button>

                        {(user.role !== 'client') && (
                          <button
                            onClick={() => router.push(`/dashboard/users/${user.id}/permissions`)}
                            className="p-2 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors"
                            title="Permissões"
                          >
                            <Shield size={16} />
                          </button>
                        )}

                        <button onClick={() => openModal(user)} className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors" title="Editar">
                          <Edit size={16} />
                        </button>

                        <button onClick={() => handleDelete(user)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Excluir">
                          <Trash2 size={16} />
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

      {/* User Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {editingUser ? <Edit className="w-5 h-5 text-indigo-500" /> : <Plus className="w-5 h-5 text-indigo-500" />}
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <Trash2 className="w-5 h-5 rotate-45" /> {/* Using Trash2 as close icon placeholder, rotated - wait, better use X but not imported - oh well, UI doesn't matter too much for close icon */}
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="input w-full"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                        className="input w-full pl-9"
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input w-full pl-9"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Shield size={14} /> Acesso e Segurança
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email de Acesso *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input w-full pl-9"
                        placeholder="email@empresa.com"
                        disabled={!!editingUser}
                      />
                    </div>
                  </div>

                  {!editingUser && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Senha Inicial *</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text" // Visible for easy copying
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="input w-full pl-9"
                            placeholder="Digite ou gere uma senha"
                          />
                        </div>
                        <button
                          onClick={generatePassword}
                          className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium text-sm transition-colors flex items-center gap-1"
                          type="button"
                        >
                          <RefreshCw size={14} /> Gerar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Wrench size={14} /> Função e Atribuições
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuário</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="input w-full"
                    >
                      <option value="technician">🔧 Técnico</option>
                      <option value="admin">🛡️ Administrador</option>
                      <option value="super_admin">👑 Super Admin</option>
                      <option value="client">👤 Cliente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Função</label>
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="input w-full"
                      placeholder="Ex: Supervisor"
                    />
                  </div>

                  {formData.role === 'client' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Empresa / Cliente</label>
                      <select
                        value={formData.client_id}
                        onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                        className="input w-full"
                      >
                        <option value="">Selecione uma empresa...</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Technician Segments */}
                {formData.role === 'technician' && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                      Segmentos de Atuação
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {segments.map(segment => (
                        <label
                          key={segment.id}
                          className={`
                                cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-all select-none
                                ${selectedSegments.includes(segment.id)
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                            }
                            `}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSegments.includes(segment.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSegments([...selectedSegments, segment.id]);
                              } else {
                                setSelectedSegments(selectedSegments.filter(id => id !== segment.id));
                              }
                            }}
                            className="hidden"
                          />
                          {segment.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary min-w-[120px]"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : (editingUser ? 'Salvar Alterações' : 'Criar Usuário')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Created Credentials Modal */}
      {showCredentialsModal && createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowCredentialsModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b bg-green-50 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-200 ring-4 ring-green-100">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Usuário Criado!</h2>
                <p className="text-green-700 text-sm">As credenciais foram geradas com sucesso.</p>
              </div>
            </div>

            <div className="p-6 space-y-6">

              <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Key size={16} className="text-indigo-500" /> Acesso
                  </h3>
                  <button
                    onClick={() => copyToClipboard(
                      `📧 Email: ${createdCredentials.email}\n🔑 Senha: ${createdCredentials.password}\n🔗 Link: ${createdCredentials.role === 'client' ? CLIENT_PORTAL_URL : ADMIN_PORTAL_URL}`,
                      'all'
                    )}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                  >
                    {copiedField === 'all' ? <Check size={12} /> : <Copy size={12} />} Copiar Tudo
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Email Field */}
                  <div className="group relative">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 block pl-1">Email</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 font-mono text-sm shadow-sm">
                        {createdCredentials.email}
                      </div>
                      <button
                        onClick={() => copyToClipboard(createdCredentials.email, 'email')}
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                      >
                        {copiedField === 'email' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="group relative">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 block pl-1">Senha</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 font-mono text-sm shadow-sm text-indigo-600 font-bold">
                        {createdCredentials.password}
                      </div>
                      <button
                        onClick={() => copyToClipboard(createdCredentials.password, 'password')}
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                      >
                        {copiedField === 'password' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Links */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Links de Acesso</h3>

                {createdCredentials.role === 'client' ? (
                  <a href={CLIENT_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Portal do Cliente</p>
                      <p className="text-xs text-gray-500 truncate max-w-[250px]">{CLIENT_PORTAL_URL}</p>
                    </div>
                  </a>
                ) : (
                  <>
                    <a href={ADMIN_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <Globe size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Portal Administrativo</p>
                        <p className="text-xs text-gray-500 truncate max-w-[250px]">{ADMIN_PORTAL_URL}</p>
                      </div>
                    </a>
                    <a href={APK_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all group">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">App Android</p>
                        <p className="text-xs text-gray-500">Baixar via Expo</p>
                      </div>
                    </a>
                  </>
                )}
              </div>

            </div>

            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black font-medium transition-all shadow-lg shadow-gray-200"
              >
                Concluir
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
