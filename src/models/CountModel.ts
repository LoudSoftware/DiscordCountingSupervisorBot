import { Snowflake } from "discord.js";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    timestamps: false,
    updatedAt: false,
})
export class CountModel extends Model<CountModel> {

    @Column
    public author: Snowflake;

    @Column
    public number: number;

    @Column
    public date: Date;
}