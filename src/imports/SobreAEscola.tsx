import svgPaths from "./svg-urun19ok3n";
const imgImageWithFallback = "/uploads/about-1.png";
const imgImageWithFallback1 = "/uploads/about-2.png";
const imgImageWithFallback2 = "/uploads/about-3.png";
const imgImageWithFallback3 = "/uploads/about-4.png";
const imgImageWithFallback4 = "/uploads/about-5.png";

function Heading() {
  return (
    <div className="absolute h-[48px] left-[32px] top-0 w-[1143.2px]" data-name="Heading 1">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[48px] left-0 not-italic text-[48px] text-white top-[-5px]">Sobre a E.E. Prof. Milton Santos</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[28px] left-[32px] opacity-90 top-[64px] w-[768px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[28px] left-0 not-italic text-[20px] text-white top-[-2.2px]">Uma instituição comprometida com a educação de qualidade há mais de 40 anos.</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[92px] relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Section() {
  return (
    <div className="bg-gradient-to-b content-stretch flex flex-col from-[#2e7ba6] h-[220px] items-start pt-[64px] relative shrink-0 to-[#4a8b63] w-full" data-name="Section">
      <Container />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#333] text-[30px] top-[-2.6px]">Nossa História</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[26px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.4px] w-[1118px] whitespace-pre-wrap">Fundada em 1980, a Escola Estadual Professor Milton Santos nasceu com o propósito de oferecer educação pública de qualidade para a comunidade local. Localizada no coração de São Paulo, nossa escola tem sido um pilar fundamental na formação de milhares de estudantes ao longo de mais de quatro décadas.</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[26px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.4px] w-[1068px] whitespace-pre-wrap">O nome da escola homenageia Milton Santos, ilustre geógrafo brasileiro, Prêmio Vasco de Gama de Geografia e primeiro brasileiro a receber o Prêmio Internacional de Geografia. Sua dedicação à ciência e à educação inspiram nosso compromisso diário com a excelência acadêmica e a formação cidadã.</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[26px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.4px] w-[1056px] whitespace-pre-wrap">Ao longo dos anos, expandimos nossa infraestrutura e implementamos diversos projetos pedagógicos inovadores. Hoje, atendemos alunos do Ensino Fundamental II e Ensino Médio, oferecendo um ambiente acolhedor, seguro e estimulante para o aprendizado.</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[188px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph1 />
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Section1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[248px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading1 />
      <Container2 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#333] text-[30px] top-[-2.6px]">Nossos Valores</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3eeeaa80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2f14bd80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[#2e7ba6] content-stretch flex items-center justify-center left-[24px] rounded-[8px] size-[48px] top-[24px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[88px] w-[218.2px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#333] text-[18px] top-[-1.4px]">Excelência</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[60px] left-[24px] top-[124px] w-[218.2px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#5a6570] text-[14px] top-[-1.2px] w-[200px] whitespace-pre-wrap">Comprometimento com a qualidade do ensino e formação integral dos alunos.</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.08)] border-solid h-[209.6px] left-0 rounded-[8px] top-0 w-[267.8px]" data-name="Container">
      <Container5 />
      <Heading3 />
      <Paragraph4 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1d820380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p161d4800} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2981fe00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p13e20900} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[#2e7ba6] content-stretch flex items-center justify-center left-[24px] rounded-[8px] size-[48px] top-[24px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[88px] w-[218.2px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#333] text-[18px] top-[-1.4px]">Inclusão</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[40px] left-[24px] top-[124px] w-[218.2px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#5a6570] text-[14px] top-[-1.2px] w-[217px] whitespace-pre-wrap">Ambiente acolhedor que respeita e valoriza a diversidade.</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.08)] border-solid h-[209.6px] left-[291.8px] rounded-[8px] top-0 w-[267.8px]" data-name="Container">
      <Container7 />
      <Heading4 />
      <Paragraph5 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M12 7V21" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p38e00000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-[#2e7ba6] content-stretch flex items-center justify-center left-[24px] rounded-[8px] size-[48px] top-[24px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[88px] w-[218.2px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#333] text-[18px] top-[-1.4px]">Conhecimento</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[40px] left-[24px] top-[124px] w-[218.2px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#5a6570] text-[14px] top-[-1.2px] w-[212px] whitespace-pre-wrap">Estímulo ao aprendizado contínuo e ao pensamento crítico.</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.08)] border-solid h-[209.6px] left-[583.6px] rounded-[8px] top-0 w-[267.8px]" data-name="Container">
      <Container9 />
      <Heading5 />
      <Paragraph6 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.pace200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3c6311f0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3d728000} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[#2e7ba6] content-stretch flex items-center justify-center left-[24px] rounded-[8px] size-[48px] top-[24px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[88px] w-[218.2px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#333] text-[18px] top-[-1.4px]">Protagonismo</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[40px] left-[24px] top-[124px] w-[218.2px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#5a6570] text-[14px] top-[-1.2px] w-[206px] whitespace-pre-wrap">Incentivo à participação ativa dos estudantes em sua formação.</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-white border-[0.8px] border-[rgba(0,0,0,0.08)] border-solid h-[209.6px] left-[875.4px] rounded-[8px] top-0 w-[267.8px]" data-name="Container">
      <Container11 />
      <Heading6 />
      <Paragraph7 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[209.6px] relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Container6 />
      <Container8 />
      <Container10 />
    </div>
  );
}

function Section2() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] h-[277.6px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading2 />
      <Container3 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#333] text-[30px] top-[-2.6px]">Infraestrutura</p>
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#333] text-[20px] top-[-2.2px]">Estrutura Completa para o Aprendizado</p>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[24px] left-0 top-[4px] w-[6.5px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#2e7ba6] text-[16px] top-[-2.2px]">•</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[24px] left-[14.5px] top-0 w-[188.137px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.2px]">20 salas de aula equipadas</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Text />
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[24px] left-0 top-[4px] w-[6.5px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#2e7ba6] text-[16px] top-[-2.2px]">•</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[24px] left-[14.5px] top-0 w-[188.338px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.2px]">Laboratório de Informática</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Text2 />
      <Text3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[24px] left-0 top-[4px] w-[6.5px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#2e7ba6] text-[16px] top-[-2.2px]">•</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[24px] left-[14.5px] top-0 w-[165.725px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.2px]">Laboratório de Ciências</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Text4 />
      <Text5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute h-[24px] left-0 top-[4px] w-[6.5px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#2e7ba6] text-[16px] top-[-2.2px]">•</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[24px] left-[14.5px] top-0 w-[269.388px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.2px]">Biblioteca com acervo de 10.000 livros</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Text6 />
      <Text7 />
    </div>
  );
}

function List() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[136px] items-start left-0 top-0 w-[531.6px]" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[24px] left-0 top-[4px] w-[6.5px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#2e7ba6] text-[16px] top-[-2.2px]">•</p>
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute h-[24px] left-[14.5px] top-0 w-[205.95px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.2px]">Quadra poliesportiva coberta</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Text8 />
      <Text9 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[24px] left-0 top-[4px] w-[6.5px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#2e7ba6] text-[16px] top-[-2.2px]">•</p>
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[24px] left-[14.5px] top-0 w-[99.513px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.2px]">Sala de leitura</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Text10 />
      <Text11 />
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute h-[24px] left-0 top-[4px] w-[6.5px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#2e7ba6] text-[16px] top-[-2.2px]">•</p>
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute h-[24px] left-[14.5px] top-0 w-[68.338px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.2px]">Refeitório</p>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Text12 />
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute h-[24px] left-0 top-[4px] w-[6.5px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#2e7ba6] text-[16px] top-[-2.2px]">•</p>
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute h-[24px] left-[14.5px] top-0 w-[170.063px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#5a6570] text-[16px] top-[-2.2px]">Acessibilidade completa</p>
    </div>
  );
}

function ListItem7() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Text14 />
      <Text15 />
    </div>
  );
}

function List1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[136px] items-start left-[547.6px] top-0 w-[531.6px]" data-name="List">
      <ListItem4 />
      <ListItem5 />
      <ListItem6 />
      <ListItem7 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[136px] relative shrink-0 w-full" data-name="Container">
      <List />
      <List1 />
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[#e8f1f5] h-[244px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[32px] px-[32px] relative size-full">
        <Heading8 />
        <Container13 />
      </div>
    </div>
  );
}

function Section3() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[304px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading7 />
      <Container12 />
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#333] text-[30px] top-[-2.6px]">Conheça Nossa Escola</p>
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="h-[205.338px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-[#f7f9fb] content-stretch flex flex-col h-[205.338px] items-start left-0 overflow-clip rounded-[8px] top-0 w-[365.063px]" data-name="Container">
      <ImageWithFallback />
    </div>
  );
}

function ImageWithFallback1() {
  return (
    <div className="h-[205.338px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback1} />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-[#f7f9fb] content-stretch flex flex-col h-[205.338px] items-start left-[389.06px] overflow-clip rounded-[8px] top-0 w-[365.063px]" data-name="Container">
      <ImageWithFallback1 />
    </div>
  );
}

function ImageWithFallback2() {
  return (
    <div className="h-[205.35px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback2} />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[#f7f9fb] content-stretch flex flex-col h-[205.35px] items-start left-[778.13px] overflow-clip rounded-[8px] top-0 w-[365.075px]" data-name="Container">
      <ImageWithFallback2 />
    </div>
  );
}

function ImageWithFallback3() {
  return (
    <div className="h-[205.338px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback3} />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[#f7f9fb] content-stretch flex flex-col h-[205.338px] items-start left-0 overflow-clip rounded-[8px] top-[229.35px] w-[365.063px]" data-name="Container">
      <ImageWithFallback3 />
    </div>
  );
}

function ImageWithFallback4() {
  return (
    <div className="h-[205.338px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback4} />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[#f7f9fb] content-stretch flex flex-col h-[205.338px] items-start left-[389.06px] overflow-clip rounded-[8px] top-[229.35px] w-[365.063px]" data-name="Container">
      <ImageWithFallback4 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[434.688px] relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Container16 />
      <Container17 />
      <Container18 />
      <Container19 />
    </div>
  );
}

function Section4() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] h-[502.688px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading9 />
      <Container14 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Bold',sans-serif] leading-[40px] left-[130.46px] not-italic text-[#2e7ba6] text-[36px] text-center top-[-3px]">40+</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[130.65px] not-italic text-[#5a6570] text-[16px] text-center top-[-2.2px]">Anos de História</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[72px] items-start left-0 top-0 w-[261.8px]" data-name="Container">
      <Container21 />
      <Container22 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Bold',sans-serif] leading-[40px] left-[131.11px] not-italic text-[#2e7ba6] text-[36px] text-center top-[-3px]">500+</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[131.26px] not-italic text-[#5a6570] text-[16px] text-center top-[-2.2px]">Alunos Matriculados</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[72px] items-start left-[293.8px] top-0 w-[261.8px]" data-name="Container">
      <Container24 />
      <Container25 />
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Bold',sans-serif] leading-[40px] left-[130.46px] not-italic text-[#2e7ba6] text-[36px] text-center top-[-3px]">40+</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[130.42px] not-italic text-[#5a6570] text-[16px] text-center top-[-2.2px]">Professores</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[72px] items-start left-[587.6px] top-0 w-[261.8px]" data-name="Container">
      <Container27 />
      <Container28 />
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Bold',sans-serif] leading-[40px] left-[130.46px] not-italic text-[#2e7ba6] text-[36px] text-center top-[-3px]">8+</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[131.11px] not-italic text-[#5a6570] text-[16px] text-center top-[-2.2px]">Projetos Ativos</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[72px] items-start left-[881.4px] top-0 w-[261.8px]" data-name="Container">
      <Container30 />
      <Container31 />
    </div>
  );
}

function Section5() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Section">
      <Container20 />
      <Container23 />
      <Container26 />
      <Container29 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[1756.287px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[64px] items-start pt-[48px] px-[32px] relative size-full">
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="h-[1976.287px] relative shrink-0 w-[1207.2px]" data-name="AboutPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Section />
        <Container1 />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="absolute content-stretch flex flex-col h-[2057px] items-start left-0 top-0 w-[1207px]" data-name="App">
      <AboutPage />
    </div>
  );
}

export default function SobreAEscola() {
  return (
    <div className="bg-white relative size-full" data-name="Sobre a Escola">
      <App />
    </div>
  );
}