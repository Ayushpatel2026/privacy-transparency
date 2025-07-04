import { HttpClient } from "@/services/HttpClient";

/**
 * A simple HTTP client implementation for interacting with a cloud storage API.
 * This client supports GET, POST, PUT, and DELETE methods with optional authentication.
 */
export class CloudStorageService implements HttpClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(method: string, path: string, body?: any, token?: string): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(`${this.baseUrl}${path}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown API error.' }));
            throw new Error(errorData.message || 'API request failed');
        }

        if (response.status === 204) { // No Content for DELETE
            return {} as T;
        }

        return response.json() as Promise<T>;
    }

    get<T>(path: string, token?: string): Promise<T> {
        return this.request<T>('GET', path, undefined, token);
    }

    post<T>(path: string, body: any, token?: string): Promise<T> {
        return this.request<T>('POST', path, body, token);
    }

    put<T>(path: string, body: any, token?: string): Promise<T> {
        return this.request<T>('PUT', path, body, token);
    }

    delete<T>(path: string, token?: string): Promise<T> {
        return this.request<T>('DELETE', path, undefined, token);
    }
}