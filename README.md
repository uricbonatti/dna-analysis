# Dna-Analysis

## Objetivo

Projeto desenvolvido em para solucionar o Desafio proposto pela Perfect Flight, o mesmo apresenta-se descrito no arquivo abaixo:

[Desafio.pdf](Dna-Analysis%20aa01f752b34145518c4d9a75a1662938/Desafio(1).pdf)

## Swagger

O projeto utiliza de endpoints seguindo a o padrão REST, documentados através do [swagger](http://editor.swagger.io )
<details>
<summary>Código para abrir a documentação no [Swagger](http://editor.swagger.io )</summary>
    
```yaml
    swagger: "2.0"
    info:
      description: "API voltada para a classificação de simios e não simios com base em cadeia de DNA."
      version: "1.0.0"
      title: "Dna Analysis"
      contact:
        email: "uricbonatti.eng@gmail.com"
    host: "localhost:8000"
    basePath: "/"
    schemes:
    - "https"
    - "http"
    paths:
      /simian:
        post:
          tags:
          - "Analisys"
          summary: "Analisa uma cadeia de DNA"
          description: "Realiza a busca por sequencias dentro da cadeia de DNA que correspondem a um simio"
          operationId: "analisysChain"
          consumes:
          - "application/json"
          produces:
          - "application/json"
          parameters:
          - in: "body"
            name: "body"
            description: "Para analisar uma cadeia de DNA é necessario envia-la em um formato de um vetor de strings de dimensões NxN"
            required: true
            schema:
              $ref: "#/definitions/DnaToAnalyse"
          responses:
            "400":
              description: "Entrada Invalida"
              schema:
                $ref: "#/definitions/ValidationError"
            "429":
              description: "Erro de excesso de requisições por IP"
              schema:
                $ref: "#/definitions/LimitAccessError"
            "500":
              description: "Erro interno do Servidor"
              schema:
                $ref: "#/definitions/InternalError"
            "200":
              description: "Analise bem sucedida"
              schema:
                $ref: "#/definitions/AnalysisResult"
      /stats:
        get:
          tags:
          - "Analisys"
          summary: "Calcula a razão de DNA de simios para não simios"
          description: "Calcula a razão de DNA de simios para não simios e apresenta junto do numero de dnas analisados"
          operationId: "analysisRatio"
          consumes:
          - "application/json"
          produces:
          - "application/json"
          responses:
            "500":
              description: "Erro interno do Servidor"
              schema:
                $ref: "#/definitions/InternalError"
            "429":
              description: "Erro de excesso de requisições por IP"
              schema:
                $ref: "#/definitions/LimitAccessError"
            "200":
              description: "Calculo da Razão"
              schema:
                $ref: "#/definitions/Ratio"
      /stats/list:
        get:
          tags:
          - "Analisys"
          summary: "Retorna a lista de DNAs analisados"
          description: "Retorna a lista de DNAs analisados e o resultado obtido na analise"
          operationId: "analysisList"
          consumes:
          - "application/json"
          produces:
          - "application/json"
          responses:
            "429":
              description: "Erro de excesso de requisições por IP"
              schema:
                $ref: "#/definitions/LimitAccessError"
            "500":
              description: "Erro interno do Servidor"
              schema:
                $ref: "#/definitions/InternalError"
            "200":
              description: "Lista de Analises"
              schema:
                $ref: "#/definitions/ListDna"
         
    definitions:
      InternalError:
        type: "object"
        properties:
          status:
            type: "string"
            example: "error"
          message:
            type: "string"
            example: "Internal Server Error"
      ValidationError:
        type: "object"
        properties:
          status:
            type: "string"
            example: "error"
          message:
            type: "string"
            example: "'dna' must contain at least 4 items"
      LimitAccessError:
        type: "object"
        properties:
          status:
            type: "string"
            example: "error"
          message:
            type: "string"
            example: "Too many requests from this IP, please try again after 5 minutes"
      AnalysisResult:
        type: "object"
        properties:
          is_simian:
            type: "boolean"
            example: true
      Ratio:
        type: "object"
        properties:
          count_human_dna:
            type: "integer"
            example: 6
          count_simian_dna:
            type: "integer"
            example: 3
          ratio:
            type: "number"
            example: 0.5
      ListDna:
        type: "array"
        items:
          type: object
          properties:
            id:
              type: "string"
              example: "61507d8339123e37f8beb2f6"
            is_simian:
              type: "boolean"
              example: false
            dna_chain:
              type: "string"
              example: "CTGGAACTATGCTATTGTAGAGGGCACCTATCACTG"
      DnaToAnalyse:
        type: 'object'
        properties:
          dna:
            type: 'array'
            minItems: 4
            items:
              type: 'string'
              pattern: '^[acgtACGT]*$'
              minLength: 4
            example: ["TTTTCA", "GAGAGC", "AGCCCC", "CACCTT", "ATGGCT","ATGGCT"]
```
    
</details>    

## Executando

Para executar o projeto é necessário ter instalado as seguintes ferramentas:

- Docker
- Docker-compose

Através do terminal acesse a pasta do projeto e execute o seguinte comando:

```bash
docker-compose up -d
```

Através desse comando, o Docker executará a build da imagem do projeto e subira uma imagem do MongoDB e a imagem do projeto que utiliza de uma imagem NodeJS.

***Obs.:*** O projeto precisará que a posta 8000 esteja liberada, então caso esteja em uso ocorrera um erro.
