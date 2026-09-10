export interface DatabaseCredentials {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    ssl: boolean;
    connectionLimit: number;
}

export interface DirectDatabaseCredentials {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    ssl: boolean;
}

function buildBaseUrl(creds: Pick<DatabaseCredentials, 'host' | 'port' | 'user' | 'password' | 'name'>): string {
    const user = encodeURIComponent(creds.user);
    const password = encodeURIComponent(creds.password);

    return `postgresql://${user}:${password}@${creds.host}:${creds.port}/${creds.name}`;
}

/** URL para la app en runtime: pasa por el connection pooler (pgbouncer) de Supabase. */
export function buildDatabaseUrl(creds: DatabaseCredentials): string {
    const params = new URLSearchParams({
        pgbouncer: 'true',
        sslmode: creds.ssl ? 'require' : 'prefer',
        connection_limit: String(creds.connectionLimit),
    });

    return `${buildBaseUrl(creds)}?${params.toString()}`;
}

/** URL directa a Postgres (sin pooler), requerida por Prisma para migraciones. */
export function buildDirectDatabaseUrl(creds: DirectDatabaseCredentials): string {
    const params = new URLSearchParams({
        sslmode: creds.ssl ? 'require' : 'prefer',
    });

    return `${buildBaseUrl(creds)}?${params.toString()}`;
}