export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MANAGER = "manager"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    toJSON(): Omit<this, "password" | "toJSON">;
}
