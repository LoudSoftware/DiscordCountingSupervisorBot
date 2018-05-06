import { Snowflake, User } from "discord.js";
import { Column, CreatedAt, HasMany, Model, NotNull, Table, UpdatedAt } from "sequelize-typescript";

@Table({
    timestamps: true
})
export class CountModel extends Model<CountModel> {

    @Column
    public author: Snowflake;

    @Column
    public number: number;

    @CreatedAt
    public date: Date;
}