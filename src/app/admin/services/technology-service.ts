import { Injectable, inject } from '@angular/core';
import { NotificationService } from '@src/app/shared/services/notification-service';

import { SupabaseService } from '@src/app/shared/services/supabase-service';

// Interfaz para la tecnología (basada en la estructura real de Supabase)
export interface Technology {
  id: number;
  name: string;
  created_at: string;
  documentation_link: string | null;
  is_skill: boolean;
  icon_link: string | null;
}

// Interfaz para crear/actualizar tecnología
export interface CreateTechnology {
  name: string;
  documentation_link?: string | null;
  is_skill?: boolean;
  icon_link?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly notification = inject(NotificationService);

  /**
   * Obtener todas las tecnologías
   */
  async getTechnologies(): Promise<Technology[]> {
    try {
      const { data, error } = await this.supabaseService
        .from('technologies')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      this.notification.error(
        'Error',
        `Error al obtener tecnologías: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
      throw error;
    }
  }

  /**
   * Obtener tecnologías que son skills
   */
  async getSkillTechnologies(): Promise<Technology[]> {
    try {
      const { data, error } = await this.supabaseService
        .from('technologies')
        .select('*')
        .eq('is_skill', true)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      this.notification.error(
        'Error',
        `Error alobtener tecnologías que son skills: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
      throw error;
    }
  }

  /**
   * Crear nueva tecnología
   */
  async createTechnology(technology: CreateTechnology): Promise<Technology> {
    try {
      const { data, error } = await this.supabaseService
        .from('technologies')
        .insert([technology])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      this.notification.success('Éxito', 'Tecnología creada con éxito.');
      return data;
    } catch (error) {
      // this.notification.error(
      //   'Error',
      //   `Error al crear tecnología: ${
      //     (error as { message?: string })?.message ?? 'Error desconocido'
      //   }`,
      // );
      throw new Error(
        `Error al crear tecnología: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  /**
   * Actualizar tecnología existente
   */
  async updateTechnology(
    id: number,
    technology: Partial<CreateTechnology>,
  ): Promise<Technology> {
    try {
      const { data, error } = await this.supabaseService
        .from('technologies')
        .update(technology)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      this.notification.success('Éxito', 'Tecnología actualizada con éxito.');
      return data;
    } catch (error) {
      // this.notification.error(
      //   'Error',
      //   `Error al actualizar tecnología: ${
      //     (error as { message?: string })?.message ?? 'Error desconocido'
      //   }`,
      // );

      throw new Error(
        `Error al actualizar tecnología: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  /**
   * Eliminar tecnología
   */
  async deleteTechnology(id: number): Promise<void> {
    try {
      const { error } = await this.supabaseService
        .from('technologies')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      this.notification.success('Éxito', 'Tecnología eliminada con éxito.');
    } catch (error) {
      // this.notification.error(
      //   'Error',
      //   `Error al eliminar tecnología: ${
      //     (error as { message?: string })?.message ?? 'Error desconocido'
      //   }`,
      // );
      throw new Error(
        `Error al eliminar tecnología: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }
}
