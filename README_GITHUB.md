# 🚀 BrainstormOps Blog

Blog Jekyll moderno com tema escuro, animação de explosão de partículas e design responsivo.

![Preview](https://via.placeholder.com/800x400/0f1419/5dd5f5?text=BrainstormOps+Blog)

## ✨ Características

- 🎨 **Tema escuro** com paleta de cores personalizada
- 💥 **Animação de explosão** de partículas na página inicial
- 📱 **Design responsivo** para todos os dispositivos
- 📂 **Sidebar recolhível** com salvamento de estado
- 🎯 **Scroll suave** entre seções
- 📝 **Sistema de posts** completo com Jekyll
- ⚡ **Performance otimizada** e SEO-friendly

## 🎬 Demo

Acesse o site: [https://seu-usuario.github.io](https://seu-usuario.github.io)

## 🚀 Deploy Rápido no GitHub Pages

### Método 1: Repositório Principal (Recomendado)

1. **Crie um repositório** com o nome: `seu-usuario.github.io`
2. **Clone este repositório** ou faça upload dos arquivos
3. **Ative GitHub Pages** em Settings → Pages → Source: `main` branch
4. **Acesse**: `https://seu-usuario.github.io`

### Método 2: Repositório de Projeto

1. **Crie um repositório** com qualquer nome (ex: `brainstormops-blog`)
2. **Edite `_config.yml`** e altere:
   ```yaml
   baseurl: "/nome-do-seu-repositorio"
   ```
3. **Faça upload** dos arquivos
4. **Ative GitHub Pages** em Settings → Pages
5. **Acesse**: `https://seu-usuario.github.io/nome-do-repositorio`

## 📖 Documentação Completa

- [📘 Guia Completo de Instalação](INSTALACAO.md)
- [🌐 Deploy no GitHub Pages](GITHUB_PAGES.md)
- [📚 README Detalhado](README.md)

## 🎨 Personalização

### Cores

Edite `assets/css/main.css`:

```css
:root {
  --bg-dark: #0f1419;
  --color-primary: #5dd5f5;
  --color-secondary: #ff9f43;
  --color-accent: #ff6b9d;
}
```

### Animação

Ajuste `assets/js/explosion.js`:

```javascript
const ANIMATION_DURATION = 5000;
const particleCount = 1000;
```

## 📝 Criar Novo Post

```bash
# Crie um arquivo em _posts/
_posts/2024-10-31-meu-novo-post.md
```

```yaml
---
layout: post
title: "Meu Novo Post"
date: 2024-10-31 10:00:00 -0300
---

Conteúdo do post em Markdown...
```

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
bundle install

# Executar servidor
bundle exec jekyll serve

# Acessar
http://localhost:4000
```

## 📦 Estrutura

```
.
├── _config.yml          # Configuração
├── _layouts/            # Templates
├── _includes/           # Componentes
├── _posts/              # Posts do blog
├── assets/
│   ├── css/            # Estilos
│   ├── js/             # Scripts
│   └── images/         # Imagens
└── index.html          # Página inicial
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- 🐛 Reportar bugs
- 💡 Sugerir novas funcionalidades
- 🔧 Enviar pull requests

## 📄 Licença

Este projeto está disponível para uso pessoal e comercial.

## 🙏 Créditos

- Animação inspirada em: [Big Bang Simulation](https://codepen.io/Majid-Manzarpour/pen/PwYrYdg)
- Construído com [Jekyll](https://jekyllrb.com/)
- Hospedado no [GitHub Pages](https://pages.github.com/)

## 📞 Suporte

Tem dúvidas? Consulte a [documentação completa](GITHUB_PAGES.md) ou abra uma issue.

---

⭐ Se você gostou deste projeto, considere dar uma estrela!
