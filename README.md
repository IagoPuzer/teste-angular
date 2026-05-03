# Teste Pratico - Gestao de Processos Juridicos

SPA em Angular 19 para autenticacao, dashboard e CRUD de processos juridicos.

## Stack

- Angular 19 + TypeScript
- PrimeNG + PrimeIcons
- TailwindCSS (pipeline PostCSS compativel com Angular 19)
- Keycloak (`keycloak-angular` + `keycloak-js`)
- Reactive Forms

## Requisitos

- Node 20+ (testado com Node 22)
- pnpm 10+

## Setup

```bash
pnpm install
```

## Executar em desenvolvimento

```bash
pnpm start
```

A aplicacao sobe em `http://localhost:4200`.

## Build

```bash
pnpm build
```

## Testes

```bash
pnpm test
```

## Rodar Keycloak local (Docker)

Para a autenticacao via Keycloak funcionar corretamente, o Docker precisa estar em execucao e os containers do Keycloak precisam estar ativos.

No diretorio `frontend`:

```bash
docker compose -f docker-compose.keycloak.yml up -d
```

### Credenciais de teste

Ja existe uma conta de teste criada no Keycloak para facilitar o acesso inicial:

- **Usuario:** teste
- **Senha:** teste123

Caso prefira, voce pode criar uma nova conta diretamente pelo Keycloak.

## Estrutura principal

```text
src/app
  core/
  guards/
  layouts/
  models/
  pages/
    auth/
    dashboard/
    processes/
  services/
```

## Decisoes de arquitetura

- Rotas com lazy-loading por feature (`auth`, `dashboard`, `processes`)
- `authGuard` para proteger rotas internas
- `ProcessService` centraliza dados, filtros, paginacao e ordenacao
- Componentizacao da feature de processos em `process-form` e `process-list`
- Interceptor global para loading e erro HTTP
