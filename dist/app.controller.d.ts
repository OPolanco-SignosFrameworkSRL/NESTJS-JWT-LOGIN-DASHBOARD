export declare class AppController {
    getInfo(): {
        name: string;
        version: string;
        description: string;
        status: string;
        timestamp: string;
    };
    getHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
    };
}
