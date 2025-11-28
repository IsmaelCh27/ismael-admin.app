import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '@src/app/shared/services/notification-service';
import { CloudUpload, LucideAngularModule } from 'lucide-angular';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import {
  type CreateImage,
  type Image,
  ImageService,
} from '../../services/image-service';

// Types for file upload callbacks
type FileUploadCallback = () => void;

@Component({
  selector: 'admin-images-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardModule,
    TableModule,
    CommonModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    SkeletonModule,
    FloatLabelModule,
    FormsModule,
    ToggleSwitchModule,
    ConfirmDialogModule,
    BadgeModule,
    FileUpload,
    ToastModule,
    LucideAngularModule,
  ],
  templateUrl: './images-page.html',
  providers: [ConfirmationService],
})
export class ImagesPage {
  private confirmationService = inject(ConfirmationService);
  private readonly notification = inject(NotificationService);

  cloudUpload = CloudUpload;

  formOpen = signal<boolean>(false);
  formBuilder = inject(FormBuilder);

  validForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    is_logo: [false],
  });

  private imageService = inject(ImageService);

  image = signal<Image>({} as Image);
  images = signal<Image[]>([]);
  files = signal<File[]>([]);

  isLoading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    await this.loadImages();
  }

  async loadImages() {
    this.isLoading.set(true);
    this.error.set(null);

    const imgs = await this.imageService.getImages();

    this.images.set(imgs);
    this.isLoading.set(false);
  }

  openForm() {
    this.validForm.patchValue({
      name: '',
      is_logo: false,
    });
    this.image.set({} as Image);
    this.formOpen.set(true);
  }

  async onSubmit() {
    this.isLoading.set(true);

    try {
      if (this.validForm.invalid) {
        this.validForm.markAllAsTouched();
        this.isLoading.set(false);
        return;
      }

      const formValue = this.validForm.value as CreateImage;

      if (this.image().id) {
        await this.imageService.updateImage(this.image().id, {
          ...formValue,
          path: this.image().path,
          public_url: this.image().public_url,
          file: this.files().length > 0 ? this.files()[0] : undefined,
        });
      } else {
        await this.imageService.createImage({
          ...formValue,
          file: this.files().length > 0 ? this.files()[0] : undefined,
        });
      }
      this.closeForm();
      await this.loadImages();
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  closeForm() {
    this.validForm.reset();
    this.image.set({} as Image);
    this.formOpen.set(false);
  }

  handleClickEdit(image: Image) {
    this.image.set(image);

    this.validForm.patchValue({
      name: image.name,
      is_logo: image.is_logo ?? false,
    });
    this.formOpen.set(true);
  }

  handleClickDelete(event: Event, image: Image) {
    this.image.set(image);

    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: `¿Estás seguro de eliminar esta imagen (${image.name})?`,
      icon: 'pi pi-trash',
      rejectLabel: 'No',
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true,
      },
      acceptLabel: 'Si',
      acceptButtonProps: {
        severity: 'danger',
      },
      accept: () => {},
      reject: () => {},
    });
  }

  async deleteImage(image: Image) {
    this.isLoading.set(true);
    try {
      await this.imageService.deleteFile(image.path);
      await this.imageService.deleteImage(image.id);
      await this.loadImages();

      this.isLoading.set(false);
      this.confirmationService.close();
      this.image.set({} as Image);
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  acceptDelete() {
    this.deleteImage(this.image());
  }

  rejectDelete() {
    this.confirmationService.close();
  }

  choose(_event: Event, callback: FileUploadCallback): void {
    callback();
  }

  onSelectedFile(event: { currentFiles: File[] }) {
    this.files.set(event.currentFiles);
  }
}
