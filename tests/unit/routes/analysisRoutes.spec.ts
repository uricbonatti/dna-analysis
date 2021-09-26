import { Server } from 'http';
import 'reflect-metadata';

import supertest, { SuperAgentTest } from 'supertest';
import { container } from 'tsyringe';

import app from './../../../src/app/app';

let server: Server;
let agent: SuperAgentTest;
let forceError: boolean;

class GenericMockedServices {
  public async run() {
    if (forceError) {
      throw new Error('Mocked Error');
    }
    return { mocked: true };
  }
}
describe('Analysis Routes', () => {
  beforeEach((done) => {
    forceError = false;
    jest
      .spyOn(container, 'resolve')
      .mockReturnValue(new GenericMockedServices());
    server = app.listen('8001', () => {
      agent = supertest.agent(server);
      return done();
    });
  });
  afterEach(() => {
    return server && server.close();
  });
  it('should return status 200 when analisys occurs withou errors on POST /simian', async () => {
    const response = await agent
      .post('/simian')
      .send({ dna: ['ACGT', 'TGCA', 'GTTC', 'ATCG'] });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ mocked: true });
  });
  it('should return status 200 on GET /stats', async () => {
    const response = await agent.get('/stats');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ mocked: true });
  });
  it('should return status 200 on GET /stats/list', async () => {
    const response = await agent.get('/stats/list');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ mocked: true });
  });

  it('should return status 400 when occur an error on validation on POST /simian', async () => {
    const response = await agent
      .post('/simian')
      .send({ dna: ['ACG', 'TGCA', 'GTTC', 'ATCG'] });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('Validation failed');
  });
  it('should return status 400 when occur an error on validation on POST /simian (2)', async () => {
    const response = await agent
      .post('/simian')
      .send({ dna: ['ACGA', 'TGCA', 'GTTC'] });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('Validation failed');
  });

  it('should return status 500 when occur an error on analisys on POST /simian', async () => {
    forceError = true;
    const response = await agent
      .post('/simian')
      .send({ dna: ['ACGT', 'TGCA', 'GTTC', 'ATCG'] });
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal server error.'
    });
  });
  it('should return status 500 when occur an error on analisys on GET /stats', async () => {
    forceError = true;
    const response = await agent.get('/stats');
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal server error.'
    });
  });
});
