-- ATUALIZAÇÃO 18/09/2026 - banco de usuários do VozAtiva
CREATE DATABASE IF NOT EXISTS vozativa
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE vozativa;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuarios_email (email)
);
