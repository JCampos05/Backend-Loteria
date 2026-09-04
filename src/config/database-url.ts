export interface DatabaseCredentials {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    ssl: boolean;
    connectionLimit: number;
}

export function buildDatabaseUrl(creds: DatabaseCredentials): string {
    const user = encodeURIComponent(creds.user);
    const password = encodeURIComponent(creds.password);

    const params = new URLSearchParams({
        sslmode: creds.ssl ? 'requier' : 'prefer',
        connection_limit: String(creds.connectionLimit),
    });

    return `postgresql://${user}:${password}@${creds.host}:${creds.port}/${creds.name}?${params.toString()}`;
}