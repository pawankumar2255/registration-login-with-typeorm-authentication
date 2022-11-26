import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn('increment', { name: "userId" })
    userId: number;

    @Column({ name: 'firstName' })
    firstName: string

    @Column({ name: 'lastName' })
    lastName: string

    @Column({ name: 'email' })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true, name: 'refreshtoken' })
    refreshToken: string;

    @Column({ type: 'date', nullable: true, name: 'refreshtokenexp' })
    refreshTokenExp: string;

}
