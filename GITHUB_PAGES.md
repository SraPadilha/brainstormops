# Guia Completo: Deploy no GitHub Pages

Este guia mostra como publicar seu blog BrainstormOps no GitHub Pages de forma rápida e fácil.

## 📋 Pré-requisitos

- Conta no GitHub (gratuita)
- Git instalado no seu computador
- Projeto BrainstormOps extraído

## 🚀 Passo a Passo

### 1. Criar Repositório no GitHub

Você tem duas opções:

#### Opção A: Site Principal (username.github.io)
- Nome do repositório: `seu-usuario.github.io` (substitua "seu-usuario" pelo seu username do GitHub)
- Exemplo: se seu username é "joao", crie `joao.github.io`
- URL final: `https://seu-usuario.github.io`
- **Vantagem**: URL mais limpa, sem nome de repositório

#### Opção B: Site de Projeto (qualquer nome)
- Nome do repositório: qualquer nome, ex: `brainstormops-blog`
- URL final: `https://seu-usuario.github.io/brainstormops-blog`
- **Vantagem**: Pode ter múltiplos sites

### 2. Configurar o Projeto

#### Se escolheu a Opção A (username.github.io):
O arquivo `_config.yml` já está configurado corretamente. Não precisa mudar nada!

#### Se escolheu a Opção B (site de projeto):
Edite o arquivo `_config.yml` e altere a linha do `baseurl`:

```yaml
baseurl: "/nome-do-seu-repositorio"
```

Exemplo:
```yaml
baseurl: "/brainstormops-blog"
```

### 3. Inicializar Git e Fazer Upload

Abra o terminal na pasta do projeto e execute:

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit - BrainstormOps blog"

# Adicionar o repositório remoto (substitua SEU-USUARIO e NOME-REPO)
git remote add origin https://github.com/SEU-USUARIO/NOME-REPO.git

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push para o GitHub
git push -u origin main
```

**Exemplo real:**
```bash
git remote add origin https://github.com/joao/joao.github.io.git
git branch -M main
git push -u origin main
```

### 4. Ativar GitHub Pages

1. Vá até o repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source** (Fonte):
   - Branch: selecione `main`
   - Folder: selecione `/ (root)`
5. Clique em **Save** (Salvar)

### 5. Aguardar o Deploy

- O GitHub Pages levará de 1 a 5 minutos para fazer o build
- Você verá uma mensagem: "Your site is ready to be published at..."
- Quando ficar verde: "Your site is published at...", está pronto!

### 6. Acessar seu Site

- **Opção A**: `https://seu-usuario.github.io`
- **Opção B**: `https://seu-usuario.github.io/nome-do-repo`

## 🔄 Atualizando o Site

Sempre que fizer mudanças:

```bash
# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push
```

O GitHub Pages atualizará automaticamente em alguns minutos.

## 📝 Adicionando Novos Posts

1. Crie um arquivo em `_posts/` com o formato:
   ```
   YYYY-MM-DD-titulo-do-post.md
   ```

2. Adicione o front matter:
   ```yaml
   ---
   layout: post
   title: "Título do Post"
   date: 2024-10-31 10:00:00 -0300
   ---
   ```

3. Escreva o conteúdo em Markdown

4. Faça commit e push:
   ```bash
   git add _posts/
   git commit -m "Novo post: Título do Post"
   git push
   ```

## 🎨 Personalizando

### Mudar Cores

Edite `assets/css/main.css` e altere as variáveis:

```css
:root {
  --bg-dark: #0f1419;
  --color-primary: #5dd5f5;
  /* ... outras cores ... */
}
```

### Modificar Menu

Edite `_includes/sidebar.html` para adicionar/remover itens.

### Ajustar Informações do Site

Edite `_config.yml`:

```yaml
title: Seu Título
description: Sua descrição
```

## 🌐 Domínio Personalizado (Opcional)

Se você tem um domínio próprio (ex: `meusite.com`):

1. Crie um arquivo `CNAME` na raiz do projeto:
   ```
   meusite.com
   ```

2. Configure o DNS do seu domínio:
   - Adicione um registro CNAME apontando para `seu-usuario.github.io`
   - Ou registros A para os IPs do GitHub:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. No GitHub Pages Settings, adicione seu domínio customizado

4. Ative "Enforce HTTPS"

## ⚠️ Problemas Comuns

### Site não aparece / Erro 404

**Solução 1**: Verifique se o `baseurl` está correto no `_config.yml`
- Site principal: `baseurl: ""`
- Site de projeto: `baseurl: "/nome-do-repo"`

**Solução 2**: Aguarde alguns minutos, o build pode estar em andamento

**Solução 3**: Verifique a aba "Actions" no GitHub para ver se há erros no build

### CSS/JS não carregam

Verifique se o `baseurl` está correto e se você está usando `relative_url` nos templates:

```liquid
{{ '/assets/css/main.css' | relative_url }}
```

### Posts não aparecem

Verifique se:
- Os arquivos estão na pasta `_posts/`
- O nome do arquivo segue o formato `YYYY-MM-DD-titulo.md`
- A data no front matter não é futura
- O front matter está correto

### Animação não funciona

- Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
- Verifique o console do navegador (F12) para erros

## 📊 Verificar Status do Build

1. Vá até a aba **Actions** no seu repositório
2. Você verá o histórico de builds
3. Clique em um build para ver detalhes
4. Se houver erro, ele será mostrado aqui

## 🔒 Tornar Repositório Privado

O GitHub Pages funciona com repositórios públicos gratuitamente. Para repositórios privados, você precisa do GitHub Pro.

## 📈 Analytics (Opcional)

Para adicionar Google Analytics:

1. Obtenha seu ID de tracking (ex: G-XXXXXXXXXX)
2. Adicione no `_config.yml`:
   ```yaml
   google_analytics: G-XXXXXXXXXX
   ```
3. Adicione no `_layouts/default.html` antes de `</head>`:
   ```html
   {% if site.google_analytics %}
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id={{ site.google_analytics }}"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', '{{ site.google_analytics }}');
   </script>
   {% endif %}
   ```

## 🎯 Checklist de Deploy

- [ ] Repositório criado no GitHub
- [ ] `baseurl` configurado corretamente no `_config.yml`
- [ ] Git inicializado e código enviado
- [ ] GitHub Pages ativado nas configurações
- [ ] Branch `main` e pasta `/` selecionados
- [ ] Build concluído com sucesso (verde)
- [ ] Site acessível na URL
- [ ] Animação funcionando
- [ ] Sidebar recolhendo/expandindo
- [ ] Posts aparecendo corretamente
- [ ] Links funcionando

## 🆘 Precisa de Ajuda?

- [Documentação oficial do GitHub Pages](https://docs.github.com/pt/pages)
- [Documentação do Jekyll](https://jekyllrb.com/docs/)
- [Fórum da comunidade Jekyll](https://talk.jekyllrb.com/)

## 🎉 Pronto!

Seu blog BrainstormOps está no ar! Compartilhe a URL com seus amigos e comece a publicar conteúdo incrível.
