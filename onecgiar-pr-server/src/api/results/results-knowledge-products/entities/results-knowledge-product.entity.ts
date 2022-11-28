import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../../auth/modules/user/entities/user.entity';
import { ClarisaMeliaStudyType } from '../../../../clarisa/clarisa-melia-study-type/entities/clarisa-melia-study-type.entity';
import { Result } from '../../entities/result.entity';
import { Version } from '../../versions/entities/version.entity';
import { ResultsKnowledgeProductAltmetric } from './results-knowledge-product-altmetrics.entity';
import { ResultsKnowledgeProductAuthor } from './results-knowledge-product-authors.entity';
import { ResultsKnowledgeProductInstitution } from './results-knowledge-product-institution.entity';
import { ResultsKnowledgeProductKeyword } from './results-knowledge-product-keywords.entity';
import { ResultsKnowledgeProductMetadata } from './results-knowledge-product-metadata.entity';

@Entity()
export class ResultsKnowledgeProduct {
  @PrimaryGeneratedColumn({
    name: 'result_knowledge_product_id',
    type: 'bigint',
  })
  result_knowledge_product_id: number;

  @Column()
  results_id: number;

  @Column({
    name: 'handle',
    type: 'text',
    nullable: true,
  })
  handle: string;

  @Column({
    name: 'name',
    type: 'text',
    nullable: true,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'doi',
    type: 'text',
    nullable: true,
  })
  doi: string;

  @Column({
    name: 'knowledge_product_type',
    type: 'text',
    nullable: true,
  })
  knowledge_product_type: string;

  @Column({
    name: 'licence',
    type: 'text',
    nullable: true,
  })
  licence: string;

  @Column({
    name: 'comodity',
    type: 'text',
    nullable: true,
  })
  comodity: string;

  @Column({
    name: 'sponsors',
    type: 'text',
    nullable: true,
  })
  sponsors: string;

  @Column({
    name: 'findable',
    type: 'float',
    nullable: true,
  })
  findable: number;

  @Column({
    name: 'accesible',
    type: 'float',
    nullable: true,
  })
  accesible: number;

  @Column({
    name: 'interoperable',
    type: 'float',
    nullable: true,
  })
  interoperable: number;

  @Column({
    name: 'reusable',
    type: 'float',
    nullable: true,
  })
  reusable: number;

  @Column({
    name: 'is_melia',
    type: 'boolean',
    nullable: true,
  })
  is_melia: boolean;

  @Column({
    name: 'melia_previous_submitted',
    type: 'boolean',
    nullable: true,
  })
  melia_previous_submitted: boolean;

  @ManyToOne(() => ClarisaMeliaStudyType, (cmst) => cmst.id)
  @JoinColumn({
    name: 'melia_type_id',
  })
  melia_type_id: number;

  //TODO to be extracted in result_region when the mapping is done
  @Column({
    type: 'text',
    nullable: true,
  })
  cgspace_regions: string;

  //TODO to be extracted in result_country when the mapping is done
  @Column({
    type: 'text',
    nullable: true,
  })
  cgspace_countries: string;

  //versioning field
  @ManyToOne(() => Version, (v) => v.id, { nullable: false })
  @JoinColumn({
    name: 'version_id',
  })
  version_id: number;

  //audit fields
  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  is_active: boolean;

  @ManyToOne(() => User, (u) => u.id, { nullable: false })
  @JoinColumn({
    name: 'created_by',
  })
  created_by: number;

  @CreateDateColumn({
    name: 'created_date',
    nullable: false,
    type: 'timestamp',
  })
  created_date: Date;

  @UpdateDateColumn({
    name: 'last_updated_date',
    type: 'timestamp',
    nullable: true,
  })
  last_updated_date: Date;

  @ManyToOne(() => User, (u) => u.id, { nullable: true })
  @JoinColumn({
    name: 'last_updated_by',
  })
  last_updated_by: number;

  //object relations
  @OneToMany(
    () => ResultsKnowledgeProductAltmetric,
    (rkpa) => rkpa.result_knowledge_product_object,
  )
  result_knowledge_product_altmetric_array: ResultsKnowledgeProductAltmetric[];

  @OneToMany(
    () => ResultsKnowledgeProductInstitution,
    (rkpi) => rkpi.result_knowledge_product_object,
  )
  result_knowledge_product_institution_array: ResultsKnowledgeProductInstitution[];

  @OneToMany(
    () => ResultsKnowledgeProductMetadata,
    (rkpi) => rkpi.result_knowledge_product_object,
  )
  result_knowledge_product_metadata_array: ResultsKnowledgeProductMetadata[];

  @OneToMany(
    () => ResultsKnowledgeProductKeyword,
    (rkpi) => rkpi.result_knowledge_product_object,
  )
  result_knowledge_product_keyword_array: ResultsKnowledgeProductKeyword[];

  @OneToMany(
    () => ResultsKnowledgeProductAuthor,
    (rkpi) => rkpi.result_knowledge_product_object,
  )
  result_knowledge_product_author_array: ResultsKnowledgeProductAuthor[];

  @ManyToOne(() => Result, (r) => r.id)
  @JoinColumn({
    name: 'results_id',
  })
  result_object: Result;
}
