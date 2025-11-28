import { Injectable, inject } from '@angular/core';
import { NotificationService } from '@src/app/shared/services/notification-service';
import { SupabaseService } from '@src/app/shared/services/supabase-service';

export interface Image {
  id: number;
  name: string;
  public_url: string;
  path: string;
  is_logo: boolean;
  created_at: string;
}

export interface CreateImage {
  name: string;
  public_url?: string;
  path?: string;
  is_logo?: boolean;
  file?: File;
}

interface UploadResponse {
  path: string;
  publicUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly notification = inject(NotificationService);

  private readonly bucket = 'images';
  private readonly folder = '';

  async getImages(): Promise<Image[]> {
    try {
      const { data, error } = await this.supabaseService
        .from('images')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      this.notification.error(
        'Error',
        `Error al obtener imágenes: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
      throw error;
    }
  }

  async createImage(image: CreateImage): Promise<Image> {
    try {
      if (!image.file || !image.name) {
        throw new Error('Falta el archivo o el nombre de la imagen');
      }

      const uploadResult = await this.uploadFile(image.file, image.name);

      if (!uploadResult) {
        throw new Error('Error al subir el archivo de la imagen');
      }

      const { data, error } = await this.supabaseService
        .from('images')
        .insert([
          {
            name: image.name,
            is_logo: image.is_logo,
            path: uploadResult.path,
            public_url: uploadResult.publicUrl,
          },
        ])
        .select()
        .single();

      if (error) {
        await this.deleteFile(uploadResult.path);

        throw new Error(error.message);
      }

      this.notification.success('Éxito', 'Imagen creada correctamente');
      return data;
    } catch (error) {
      throw new Error(
        `Error al crear imagen: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  async updateImage(id: number, image: CreateImage): Promise<Image> {
    try {
      const updateData = {
        name: image.name,
        public_url: image.public_url,
        path: image.path,
        is_logo: image.is_logo,
      };

      if (image.file && image.path) {
        const uploadResult = await this.uploadFile(image.file, image.name);

        if (!uploadResult) {
          throw new Error('Error al subir el archivo de la imagen');
        }

        updateData.path = uploadResult.path;
        updateData.public_url = uploadResult.publicUrl;
      }

      const { data, error } = await this.supabaseService
        .from('images')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (updateData.path) await this.deleteFile(updateData.path);

        throw new Error(error.message);
      }

      if (image.file && image.path) await this.deleteFile(image.path);

      this.notification.success('Éxito', 'Imagen actualizada correctamente');
      return data;
    } catch (error) {
      throw new Error(
        `Error al actualizar imagen: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  async deleteImage(id: number): Promise<void> {
    try {
      const { error } = await this.supabaseService
        .from('images')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      this.notification.success('Éxito', 'Imagen eliminada correctamente');
    } catch (error) {
      throw new Error(
        `Error al eliminar imagen: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
    }
  }

  async uploadFile(file: File, name: string): Promise<UploadResponse | null> {
    const finalFileName = this.generateFileName(file, name);

    const filePath = this.folder
      ? `${this.folder}/${finalFileName}`
      : finalFileName;

    try {
      // Upload del archivo
      const { data, error } = await this.supabaseService.client.storage
        .from(this.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Obtener URL pública
      const { data: publicUrlData } = this.supabaseService.client.storage
        .from(this.bucket)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
      };
    } catch (error) {
      this.notification.error(
        'Error',
        `Error al subir la imagen: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );

      throw error;
    }
  }

  private generateFileName(file: File, name: string): string {
    const timestamp = Date.now();

    const fileName = name
      .trim()
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/\s+/g, '-');

    const extension = file.name.split('.').pop() || '';

    return `${timestamp}_${fileName}.${extension}`;
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const { error } = await this.supabaseService.client.storage
        .from(this.bucket)
        .remove([path]);

      if (error) {
        throw error;
      }
    } catch (error) {
      this.notification.error(
        'Error',
        `Error al eliminar el archivo: ${
          (error as { message?: string })?.message ?? 'Error desconocido'
        }`,
      );
      throw error;
    }
  }
}
