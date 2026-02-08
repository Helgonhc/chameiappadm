'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, Zap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/frontend/lib/supabase';

interface DemoModalProps {
    selectedPlan: string;
    onClose: () => void;
    handleWhatsAppClick: (message?: string) => void;
}

export function DemoModal({ selectedPlan, onClose, handleWhatsAppClick }: DemoModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [leadName, setLeadName] = useState('');
    const [leadEmail, setLeadEmail] = useState('');
    const [leadWhatsapp, setLeadWhatsapp] = useState('');
    const [leadSegment, setLeadSegment] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDemoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Salvar no Supabase (SaaS Multi-tenant ready)
            const { error: supabaseError } = await supabase.from('leads').insert([
                {
                    name: leadName,
                    email: leadEmail,
                    whatsapp: leadWhatsapp,
                    segment: leadSegment,
                    interested_plan: selectedPlan,
                    organization_id: '00000000-0000-0000-0000-000000000000' // Default para Master
                }
            ]);

            if (supabaseError) console.error('Erro ao salvar lead:', supabaseError);

            // 2. Criar Assinatura no Asaas via API
            const response = await fetch('/api/asaas/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: leadName,
                    email: leadEmail,
                    whatsapp: leadWhatsapp,
                    plan: selectedPlan
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Assinatura criada! Redirecionando para pagamento...');
                setTimeout(() => {
                    if (data.invoiceUrl) {
                        window.location.href = data.invoiceUrl;
                    } else {
                        handleWhatsAppClick(`Olá! Acabei de me cadastrar no plano ${selectedPlan}. Gostaria de finalizar minha assinatura.`);
                    }
                }, 1500);
            } else {
                toast.error('Erro ao criar assinatura. Vamos te redirecionar para o WhatsApp.');
                setTimeout(() => {
                    handleWhatsAppClick(`Olá! Tentei me cadastrar no plano ${selectedPlan} mas tive problemas. Pode me ajudar?`);
                }, 1500);
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Erro ao processar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    const modalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root') || document.body : null;

    if (!modalRoot) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-12 shadow-3xl animate-fadeInUp scrollbar-hide">
                <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-red-500 transition-colors"><X className="w-6 h-6 md:w-7 md:h-7" /></button>
                <div className="space-y-4 md:space-y-6 text-center mb-8 md:mb-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-500 mx-auto transition-all"><Zap className="w-6 h-6 md:w-8 md:h-8" /></div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[1px] md:tracking-[2px]">
                        Plano Escolhido: {selectedPlan}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-[#020617] tracking-tighter leading-none italic uppercase">Confirme seus Dados.</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium tracking-tight">Preencha os dados abaixo para gerar sua assinatura e liberar acesso.</p>
                <form onSubmit={handleDemoSubmit} className="space-y-4 md:space-y-6">
                    <div className="space-y-3 md:space-y-4">
                        <input type="text" required value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Nome Completo / Empresa" className="w-full h-12 md:h-14 px-5 md:px-6 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-[#020617] font-bold outline-none focus:border-emerald-500 transition-all text-sm md:text-base" />
                        <input type="email" required value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder="E-mail Corporativo" className="w-full h-12 md:h-14 px-5 md:px-6 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-[#020617] font-bold outline-none focus:border-emerald-500 transition-all text-sm md:text-base" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <input type="tel" required value={leadWhatsapp} onChange={(e) => setLeadWhatsapp(e.target.value)} placeholder="WhatsApp" className="w-full h-12 md:h-14 px-5 md:px-6 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-[#020617] font-bold outline-none focus:border-emerald-500 transition-all text-sm md:text-base" />
                            <select required value={leadSegment} onChange={(e) => setLeadSegment(e.target.value)} className="w-full h-12 md:h-14 px-5 md:px-6 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-[#020617] font-bold outline-none focus:border-emerald-500 transition-all appearance-none text-sm md:text-base">
                                <option value="">Segmento...</option>
                                <option value="Refrigeração">Refrigeração</option>
                                <option value="Ar Condicionado">Ar Condicionado</option>
                                <option value="Manutenção Predial">Manutenção Predial</option>
                                <option value="Elétrica">Elétrica</option>
                                <option value="Hidráulica">Hidráulica</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full h-12 md:h-14 bg-[#020617] hover:bg-[#020617]/90 text-white font-black rounded-xl md:rounded-2xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base">
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            'LIBERAR MEU ACESSO AGORA'
                        )}
                    </button>
                    <p className="text-center text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">Configuração Instantânea - Zero Taxas</p>
                </form>
            </div>
        </div>,
        modalRoot
    );
}
