declare const OptionalJwtClienteAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class OptionalJwtClienteAuthGuard extends OptionalJwtClienteAuthGuard_base {
    handleRequest<TUser = unknown>(err: unknown, user: TUser): TUser;
}
export {};
