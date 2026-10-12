import { EntityTarget, MongoRepository, ObjectLiteral } from 'typeorm';
import { dataSource } from '../config/typeorm';

export default function getMongoRepository<T extends ObjectLiteral>(
  entity: EntityTarget<T>
): MongoRepository<T> {
  return dataSource.getMongoRepository(entity);
}
