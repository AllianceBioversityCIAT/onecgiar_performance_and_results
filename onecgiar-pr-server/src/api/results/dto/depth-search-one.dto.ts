import { Column } from "typeorm";

export class DepthSearchOne{
    public id: string;
    public title: string;
    public description!: string;
    public crp: string
    public year: number;
    public legacy: number;
    public is_migrated: number;
}