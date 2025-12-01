import { Injectable, inject } from '@angular/core';
import { NotificationService } from '@src/app/shared/services/notification-service';
import { SupabaseService } from '@src/app/shared/services/supabase-service';

export interface Experience {
  id: number;

  company: string;
  position: string;
  start_date: string | Date;
  end_date: string | Date | null;
  description: string | null;
  created_at: string;
}

export interface CreateExperience {
  company: string;
  position: string;
  start_date: string;
  end_date?: string | null;
  description?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly notification = inject(NotificationService);

  /**
   * Obtener todas las tecnologías
   */
  async getExperiences(): Promise<Experience[]> {
    try {
      const { data, error } = await this.supabaseService
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      this.notification.error(
        'Error',
        `Error al obtener experiencias: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
      throw error;
    }
  }

  /**
   * Crear nueva experiencia
   */
  async createExperience(experience: CreateExperience): Promise<Experience> {
    try {
      const { data, error } = await this.supabaseService
        .from('experiences')
        .insert([experience])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      this.notification.success('Éxito', 'Experiencia creada con éxito.');
      return data;
    } catch (error) {
      throw new Error(
        `Error al crear Experiencia: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  /**
   * Actualizar experiencia existente
   */
  async updateExperience(
    id: number,
    experience: Partial<CreateExperience>,
  ): Promise<Experience> {
    try {
      const { data, error } = await this.supabaseService
        .from('experiences')
        .update(experience)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      this.notification.success('Éxito', 'Experiencia actualizada con éxito.');
      return data;
    } catch (error) {
      throw new Error(
        `Error al actualizar Experiencia: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  /**
   * Eliminar experiencia
   */
  async deleteExperiencie(id: number): Promise<void> {
    try {
      const { error } = await this.supabaseService
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      this.notification.success('Éxito', 'Experiencia eliminada con éxito.');
    } catch (error) {
      throw new Error(
        `Error al eliminar experiencia: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }
}
