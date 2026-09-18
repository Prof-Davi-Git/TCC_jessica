# Integração do cadastro e login com MySQL

O site agora possui cadastro e login reais. O navegador envia os dados para um pequeno servidor Node.js, e esse servidor conversa com o MySQL.

## 1. Criar o banco

Abra o MySQL Workbench ou a extensão do MySQL no VS Code e execute todo o arquivo:

`backend/database.sql`

Ele criará o banco `vozativa` e a tabela `usuarios`.

## 2. Configurar a senha do MySQL

Dentro da pasta `backend`, faça uma cópia do arquivo `.env.example` e renomeie a cópia para `.env`.

No arquivo `.env`, substitua:

`DB_PASSWORD=COLOQUE_A_SENHA_DO_MYSQL_AQUI`

pela senha usada no MySQL. Se o usuário `root` não possuir senha, deixe assim:

`DB_PASSWORD=`

O arquivo `.env` não será enviado ao GitHub.

## 3. Instalar e iniciar

Abra o terminal do VS Code na pasta `backend` e execute:

```bash
npm install
npm start
```

Quando aparecer a mensagem abaixo, o projeto estará pronto:

`VozAtiva disponível em http://localhost:3000`

## 4. Abrir o site

Acesse no navegador:

`http://localhost:3000`

Não é necessário iniciar o Live Server. O próprio backend abre o site e mantém a conexão com o banco.

## 5. Testar

1. Clique em **Entrar**.
2. Clique em **Cadastre-se**.
3. Preencha nome, e-mail e senha.
4. Volte ao login e entre com a conta criada.
5. Para confirmar no MySQL, execute:

```sql
USE vozativa;
SELECT id, nome, email, criado_em FROM usuarios;
```

A senha não aparece no banco em texto normal. Ela é protegida com hash no campo `senha_hash`.

## Observação sobre publicação

O GitHub Pages publica apenas a parte visual do site. Para usar cadastro e login pela internet, o backend Node.js e o MySQL também precisarão ser hospedados em um servidor. A configuração atual foi preparada para funcionar localmente no computador da aluna.
