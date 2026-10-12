import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('dna_analysis')
class Dna {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  is_simian: boolean;

  // Índice único no MongoDB: garante 1 registro por DNA (requisito do desafio).
  @Index({ unique: true })
  @Column()
  dna_chain: string;
}

export default Dna;
