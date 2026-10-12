import 'reflect-metadata';
import {
  MongoDBContainer,
  StartedMongoDBContainer
} from '@testcontainers/mongodb';
import { MongoClient } from 'mongodb';
import request from 'supertest';
import type { Express } from 'express';
import type { DataSource } from 'typeorm';

// Fluxo completo: Express real + MongoDB real (Testcontainers) + TypeORM.
jest.setTimeout(180_000);

const SIMIAN = ['CTGAGA', 'CTATGC', 'TATTGT', 'AGAGGG', 'CCCCTA', 'TCACTG']; // exemplo do enunciado
const HUMAN = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG'];

let mongoContainer: StartedMongoDBContainer;
let mongo: MongoClient;
let dataSource: DataSource;
let app: Express;

beforeAll(async () => {
  mongoContainer = await new MongoDBContainer('mongo:7').start();
  process.env.DB_URL = `${mongoContainer.getConnectionString()}/?directConnection=true`;
  process.env.MAX_REQUESTS = '1000';

  // Importa só depois de configurar o ambiente: env e DataSource leem DB_URL no import.
  dataSource = (await import('../../src/config/typeorm')).dataSource;
  await dataSource.initialize();
  await import('../../src/config/containers');
  app = (await import('../../src/app/app')).default as Express;

  mongo = await MongoClient.connect(process.env.DB_URL);
});

afterAll(async () => {
  await mongo?.close();
  await dataSource?.destroy();
  await mongoContainer?.stop();
});

const analyses = () => mongo.db('perfectflight').collection('dna_analysis');

describe('POST /simian e GET /stats (e2e)', () => {
  it('identifica um símio (exemplo do enunciado) e persiste no MongoDB', async () => {
    const res = await request(app).post('/simian').send({ dna: SIMIAN });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ is_simian: true });
    expect(
      await analyses().countDocuments({ dna_chain: SIMIAN.join('') })
    ).toBe(1);
  });

  it('identifica um humano', async () => {
    const res = await request(app).post('/simian').send({ dna: HUMAN });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ is_simian: false });
  });

  it('garante um único registro por DNA ao reenviar a mesma sequência', async () => {
    const res = await request(app).post('/simian').send({ dna: SIMIAN });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ is_simian: true });
    expect(
      await analyses().countDocuments({ dna_chain: SIMIAN.join('') })
    ).toBe(1);
  });

  it('cria índice único em dna_chain', async () => {
    const indexes = await analyses().indexes();

    expect(indexes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: { dna_chain: 1 }, unique: true })
      ])
    );
  });

  it('retorna as estatísticas de símios, humanos e a proporção', async () => {
    const res = await request(app).get('/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      count_simian_dna: 1,
      count_human_dna: 1,
      ratio: 1
    });
  });

  it('recusa matriz que não é NxN', async () => {
    const res = await request(app)
      .post('/simian')
      .send({ dna: ['ATGC', 'CAGT', 'TTAT', 'AGACG'] });

    expect(res.status).toBe(400);
  });

  it('recusa letras fora de A, T, C e G', async () => {
    const res = await request(app)
      .post('/simian')
      .send({ dna: ['ATGX', 'CAGT', 'TTAT', 'AGAC'] });

    expect(res.status).toBe(400);
  });
});
