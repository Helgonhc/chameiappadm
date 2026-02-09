'use client';
// Force Vercel cache refresh - 00:05


import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

// Novos Componentes Modulares
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';

import { Segments } from '@/components/landing/Segments';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { DemoModal } from '@/components/landing/DemoModal';
import { SystemPreview } from '@/components/landing/SystemPreview';

function LandingContent() {
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('Start');

  useEffect(() => {
    if (searchParams.get('showDemo') === 'true') {
      setShowDemoModal(true);
    }
  }, [searchParams]);

  const openDemoWithPlan = (plan: string) => {
    setSelectedPlan(plan);
    setShowDemoModal(true);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Novo: Suporte a âncoras na carga inicial da página
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Timeout para garantir que o DOM está pronto
      setTimeout(() => scrollToSection(hash), 500);
    }
  }, []);

  const handleWhatsAppClick = (message = 'Olá! Gostaria de saber mais sobre o ChameiApp.') => {
    window.open(`https://wa.me/5531999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Atualiza a barra de endereços sem recarregar a página
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-300 selection:bg-emerald-500 selection:text-white font-sans overflow-x-hidden">

      <Navbar
        scrolled={scrolled}
        scrollToSection={scrollToSection}
        setShowDemoModal={() => openDemoWithPlan('Start')}
      />

      <main>
        <Hero
          setShowDemoModal={() => openDemoWithPlan('Start')}
          scrollToSection={scrollToSection}
        />

        <SystemPreview />

        <Features />



        <Segments />

        <HowItWorks />

        <Pricing
          onSelectPlan={openDemoWithPlan}
          handleWhatsAppClick={handleWhatsAppClick}
        />

        <FAQ />

      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      <button
        onClick={() => handleWhatsAppClick()}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-bounce group"
      >
        <MessageSquare size={32} />
      </button>

      {/* Demo Capture Modal */}
      {showDemoModal && (
        <DemoModal
          selectedPlan={selectedPlan}
          onClose={() => setShowDemoModal(false)}
          handleWhatsAppClick={handleWhatsAppClick}
        />
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <LandingContent />
    </Suspense>
  );
}
