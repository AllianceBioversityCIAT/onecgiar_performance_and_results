import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('test_module')
export class TestModule {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column({
        type: 'text',
        name: 'name',
        nullable: true
    })
    name: string;
}
