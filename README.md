# LinkFlow

Um aplicativo elegante e responsivo para compartilhar todos os seus links importantes em um só lugar, com design mobile-first e suporte a múltiplos idiomas.

## Visão Geral

O LinkFlow é uma plataforma de compartilhamento de links que permite organizar e compartilhar seus links importantes de forma categorizada e visual, similar ao LinkTree e outras ferramentas de bio link.

### Recursos Principais

- **Design Mobile-First**: Interface otimizada para dispositivos móveis com experiência de toque aprimorada
- **Categorização de Links**: Links organizados em seções colapsáveis
- **Tema Claro/Escuro**: Suporte a alternância de tema para melhor experiência visual
- **Internacionalização**: Suporte a múltiplos idiomas (português, inglês e espanhol)
- **Compartilhamento Direto**: Links que abrem em novas abas para facilitar o acesso
- **Acessibilidade**: Implementação de práticas de acessibilidade para todos os usuários

## Estrutura do Projeto

```
📦 LinkFlow
├── 📂 public/
│   └── 📂 images/
│       ├── avatar.svg                # Imagem de perfil do usuário
│       ├── portfolio-icon.svg        # Ícone para links do portfólio
│       ├── weboasis-icon.svg         # Ícone para outros projetos
│       ├── linkedin-icon.svg         # Ícone para LinkedIn
│       ├── github-icon.svg           # Ícone para GitHub
│       ├── youtube-icon.svg          # Ícone para YouTube
│       └── twitter-icon.svg          # Ícone para Twitter
├── 📂 src/
│   ├── 📂 components/
│   │   ├── LanguageSelector.svelte   # Seletor de idioma
│   │   ├── LinkCard.svelte           # Componente de card para links
│   │   ├── Section.svelte            # Componente de seção colapsável
│   │   └── ThemeToggle.svelte        # Alternador de tema claro/escuro
│   ├── 📂 data/
│   │   └── links.json                # Dados dos links para exibição
│   ├── 📂 lib/
│   │   ├── i18n.ts                   # Sistema de internacionalização
│   │   └── 📂 locales/               # Arquivos de tradução
│   │       ├── en.ts                 # Traduções em inglês
│   │       ├── es.ts                 # Traduções em espanhol
│   │       └── pt.ts                 # Traduções em português
│   ├── App.svelte                    # Componente principal da aplicação
│   └── main.ts                       # Ponto de entrada da aplicação
```

## Componentes Principais

### LinkCard

O componente `LinkCard` exibe um link individual com:
- Ícone à esquerda
- Título centralizado
- Efeito de escala ao passar o mouse/tocar
- Abertura em nova aba
- Tamanho adequado para telas de toque (seguindo diretrizes de acessibilidade)

### Section

O componente `Section` agrupa links relacionados em categorias:
- Cabeçalho com título e indicador de colapso
- Cor de fundo personalizável por seção
- Animação de expansão/colapso
- Estado persistente durante a sessão do usuário

## Configuração de Links

Os links são configurados através do arquivo JSON em `src/data/links.json` que segue a estrutura:

```json
{
  "profile": {
    "name": "Seu Nome",
    "title": "Título Profissional",
    "avatar": "/images/avatar.svg"
  },
  "sections": [
    {
      "name": "Projetos",
      "color": "#7e22ce",
      "links": [
        { "title": "Projeto 1", "url": "https://exemplo.com/projeto1", "icon": "/images/portfolio-icon.svg" },
        // ... mais links
      ]
    },
    // ... mais seções
  ]
}
```

## Testes

O LinkFlow inclui testes unitários e end-to-end (E2E) completos para garantir a qualidade do código e a conformidade com padrões de acessibilidade.

### Testes Unitários

Utilizamos o [Vitest](https://vitest.dev/) para testes unitários com cobertura para:
- Componente `LinkCard`: renderização correta, comportamento visual e atributos de acessibilidade
- Componente `Section`: expansão/colapso, renderização de links e atributos ARIA apropriados
- Sistema de internacionalização: mudança de idiomas, traduções e persistência de preferências
- Alternância de temas: funcionamento correto do tema claro/escuro
- Validação de dados: verificação da estrutura e integridade dos dados de links

### Testes End-to-End (E2E)

Utilizamos o [Playwright](https://playwright.dev/) para testes E2E que verificam:
- Funcionalidade de expansão e colapso das seções de links com feedback visual e ARIA
- Abertura de links em novas abas com atributos apropriados
- Comportamento responsivo em diferentes tamanhos de tela
- Compatibilidade com diferentes navegadores (Chromium, Firefox e WebKit)
- Persistência de preferências de usuário entre sessões

### Testes de Acessibilidade

Implementamos uma abordagem abrangente para testes de acessibilidade, incluindo:

#### Testes Automatizados
- Integração com **axe-core** para detecção automática de problemas de acessibilidade
- Verificação da estrutura correta de cabeçalhos (h1, h2, etc.)
- Validação de contraste de cores em elementos visuais
- Verificação de atributos ARIA nos componentes interativos

#### Testes de Interação por Teclado
- Navegabilidade completa usando apenas o teclado
- Focabilidade adequada de todos os elementos interativos
- Comportamento esperado para teclas Tab, Enter e Espaço
- Contraste visual do indicador de foco em todos os temas

#### Testes de Compatibilidade
- Verificação de funcionalidades em diferentes navegadores
- Testes específicos para contornar limitações do WebKit
- Verificação resiliente com retentativas para testes instáveis

#### Internacionalização e Acessibilidade
- Manutenção de acessibilidade em todos os idiomas suportados
- Verificação de nomes acessíveis apropriados em cada idioma
- Persistência de foco ao alternar entre idiomas
- Textos alternativos adequados em todos os idiomas

O framework de teste inclui classes auxiliares personalizadas (`AccessibilityTester`) que facilitam a implementação consistente de verificações de acessibilidade em toda a aplicação.

## Acessibilidade Navegável por Teclado

O LinkFlow foi implementado com foco especial na navegabilidade por teclado, um aspecto fundamental para garantir a acessibilidade universal.

### Navegação por Teclado no Chromium

A implementação para o navegador Chromium inclui:

- **Ordem de Tabulação Lógica**: Os elementos interativos seguem uma ordem natural de tabulação, de cima para baixo e da esquerda para a direita
- **Indicadores Visuais de Foco**: Contorno de alto contraste em elementos focados, visíveis em ambos os temas (claro e escuro)
- **Atalhos de Teclado**:
  - `Tab`: Navega para o próximo elemento interativo
  - `Shift+Tab`: Navega para o elemento interativo anterior
  - `Enter/Space`: Ativa botões e links
  - `Esc`: Fecha menus ou diálogos abertos

### Recursos de Navegabilidade

- **Skip Links**: Links ocultos que aparecem ao receber foco, permitindo pular para seções principais
- **Persistência de Foco**: Manutenção do foco no elemento correto após interações como expansão/colapso de seções
- **Captura de Foco**: Em modais e diálogos, o foco é capturado dentro do contexto para evitar navegação fora da área ativa
- **ARIA Live Regions**: Anúncios dinâmicos para leitores de tela quando ocorrem mudanças importantes na interface

Toda interação possível com mouse foi cuidadosamente implementada para ser igualmente acessível via teclado, garantindo que usuários com diferentes necessidades possam navegar com eficiência pelo aplicativo.

## Instruções de Uso

### Instalação e Execução

1. Clone o repositório
   ```bash
   git clone [URL-DO-REPOSITÓRIO] LinkFlow
   cd LinkFlow
   ```

2. Instale as dependências
   ```bash
   yarn install
   ```

3. Inicie o servidor de desenvolvimento
   ```bash
   yarn dev
   ```

4. Acesse o aplicativo em `http://localhost:5173/LinkFlow/`

### Personalização

Para personalizar seus links:

1. Edite o arquivo `src/data/links.json` com suas informações
2. Adicione seus ícones personalizados na pasta `public/images/`
3. Ajuste as cores das seções conforme sua preferência no arquivo JSON

## Construção e Implantação

Para gerar uma versão de produção:
```bash
yarn build
```

O resultado será gerado na pasta `dist/` e pode ser hospedado em qualquer servidor web estático.

## Próximos Passos

- **Animações Aprimoradas**: Implementar transições mais suaves entre os estados
- **Temas Personalizados**: Permitir a definição de temas personalizados além do claro/escuro
- **Análise de Cliques**: Adicionar rastreamento de cliques para análise de engajamento
- **Editor Visual**: Interface para edição dos links sem necessidade de editar o JSON

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.
