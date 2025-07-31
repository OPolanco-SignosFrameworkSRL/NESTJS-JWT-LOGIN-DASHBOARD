declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        id: any;
        cedula: any;
        fullname: any;
        role: any;
    }>;
}
export {};
