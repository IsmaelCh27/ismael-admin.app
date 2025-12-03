import { Injectable, inject } from '@angular/core';
import { NotificationService } from '@src/app/shared/services/notification-service';
import { SupabaseService } from '@src/app/shared/services/supabase-service';

export interface Profile {
  id: number;
  name: string;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  image: string | null;
  description: string | null;
}

export interface CreateProfile {
  name: string;
  last_name: string;
  email: string;
  phone: string;
  image?: string | null;
  description?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly notification = inject(NotificationService);

  /**
   * Obtener todos los perfiles
   */
  async getProfiles(): Promise<Profile[]> {
    try {
      const { data, error } = await this.supabaseService
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      this.notification.error(
        'Error',
        `Error al obtener los perfiles: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
      throw error;
    }
  }

  /**
   * Crear nuevo perfil
   */
  async createProfile(profile: CreateProfile): Promise<Profile> {
    try {
      const { data, error } = await this.supabaseService
        .from('profiles')
        .insert([profile])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      this.notification.success('Éxito', 'Perfil creado con éxito.');
      return data;
    } catch (error) {
      throw new Error(
        `Error al crear el perfil: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  /**
   * Actualizar prefil existente
   */
  async updateProfile(
    id: number,
    profile: Partial<CreateProfile>,
  ): Promise<Profile> {
    try {
      const { data, error } = await this.supabaseService
        .from('profiles')
        .update(profile)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      this.notification.success('Éxito', 'Perfil actualizado con éxito.');
      return data;
    } catch (error) {
      throw new Error(
        `Error al actualizar el perfil: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  /**
   * Eliminar perfil
   */
  async deleteProfile(id: number): Promise<void> {
    try {
      const { error } = await this.supabaseService
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      this.notification.success('Éxito', 'Perfil eliminado con éxito.');
    } catch (error) {
      throw new Error(
        `Error al eliminar el perfil: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }
}
