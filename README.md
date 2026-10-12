# DNA Analysis

[![CI](https://github.com/uricbonatti/dna-analysis/actions/workflows/ci.yml/badge.svg)](https://github.com/uricbonatti/dna-analysis/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/node-22%20%7C%2024-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)

API REST que identifica se uma sequência de DNA pertence a um **símio** ou a um **humano**, e guarda estatísticas das análises. Foi feita como solução do [desafio técnico](docs/Desafio.pdf) da Perfect Flight (2021).

Um DNA é de símio quando a matriz **N×N** tem **2 ou mais sequências de quatro letras iguais** (`AAAA`, `TTTT`, `CCCC`, `GGGG`) na horizontal, na vertical ou nas diagonais.

## Destaques técnicos

- **Arquitetura em camadas** (controller → service → repository) com injeção de dependência (`tsyringe`)
- **MongoDB + TypeORM 0.3**, com **índice único** em `dna_chain`: um registro por DNA, garantido pelo banco
- **Validação de entrada** com Joi (`celebrate`) e **rate limit** por IP
- **Testes:** 36 unitários (~99% de statements) e **7 e2e com Testcontainers**, que sobem um MongoDB real
- **Docker:** imagem multi-stage com Node 24 e usuário sem privilégios; `docker compose up -d` deixa tudo de pé na porta **8000**, como pede o desafio

## Executando

### Com Docker Compose (recomendado)

```bash
docker compose up -d
```

A API sobe em `http://localhost:8000` com o MongoDB.

### Localmente

Requer Node.js **22** ou **24** e um MongoDB.

```bash
cp .env.example .env
docker run -d --name dna-mongo -p 27017:27017 mongo:7
npm ci
npm run start:dev
```

## Exemplos

```bash
curl -X POST http://localhost:8000/simian \
  -H 'Content-Type: application/json' \
  -d '{"dna": ["CTGAGA", "CTATGC", "TATTGT", "AGAGGG", "CCCCTA", "TCACTG"]}'
# 200 {"is_simian": true}

curl http://localhost:8000/stats
# 200 {"count_simian_dna": 1, "count_human_dna": 1, "ratio": 1}
# sem humanos registrados, o campo "ratio" é omitido
```

| Rota | Descrição |
|---|---|
| `POST /simian` | Analisa a matriz e responde `{"is_simian": boolean}` (200), ou 400 se a entrada for inválida (não N×N, letras fora de A/T/C/G) |
| `GET /stats` | `count_simian_dna`, `count_human_dna` e `ratio` (símios / humanos) |
| `GET /stats/list` | Lista as análises registradas |

Documentação completa em [`docs/swagger.yaml`](docs/swagger.yaml) (abra no [Swagger Editor](https://editor.swagger.io)). Há também uma coleção do Postman em [`docs/requests.postman_collection`](docs/requests.postman_collection).

## Testes

```bash
npm test               # unitários (com --coverage gera o relatório em coverage/)
npm run test:e2e       # e2e: sobe um MongoDB real com Testcontainers (requer Docker)
npm run lint
npm run typecheck
```

Os e2e cobrem o exemplo do enunciado, humano, reenvio do mesmo DNA (unicidade), índice único no banco, `/stats` e validações. Não precisam de infraestrutura local além do Docker.

## Licença

MIT
