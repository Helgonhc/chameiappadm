# Guia Técnico: PDF de Alta Fidelidade (Pixel-Perfect)

Este guia detalha as técnicas aplicadas para garantir que o PDF gerado seja 100% fiel à visualização do navegador, mantendo a nitidez profissional e um tamanho de arquivo otimizado.

---

### 1. Pilares da Qualidade

#### A. Proporções Dinâmicas (Fim das fontes achatadas)
O erro mais comum é forçar um conteúdo longo em uma página A4 fixa (297mm). Isso causa compressão vertical.
- **Solução:** Calcular a altura do PDF com base no aspecto real do conteúdo.
- **Lógica:** `const mmHeight = (canvas.height * 210) / canvas.width;`
- **Ação:** Criar a página no PDF com essa altura exata: `pdf.addPage([210, mmHeight])`.

#### B. Ponto Ideal de Resolução (DPI)
- **Scale 2.2:** É o "ponto de equilíbrio" entre nitidez e tamanho. Equivale a ~210 DPI.
- **Scale 1.0:** Muito borrado.
- **Scale 3.0+:** Arquivo pesado demais (centenas de MB).

#### C. Otimização de Peso (JPEG vs PNG)
- **PNG:** Ideal para transparências, mas gera arquivos gigantescos em documentos com muitas páginas.
- **JPEG (90%):** Oferece 100% de nitidez visual para textos e tabelas, mas com um peso 50x menor que o PNG.
- **Comando:** `canvas.toDataURL('image/jpeg', 0.90)`.

---

### 2. Prompt para Replicar em Outros Projetos

Copie o texto abaixo para solicitar estas melhorias em outros geradores de relatórios:

> "Reconfigure a geração de PDF (jsPDF + html2canvas) para máxima fidelidade:
> 
> 1.  **Altura Dinâmica**: Meça a altura real de cada página capturada e crie páginas no PDF com dimensões proporcionais (1:1), evitando que as fontes saiam 'achatadas'.
> 2.  **Qualidade de Imagem**: Use escala 2.2 para nitidez profissional. Exporte como JPEG com qualidade 0.90 para manter o arquivo leve e compatível para envio via WhatsApp/E-mail.
> 3.  **Fidelidade de Texto**: Ative 'letterRendering: true' para preservar o espaçamento exato entre as letras.
> 4.  **Segurança Local**: Configure 'useCORS: true' e 'allowTaint: false'. No 'onclone', oculte imagens que não sejam base64 para evitar o erro 'Tainted canvases'.
> 5.  **Configuração de PDF**: Use 'unit: mm' e ative 'compress: true' no jsPDF."

---

### 3. Exemplo de Código Estável

```javascript
const canvas = await html2canvas(element, {
    scale: 2.2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    letterRendering: true
});

const mmWidth = 210;
const mmHeight = (canvas.height * mmWidth) / canvas.width;

pdf.addPage([mmWidth, mmHeight], 'p');
const imgData = canvas.toDataURL('image/jpeg', 0.90);
pdf.addImage(imgData, 'JPEG', 0, 0, mmWidth, mmHeight, undefined, 'FAST');
```

---
*Guia gerado para Helgon Henrique.*
