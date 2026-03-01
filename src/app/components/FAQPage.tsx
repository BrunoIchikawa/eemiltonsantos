import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { FAQItem } from '../../types';

export function FAQPage() {
  const { data } = useSiteData();
  const { faq } = data;
  const activeFaq = faq.filter(f => f.active);
  
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  // Ordenar categorias conforme o design solicitado
  const orderedCategories = [
    'Documentação e Matrícula',
    'Vida Escolar e Avaliação',
    'Rotina e Infraestrutura',
    'Plataformas Digitais (Foco no Aluno)',
    'Comunicação com a Gestão'
  ];

  // Agrupar perguntas por categoria
  const groupedFaq = activeFaq.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  const displayCategories = orderedCategories.filter(cat => groupedFaq[cat] && groupedFaq[cat].length > 0);
  const extraCategories = Object.keys(groupedFaq).filter(cat => !orderedCategories.includes(cat));
  const finalCategories = [...displayCategories, ...extraCategories];

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Standard Header */}
      <section className="bg-gradient-to-r from-[#4A7A82] to-[#609BA2] text-white py-12 sm:py-16 text-center">
        <div className="mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-12 h-12 stroke-[1.5]" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{data.general.pageBanners?.faq?.title || 'Dúvidas Frequentes'}</h1>
          </div>
          <p className="text-lg sm:text-xl opacity-90 mx-auto font-normal leading-relaxed max-w-2xl">
            {data.general.pageBanners?.faq?.subtitle || 'Encontre respostas para as perguntas mais comuns sobre documentação, vida escolar, plataformas digitais e muito mais.'}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Lista de Perguntas (Categorizadas) */}
        {activeFaq.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            Nenhuma pergunta cadastrada.
          </div>
        ) : (
          <div className="space-y-12 mb-16">
            {finalCategories.map((category) => (
              <div key={category}>
                {/* Título da Categoria com Linha Inferior */}
                <div className="border-b border-border pb-2 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">{category}</h2>
                </div>

                <div className="space-y-4">
                  {groupedFaq[category].map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === item.id ? null : item.id)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-white hover:bg-muted/50 transition-colors"
                      >
                        <span className={`font-bold text-foreground text-base sm:text-lg pr-4 ${openIndex === item.id ? 'text-primary' : ''}`}>
                          {item.question}
                        </span>
                        <span className={`text-primary transition-transform duration-300 ${openIndex === item.id ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5" />
                        </span>
                      </button>
                      
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden bg-muted/30 ${
                          openIndex === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="p-6 pt-2 text-muted-foreground leading-relaxed border-t border-border/50">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rodapé: Não encontrou a resposta? */}
        <section className="bg-muted rounded-xl p-8 sm:p-12 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Não encontrou a resposta que procurava?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Entre em contato conosco! Nossa equipe está pronta para ajudar com qualquer dúvida que você possa ter.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={`mailto:${data.general.emailSecretaria}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-colors min-w-[160px]"
            >
              <Mail className="w-5 h-5" />
              Enviar Email
            </a>
            <a 
              href={`https://wa.me/${data.general.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-bold transition-colors min-w-[160px]"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
