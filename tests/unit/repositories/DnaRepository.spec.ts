import getMongoRepository from '../../../src/repositories/getMongoRepository';
import DnaRepository from '../../../src/repositories/DnaRepository';
import { ObjectId } from 'mongodb';
import Dna from './../../../src/schemas/Dna';

jest.mock('../../../src/repositories/getMongoRepository');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedGetMongoRepo = getMongoRepository as jest.MockedFunction<any>;

let repository: DnaRepository;
let forceError: boolean;

describe('Dna Repository', () => {
  beforeEach(() => {
    forceError = false;
    mockedGetMongoRepo.mockReturnValue({
      count: jest.fn().mockImplementation(() => {
        if (forceError) {
          throw new Error();
        }
        return 4;
      }),
      findOne: jest.fn().mockImplementation((data) => {
        if (forceError) {
          throw new Error();
        }
        return {
          id: new ObjectId('61507e5259550a3bd459f866'),
          dna_chain: data.dna_chain,
          is_simian: true
        };
      }),
      create: jest
        .fn()
        .mockImplementation(({ dna_chain, is_simian }: Partial<Dna>) => {
          return {
            id: new ObjectId(),
            dna_chain,
            is_simian
          };
        }),
      save: jest.fn().mockImplementation((dna: Dna) => {
        if (forceError) {
          throw new Error();
        }
        return dna;
      }),
      find: jest.fn().mockImplementation(() => {
        if (forceError) {
          throw new Error();
        }
        return [];
      })
    });
    repository = new DnaRepository();
  });

  it('should return all data on list', async () => {
    const data = await repository.list();
    expect(data).toEqual([]);
  });
  it('should throw the error when it occurs  on list', async () => {
    forceError = true;
    await expect(repository.list()).rejects.toThrowError();
  });

  it('should the found Dna data on findByChain', async () => {
    const data = await repository.findByChain('AAAAA');
    expect(data).not.toBeUndefined();
    console.log(data);
    if (data) {
      expect(data.dna_chain).toEqual('AAAAA');
      expect(data.is_simian).toBeTruthy();
    }
  });
  it('should throw the error when it occurs  on findByChain', async () => {
    forceError = true;
    await expect(repository.findByChain('AAAAA')).rejects.toThrowError();
  });
  it('should the save Dna analysis data on create', async () => {
    const data = await repository.create({
      dna_chain: 'AAAAA',
      is_simian: false
    });
    expect(data.dna_chain).toEqual('AAAAA');
    expect(data.is_simian).toBeFalsy();
  });
  it('should throw the error when it occurs  on create', async () => {
    forceError = true;
    await expect(
      repository.create({
        dna_chain: 'AAAAA',
        is_simian: false
      })
    ).rejects.toThrowError();
  });

  it('should the return the count simians data on count', async () => {
    const data = await repository.count(true);
    expect(data).toEqual(4);
  });
  it('should throw the error when it occurs  on create', async () => {
    forceError = true;
    await expect(repository.count(true)).rejects.toThrowError();
  });
});
