export declare const auth: import("better-auth").Auth<{
    baseURL: string | undefined;
    secret: string | undefined;
    trustedOrigins: string[];
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
    };
    socialProviders: {
        google: {
            clientId: string;
            clientSecret: string;
            prompt: "select_account";
        };
    };
}>;
