# E.E. Prof. Milton Santos — Site Institucional

Site institucional completo da **Escola Estadual Professor Milton Santos**, desenvolvido com React (Vite) no frontend e PHP + MySQL no backend, com painel administrativo integrado.

> **Produção:** [eeprofmsmd.com.br](https://eeprofmsmd.com.br)

---

## Visão Geral

O sistema é dividido em duas camadas:

- **Frontend (SPA):** Interface pública do site e painel administrativo, construído com React e TypeScript.
- **Backend (API REST):** Endpoints PHP que se comunicam com o banco de dados MySQL para persistência de dados, autenticação e gerenciamento de mídia.

---

## Tecnologias Utilizadas

| Camada     | Tecnologia                                                             |
| ---------- | ---------------------------------------------------------------------- |
| Frontend   | React 18, TypeScript, Vite                                             |
| Estilização| Tailwind CSS                                                           |
| Ícones     | Lucide React                                                           |
| Roteamento | React Router DOM                                                       |
| Notificações | Sonner (Toasts)                                                      |
| Slider     | React Slick + Slick Carousel                                          |
| Backend    | PHP 8.3 (API REST)                                                     |
| Banco      | MySQL (mysqli) — Hospedado na Hostinger                               |
| Hospedagem | Hostinger (hPanel + LiteSpeed)                                        |

---

## Estrutura do Projeto

```
eemiltonsantos/
├── public/               # Assets estáticos (logo, favicon)
├── src/
│   ├── app/
│   │   ├── admin/        # Painel administrativo (Managers)
│   │   ├── components/   # Componentes públicos (Header, Footer, páginas)
│   │   │   └── ui_elements/  # Componentes de UI reutilizáveis
│   │   └── context/      # SiteContext (estado global da aplicação)
│   ├── services/         # Comunicação com a API backend
│   └── types/            # Tipagens TypeScript
├── backend/              # API PHP (endpoints REST)
│   ├── config.php        # Conexão com o banco (não versionado)
│   ├── login.php         # Autenticação de admin
│   ├── get_data.php      # Leitura de dados (seções do site)
│   ├── update_data.php   # Escrita de dados (seções do site)
│   ├── upload_media.php  # Upload de imagens/vídeos
│   ├── delete_media.php  # Remoção de mídia
│   └── get_media.php     # Listagem de mídias
├── bd_script.sql         # Script de criação das tabelas MySQL
├── vite.config.ts        # Configuração do Vite
└── package.json
```

---

## Funcionalidades

### Site Público
- **Página Inicial** com slider de imagens, avisos da escola e cardápio semanal
- **Sobre a Escola** com história, valores, infraestrutura, galeria de fotos e estatísticas
- **Projetos** com listagem, filtros e modal de detalhes
- **Calendário e Eventos** com visualização mensal e horários de início/fim
- **Equipe** com cards de membros e informações de contato
- **Prêmios e Conquistas** da escola
- **Plataformas Educacionais** (SED, CMSP, Google Classroom, etc.)
- **FAQ** com categorias e busca
- **Galeria de Fotos** organizada por álbuns
- **Pop-ups** configuráveis de avisos e comunicados
- **Footer** com informações de contato, redes sociais e mapa

### Painel Administrativo
- **Autenticação** por senha com hash bcrypt (login seguro via sessão PHP)
- **Gerenciador de Mídia** — Upload, visualização, exclusão e rastreamento de uso de imagens
- **Deleção em Cascata** — Ao excluir uma mídia, todas as referências no site são limpas automaticamente
- **Editores por Seção:**
  - Configurações Gerais (nome, contato, redes sociais)
  - Home (hero, avisos, cardápio)
  - Slides do carrossel
  - Equipe (membros, fotos, cargos)
  - Projetos
  - Eventos (com horários)
  - Prêmios
  - Sobre a Escola
  - Plataformas
  - FAQ
  - Galeria
  - Pop-ups

### Persistência de Dados
- **Tabela JSON centralizada** (`site_data`) — Cada seção do site é armazenada como JSON no MySQL
- **Endpoints genéricos** (`get_data.php` / `update_data.php`) — Leitura e escrita de qualquer seção
- **Fallback inteligente** — Se o banco estiver vazio, dados default são exibidos até o admin salvar

---

## Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- PHP 8+ com extensão `mysqli`
- MySQL / MariaDB

### Frontend
```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

### Variável de API
No arquivo `src/services/authService.ts`, ajuste a constante `API_URL` para apontar ao seu backend local:
```typescript
export const API_URL = 'http://localhost/eemiltonsantos/backend';
```

---

## Deploy (Hostinger)

1. Rodar `npm run build` para gerar a pasta `dist/`
2. Subir o conteúdo de `dist/` para `public_html/` na Hostinger
3. Subir a pasta `backend/` para `public_html/backend/`
4. Configurar `backend/config.php` com as credenciais do banco da Hostinger
5. Criar arquivo `.htaccess` na raiz para roteamento SPA
6. Importar `bd_script.sql` no phpMyAdmin

---

## Segurança

- Senhas armazenadas com **bcrypt** (`password_hash` / `password_verify`)
- Sessões PHP com regeneração de ID após login
- CORS configurado para aceitar apenas o domínio de produção
- Arquivos de configuração (`config.php`) excluídos do versionamento
- Validação de tipos de arquivo no upload de mídia
- Prepared statements para prevenção de SQL Injection

---

## Licença

Projeto privado desenvolvido para a E.E. Prof. Milton Santos.

---

## Autores

- **Bruno** — Desenvolvimento Full-Stack
