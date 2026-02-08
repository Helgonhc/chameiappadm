// Mock data for demo dashboard
// This data simulates a real production environment without connecting to the database

export const mockStats = {
    totalClients: 47,
    totalEquipments: 156,
    pendingOrders: 12,
    openTickets: 8,
    pendingOvertime: 3,
    completedToday: 5,
    maintenanceVencidas: 4,
    maintenanceUrgentes: 7,
    maintenanceProximas: 15,
};

export const mockOrders = [
    {
        id: 'OS-1234',
        client_name: 'Empresa ABC Ltda',
        equipment_name: 'Ar Condicionado Split 12.000 BTU',
        status: 'pending',
        priority: 'high',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        technician_name: 'João Silva',
    },
    {
        id: 'OS-1235',
        client_name: 'Hospital Central',
        equipment_name: 'Chiller 200 TR',
        status: 'in_progress',
        priority: 'urgent',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        technician_name: 'Maria Santos',
    },
    {
        id: 'OS-1236',
        client_name: 'Condomínio Sol Nascente',
        equipment_name: 'Central de Água Gelada',
        status: 'completed',
        priority: 'medium',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        technician_name: 'Carlos Oliveira',
    },
    {
        id: 'OS-1237',
        client_name: 'Shopping Center Plaza',
        equipment_name: 'VRF 48.000 BTU',
        status: 'pending',
        priority: 'medium',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        technician_name: null,
    },
    {
        id: 'OS-1238',
        client_name: 'Indústria XYZ',
        equipment_name: 'Compressor Parafuso 100 HP',
        status: 'in_progress',
        priority: 'high',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        technician_name: 'Pedro Costa',
    },
];

export const mockTickets = [
    {
        id: 'TKT-456',
        title: 'Ar condicionado não está gelando',
        client_name: 'Escritório Tech Solutions',
        status: 'open',
        priority: 'high',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    },
    {
        id: 'TKT-457',
        title: 'Ruído estranho no equipamento',
        client_name: 'Clínica Médica Saúde+',
        status: 'in_progress',
        priority: 'medium',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    {
        id: 'TKT-458',
        title: 'Vazamento de água',
        client_name: 'Hotel Bela Vista',
        status: 'open',
        priority: 'urgent',
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    },
    {
        id: 'TKT-459',
        title: 'Solicitação de manutenção preventiva',
        client_name: 'Restaurante Sabor & Arte',
        status: 'resolved',
        priority: 'low',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
];

export const mockChartData = [
    { name: 'Seg', ordens: 8, concluidas: 6 },
    { name: 'Ter', ordens: 12, concluidas: 10 },
    { name: 'Qua', ordens: 10, concluidas: 8 },
    { name: 'Qui', ordens: 15, concluidas: 12 },
    { name: 'Sex', ordens: 14, concluidas: 11 },
    { name: 'Sáb', ordens: 6, concluidas: 5 },
    { name: 'Dom', ordens: 3, concluidas: 3 },
];

export const mockStatusChartData = [
    { name: 'Pendentes', value: 12, color: '#f59e0b' },
    { name: 'Em Andamento', value: 18, color: '#3b82f6' },
    { name: 'Concluídas', value: 45, color: '#10b981' },
    { name: 'Canceladas', value: 3, color: '#ef4444' },
];

export const mockUpcomingAppointments = [
    {
        id: 1,
        client_name: 'Empresa Delta',
        equipment_name: 'Ar Condicionado Central',
        scheduled_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        technician_name: 'João Silva',
    },
    {
        id: 2,
        client_name: 'Condomínio Estrela',
        equipment_name: 'Chiller',
        scheduled_date: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
        technician_name: 'Maria Santos',
    },
    {
        id: 3,
        client_name: 'Shopping Boulevard',
        equipment_name: 'VRF',
        scheduled_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
        technician_name: 'Carlos Oliveira',
    },
];

export const mockMaintenanceAlerts = [
    {
        id: 1,
        equipment_name: 'Compressor Atlas Copco',
        client_name: 'Indústria Metalúrgica',
        type: 'vencida',
        days_overdue: 5,
    },
    {
        id: 2,
        equipment_name: 'Chiller York 300 TR',
        client_name: 'Hospital São Lucas',
        type: 'urgente',
        days_until: 2,
    },
    {
        id: 3,
        equipment_name: 'Central de Água Gelada',
        client_name: 'Shopping Center',
        type: 'proxima',
        days_until: 7,
    },
    {
        id: 4,
        equipment_name: 'VRF Daikin 60k',
        client_name: 'Escritório Advocacia',
        type: 'vencida',
        days_overdue: 12,
    },
];
