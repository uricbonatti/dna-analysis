import { Server } from 'http';
import 'reflect-metadata';

import supertest, { SuperAgentTest } from 'supertest';
import { container } from 'tsyringe';

import app from './../../../src/app/app';
import AppError from './../../../src/errors/AppError';

let server: Server;
let agent: SuperAgentTest;
let forceError: boolean;
let forceAppError: boolean;

class GenericMockedServices {
  public async run() {
    if (forceError) {
      throw new Error('Mocked Error');
    }
    if (forceAppError) {
      throw new AppError('Mocked AppError', 403);
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
    server = app.listen('8002', () => {
      agent = supertest.agent(server);
      return done();
    });
  });
  afterEach(() => {
    return server && server.close();
  });

  it('should return status 200 on GET /stats', async () => {
    const response = await agent.get('/stats');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ mocked: true });
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
  it('should return status 500 when occur an error on analisys on GET /stats', async () => {
    forceAppError = true;
    const response = await agent.get('/stats');
    expect(response.statusCode).toEqual(403);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Mocked AppError'
    });
  });
});
