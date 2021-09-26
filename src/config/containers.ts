import { container } from 'tsyringe';
import IDnaRepository from '../interfaces/IDnaRepository';
import DnaRepository from '../repositories/DnaRepository';

container.registerSingleton<IDnaRepository>('DnaRepository', DnaRepository);
