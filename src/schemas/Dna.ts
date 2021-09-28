import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('dna_analysis')
class Dna {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  is_simian: boolean;

  @Column({ unique: true })
  dna_chain: string;
}

export default Dna;
