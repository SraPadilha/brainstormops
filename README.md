# BrainstormOps Blog

Blog Jekyll com design moderno, tema escuro e animação de explosão de partículas.

## Características

- **Barra lateral recolhível** com ícone de toggle
- **Página inicial em tela cheia** com animação de explosão
- **Animação de partículas** revelando o texto "BrainstormOps"
- **Scroll suave** para seção de posts recentes
- **Tema escuro** com paleta de cores personalizada
- **Design responsivo** para todos os dispositivos
- **Grid de posts** com efeitos hover

## Cores do Tema

- **Fundo escuro**: `#0f1419`
- **Cards**: `#1a1f2e`
- **Azul primário**: `#5dd5f5`
- **Laranja**: `#ff9f43`
- **Rosa/Accent**: `#ff6b9d`

## Estrutura do Projeto

```
brainstormops-blog/
├── _config.yml           # Configuração do Jekyll
├── _layouts/             # Templates de layout
│   ├── default.html      # Layout padrão
│   └── post.html         # Layout para posts
├── _includes/            # Componentes reutilizáveis
│   └── sidebar.html      # Barra lateral
├── _posts/               # Posts do blog
├── assets/
│   ├── css/
│   │   └── main.css      # Estilos principais
│   ├── js/
│   │   ├── sidebar.js    # Controle da sidebar
│   │   └── explosion.js  # Animação de explosão
│   └── images/           # Imagens do site
├── index.html            # Página inicial
├── Gemfile               # Dependências Ruby
└── README.md             # Este arquivo
```

## Instalação e Uso

### Pré-requisitos

- Ruby 3.0 ou superior
- Jekyll 4.4 ou superior
- Bundler

### Instalação

1. Clone ou baixe este repositório
2. Navegue até o diretório do projeto:
   ```bash
   cd brainstormops-blog
   ```

3. Instale as dependências:
   ```bash
   bundle install
   ```

### Executar Localmente

Para iniciar o servidor de desenvolvimento:

```bash
bundle exec jekyll serve
```

O site estará disponível em `http://localhost:4000`

Para permitir acesso de outros dispositivos na rede:

```bash
bundle exec jekyll serve --host 0.0.0.0
```

### Criar Novos Posts

1. Crie um novo arquivo em `_posts/` com o formato:
   ```
   YYYY-MM-DD-titulo-do-post.md
   ```

2. Adicione o front matter no início do arquivo:
   ```yaml
   ---
   layout: post
   title: "Título do Post"
   date: 2024-10-31 10:00:00 -0300
   ---
   ```

3. Escreva o conteúdo do post em Markdown

### Personalização

#### Modificar Cores

Edite as variáveis CSS em `assets/css/main.css`:

```css
:root {
  --bg-dark: #0f1419;
  --bg-card: #1a1f2e;
  --color-primary: #5dd5f5;
  --color-secondary: #ff9f43;
  --color-accent: #ff6b9d;
  /* ... */
}
```

#### Ajustar Animação

Modifique os parâmetros em `assets/js/explosion.js`:

```javascript
const ANIMATION_DURATION = 5000; // Duração total
const TEXT_FADE_START = 3000;    // Quando o texto aparece
const particleCount = 1000;      // Número de partículas
```

#### Modificar Menu da Sidebar

Edite `_includes/sidebar.html` para adicionar ou remover itens do menu.

## Build para Produção

Para gerar os arquivos estáticos para produção:

```bash
bundle exec jekyll build
```

Os arquivos gerados estarão na pasta `_site/`

## Deploy

Este site Jekyll pode ser hospedado em:

- **GitHub Pages**: Faça push para um repositório GitHub e ative o GitHub Pages
- **Netlify**: Conecte seu repositório e configure o build command como `jekyll build`
- **Vercel**: Similar ao Netlify
- **Servidor próprio**: Faça upload dos arquivos da pasta `_site/`

### Exemplo de Deploy no GitHub Pages

1. Crie um repositório no GitHub
2. Faça push do código
3. Vá em Settings > Pages
4. Selecione a branch `main` e a pasta `/ (root)`
5. Salve e aguarde o deploy

## Funcionalidades da Animação

A animação de explosão na página inicial:

- Inicia automaticamente ao carregar a página
- Dura 5 segundos
- Cria 1000 partículas coloridas que explodem do centro
- O texto "BrainstormOps" aparece gradualmente a partir dos 3 segundos
- Usa cores do tema (azul, laranja, rosa e branco)
- Efeito de brilho nas partículas

## Sidebar Recolhível

- Clique no ícone ☰ para recolher/expandir
- O estado é salvo no localStorage
- Em dispositivos móveis, inicia recolhida automaticamente
- Animação suave de transição

## Compatibilidade

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Dispositivos móveis e tablets
- Suporte a telas de diferentes tamanhos

## Licença

Este projeto é fornecido como está, para uso pessoal ou comercial.

## Suporte

Para questões ou sugestões, abra uma issue no repositório do projeto.
