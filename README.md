# EL Service — MVP Fase 1

Projeto gerado a partir do documento "EL Service - Modelagem Inicial", cobrindo o
núcleo da **Fase 1** do roadmap: autenticação, multiempresa, clientes, técnicos,
serviços, ordens de serviço (com máquina de status) e agenda básica.

## Stack

- **Backend:** Java 21 + Spring Boot 3.4, Spring Security + JWT, Spring Data JPA,
  Flyway, MapStruct, MySQL, OpenAPI/Swagger.
- **Frontend:** Angular 21 (standalone components, signals, zoneless-ready),
  TypeScript estrito, Reactive Forms, roteamento com lazy loading.

## Como rodar o backend

1. Tenha um MySQL rodando localmente (ou ajuste `application.yml`).
2. Configure as variáveis de ambiente (ou use os defaults de dev):
   ```
   DB_USER=root
   DB_PASSWORD=root
   JWT_SECRET=uma-chave-bem-grande-e-secreta
   ```
3. Rode:
   ```
   cd backend
   ./mvnw spring-boot:run
   ```
4. O Flyway cria o schema automaticamente (`V1__init.sql`) e insere:
   - Empresa "EL Service" (id 1)
   - Usuário admin: `admin@elservice.com` / senha `123456`
5. Documentação da API: http://localhost:8080/docs

## Como rodar o frontend

```
cd frontend
npm install
npm start
```

Acesse http://localhost:4200 e faça login com `admin@elservice.com` / `123456`.

## O que já está pronto (Fase 1)

- Login com JWT + contexto multiempresa (`empresa_id` sempre validado no backend,
  nunca confiado vindo do frontend).
- CRUD de Clientes, Técnicos e Serviços.
- Ordens de Serviço: abertura, itens/serviços, cálculo automático de totais,
  e **máquina de transição de status** (RASCUNHO → ... → CONCLUIDA/CANCELADA),
  espelhando a seção 6 do documento de modelagem — validada tanto no backend
  quanto no frontend.
- Agenda básica (criação e consulta por período).
- Dashboard com contagem de OS por status.
- Estrutura de pastas por domínio, como recomendado no documento (seção 8).

## O que falta para as próximas fases (não incluído ainda)

- **Fase 2:** orçamento com aprovação por link público, produtos/estoque,
  pagamentos, notificações, integração WhatsApp.
- **Fase 3:** financeiro completo, contratos recorrentes, manutenção preventiva,
  equipes, rotas/geolocalização, app técnico mobile (Ionic), integrações fiscais.
- Tela mobile-first do técnico (checklist, fotos, assinatura, check-in/check-out).
- Testes automatizados (backend e frontend).
- CI/CD e deploy (Docker, etc).

## Próximo passo sugerido

Recomendo seguirmos módulo por módulo, na ordem: (1) checklist + fotos/anexos na OS,
(2) tela mobile do técnico, (3) orçamento com aprovação. Me chame quando quiser
avançar em algum desses.
