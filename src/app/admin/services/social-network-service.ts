import { Injectable, inject } from '@angular/core';
import { NotificationService } from '@src/app/shared/services/notification-service';
import { SupabaseService } from '@src/app/shared/services/supabase-service';

export interface SocialNetwork {
  id: number;
  name: string;
  logo: string;
  link: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateSocialNetwork {
  name: string;
  logo: string;
  link: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SocialNetworkService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly notification = inject(NotificationService);

  /**
   * Obtener todas las tecnologías
   */
  async getSocialNetworks(): Promise<SocialNetwork[]> {
    try {
      const { data, error } = await this.supabaseService
        .from('social_networks')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      this.notification.error(
        'Error',
        `Error al obtener red social: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
      throw error;
    }
  }

  /**
   * Crear nueva red social
   */
  async createSocialNetwork(
    socialNetwork: CreateSocialNetwork,
  ): Promise<SocialNetwork> {
    try {
      const { data, error } = await this.supabaseService
        .from('social_networks')
        .insert([socialNetwork])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      this.notification.success('Éxito', 'Red Social creada con éxito.');
      return data;
    } catch (error) {
      throw new Error(
        `Error al crear red social: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  /**
   * Actualizar red social
   */
  async updateSocialNetwork(
    id: number,
    socialNetwork: Partial<CreateSocialNetwork>,
  ): Promise<SocialNetwork> {
    try {
      const { data, error } = await this.supabaseService
        .from('social_networks')
        .update(socialNetwork)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      this.notification.success('Éxito', 'Red Social actualizada con éxito.');
      return data;
    } catch (error) {
      throw new Error(
        `Error al actualizar red social: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  /**
   * Eliminar red social
   */
  async deleteSocialNetwork(id: number): Promise<void> {
    try {
      const { error } = await this.supabaseService
        .from('social_networks')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      this.notification.success('Éxito', 'Red Social eliminada con éxito.');
    } catch (error) {
      throw new Error(
        `Error al eliminar red social: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }
}
