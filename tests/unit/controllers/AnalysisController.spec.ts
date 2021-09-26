/* eslint-disable @typescript-eslint/no-var-requires */
import 'reflect-metadata';
import AnalysisController from './../../../src/controllers/AnalysisController';

import { container } from 'tsyringe';

const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');

let controller: AnalysisController;
let forceError: boolean;

class GenericMockedServices {
  public async run() {
    if (forceError) {
      throw new Error('Mocked Error');
    }
    return { mocked: true };
  }
}

describe('Analysis controller', () => {
  beforeEach(() => {
    forceError = false;
    jest
      .spyOn(container, 'resolve')
      .mockReturnValue(new GenericMockedServices());
    controller = new AnalysisController();
  });
  it('should return status 200 when sucess on analysis', async () => {
    const request = new MockExpressRequest({
      method: 'POST',
      body: {
        dna: ['ACGT', 'TGCA', 'GTTC', 'ATCG']
      }
    });
    const response = new MockExpressResponse();
    await controller.analysis(request, response);
    expect(response.statusCode).toEqual(200);
    expect(response._getJSON()).toEqual({ mocked: true });
  });
  it('should return status 200 when sucess on stats', async () => {
    const request = new MockExpressRequest({
      method: 'GET'
    });
    const response = new MockExpressResponse();
    await controller.stats(request, response);
    expect(response.statusCode).toEqual(200);
    expect(response._getJSON()).toEqual({ mocked: true });
  });
  it('should return status 200 when sucess on list', async () => {
    const request = new MockExpressRequest({
      method: 'GET'
    });
    const response = new MockExpressResponse();
    await controller.list(request, response);
    expect(response.statusCode).toEqual(200);
    expect(response._getJSON()).toEqual({ mocked: true });
  });
  it('should throw the error when it occurs on analysis', async () => {
    forceError = true;
    const request = new MockExpressRequest({
      method: 'POST',
      body: {
        dna: ['ACGT', 'TGCA', 'GTTC', 'ATCG']
      }
    });
    const response = new MockExpressResponse();
    await expect(controller.analysis(request, response)).rejects.toThrowError();
  });
  it('should throw the error when it occurs on stats', async () => {
    forceError = true;
    const request = new MockExpressRequest({
      method: 'GET'
    });
    const response = new MockExpressResponse();
    await expect(controller.stats(request, response)).rejects.toThrowError();
  });
  it('should throw the error when it occurs on list', async () => {
    forceError = true;
    const request = new MockExpressRequest({
      method: 'GET'
    });
    const response = new MockExpressResponse();
    await expect(controller.list(request, response)).rejects.toThrowError();
  });
});
