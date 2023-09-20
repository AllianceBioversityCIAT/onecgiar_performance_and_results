import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClarisaInstitution } from '../../clarisa-institutions/entities/clarisa-institution.entity';
import { ResultsCenter } from '../../../api/results/results-centers/entities/results-center.entity';

@Entity('clarisa_center')
export class ClarisaCenter {
  @PrimaryColumn({
    type: 'varchar',
    length: 15,
    name: 'code',
    primary: true,
  })
  code: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  institutionId: number;

  @Column({
    name: 'financial_code',
    type: 'text',
    nullable: true,
  })
  financial_code: string;

  //object relations
  @ManyToOne(() => ClarisaInstitution, (ci) => ci.clarisa_center)
  @JoinColumn({
    name: 'institutionId',
  })
  clarisa_institution: ClarisaInstitution;

  @OneToMany(() => ResultsCenter, (rc) => rc.clarisa_center_object)
  result_center_array: ResultsCenter[];

  //-------
}
