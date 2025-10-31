# Guia Rápido de Instalação - BrainstormOps Blog

## Requisitos

Antes de começar, certifique-se de ter instalado:

1. **Ruby** (versão 3.0 ou superior)
2. **RubyGems** (geralmente vem com Ruby)
3. **GCC e Make** (para compilar extensões nativas)

## Instalação do Ruby

### No Ubuntu/Debian:

```bash
sudo apt-get update
sudo apt-get install ruby-full build-essential zlib1g-dev
```

### No macOS:

```bash
brew install ruby
```

### No Windows:

Baixe e instale o [RubyInstaller](https://rubyinstaller.org/)

## Instalação do Jekyll e Bundler

Após instalar o Ruby, execute:

```bash
gem install jekyll bundler
```

## Configurando o Projeto

1. **Extraia o arquivo zip** do projeto em uma pasta de sua escolha

2. **Navegue até a pasta do projeto:**
   ```bash
   cd brainstormops-blog
   ```

3. **Instale as dependências:**
   ```bash
   bundle install
   ```

## Executando o Site

Para iniciar o servidor de desenvolvimento:

```bash
bundle exec jekyll serve
```

Você verá uma mensagem como:

```
Server address: http://127.0.0.1:4000/
Server running... press ctrl-c to stop.
```

Abra seu navegador e acesse: **http://localhost:4000**

## Comandos Úteis

### Executar com live reload:
```bash
bundle exec jekyll serve --livereload
```

### Executar em modo de produção:
```bash
JEKYLL_ENV=production bundle exec jekyll serve
```

### Gerar arquivos estáticos:
```bash
bundle exec jekyll build
```
Os arquivos gerados estarão em `_site/`

### Limpar arquivos gerados:
```bash
bundle exec jekyll clean
```

## Solução de Problemas

### Erro de permissão ao instalar gems:

**Não use sudo!** Em vez disso, configure o Ruby para instalar gems no seu diretório home:

```bash
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Depois tente novamente:
```bash
gem install jekyll bundler
```

### Erro "command not found: bundle":

Instale o bundler:
```bash
gem install bundler
```

### Porta 4000 já em uso:

Use outra porta:
```bash
bundle exec jekyll serve --port 4001
```

### Problemas com dependências nativas:

Certifique-se de ter as ferramentas de build instaladas:

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential
```

**macOS:**
```bash
xcode-select --install
```

## Próximos Passos

Após o site estar rodando:

1. Explore a estrutura de pastas
2. Edite os posts em `_posts/`
3. Personalize as cores em `assets/css/main.css`
4. Modifique o menu em `_includes/sidebar.html`
5. Ajuste a configuração em `_config.yml`

## Deploy

Quando estiver pronto para publicar:

1. **GitHub Pages** (gratuito):
   - Crie um repositório no GitHub
   - Faça push do código
   - Ative GitHub Pages nas configurações

2. **Netlify** (gratuito):
   - Conecte seu repositório
   - Build command: `jekyll build`
   - Publish directory: `_site`

3. **Servidor próprio**:
   - Execute `bundle exec jekyll build`
   - Faça upload da pasta `_site/` para seu servidor

## Recursos Adicionais

- [Documentação oficial do Jekyll](https://jekyllrb.com/docs/)
- [Jekyll Themes](https://jekyllthemes.io/)
- [Liquid Template Language](https://shopify.github.io/liquid/)

## Suporte

Se encontrar problemas, verifique:
1. Versão do Ruby: `ruby --version`
2. Versão do Jekyll: `jekyll --version`
3. Logs de erro no terminal

Para mais ajuda, consulte a [documentação do Jekyll](https://jekyllrb.com/docs/troubleshooting/).
