import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InstitutionRole } from "../../institution_roles/entities/institution_role.entity";
import { User } from "../../users/entities/user.entity";
import { Version } from "../../versions/entities/version.entity";

@Entity()
export class ResultsByInstitutionType {
    @PrimaryGeneratedColumn({ name: 'results_id', type: 'bigint' })
    results_id: number;

    // @Column({ name: 'institution_types_id', type: 'bigint', nullable: false })
    // institution_types_id: number;

    @ManyToOne(() => InstitutionRole, ir => ir.id, { nullable: false })
    @JoinColumn({ name: 'institution_roles_id' })
    institution_roles_id: number;

    @Column({ name: 'is_active', type: 'tinyint', nullable: false })
    is_active: number;

    @ManyToOne(() => Version, v => v.id, { nullable: false })
    @JoinColumn({ name: 'version_id' })
    version_id: number;

    @ManyToOne(() => User, u => u.id, { nullable: false })
    @JoinColumn({ name: 'created_by' })
    created_by: number;

    @Column({ name: 'creation_date', type: 'timestamp', nullable: false })
    creation_date: Date;

    @ManyToOne(() => User, u => u.id)
    @JoinColumn({ name: 'last_updated_by' })
    last_updated_by: number;

    @Column({ name: 'last_updated_date', type: 'timestamp' })
    last_updated_date: Date;
}
