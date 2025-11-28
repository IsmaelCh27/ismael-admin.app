import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private static instance: SupabaseClient | null = null;

  /**
   * Obtener la instancia única de Supabase client
   */
  public get client(): SupabaseClient {
    if (!SupabaseService.instance) {
      SupabaseService.instance = createClient(
        environment.supabaseUrl,
        environment.supabaseKey,
      );
    }
    return SupabaseService.instance;
  }

  /**
   * Método de conveniencia para acceder a auth
   */
  public get auth() {
    return this.client.auth;
  }

  /**
   * Método de conveniencia para acceder a storage
   */
  public get storage() {
    return this.client.storage;
  }

  /**
   * Método de conveniencia para crear queries
   */
  public from(table: string) {
    return this.client.from(table);
  }
}
