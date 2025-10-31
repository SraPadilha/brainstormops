
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

