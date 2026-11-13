export declare const auth: import("better-auth").Auth<{
    baseURL: string | undefined;
    secret: string | undefined;
    trustedOrigins: string[];
    account: {
        storeStateStrategy: "cookie";
    };
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
        password: {
            verify: ({ hash, password }: {
                hash: string;
                password: string;
            }) => Promise<boolean>;
        };
    };
    plugins: [{
        id: "bearer";
        version: string;
        hooks: {
            before: {
                matcher(context: import("better-auth").HookEndpointContext): boolean;
                handler: import("better-auth").Middleware<import("better-auth").MiddlewareOptions, (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    context: {
                        headers: Headers;
                    };
                } | undefined>>;
            }[];
            after: {
                matcher(context: import("better-auth").HookEndpointContext): true;
                handler: import("better-auth").Middleware<import("better-auth").MiddlewareOptions, (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<void>>;
            }[];
        };
        options: import("better-auth/plugins").BearerOptions | undefined;
    }];
    socialProviders: {
        google: {
            clientId: string;
            clientSecret: string;
            prompt: "select_account";
        };
    };
}>;
