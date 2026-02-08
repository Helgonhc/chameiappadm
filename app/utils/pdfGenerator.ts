import toast from 'react-hot-toast';

export const generateQuotePDF = async (quote: any) => {
    toast.loading('Gerando PDF...', { id: 'pdf-toast' });

    // Simular delay de geração
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('PDF gerado com sucesso!', { id: 'pdf-toast' });

    // Aqui entraria a lógica real com jsPDF ou similar
    console.log('PDF gerado para:', quote);
};
