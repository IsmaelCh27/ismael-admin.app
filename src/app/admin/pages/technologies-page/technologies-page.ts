import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '@src/app/shared/services/notification-service';
import { ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { type Image, ImageService } from '../../services/image-service';
import {
  type CreateTechnology,
  type Technology,
  TechnologyService,
} from '../../services/technology-service';

@Component({
  selector: 'admin-technologies-page',
  imports: [
    CardModule,
    TableModule,
    CommonModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    TextareaModule,
    SkeletonModule,
    FloatLabelModule,
    FormsModule,
    SelectModule,
    ToggleSwitchModule,
    ConfirmDialogModule,
    BadgeModule,
  ],
  templateUrl: './technologies-page.html',
  providers: [ConfirmationService],
})
export class TechnologiesPage {
  private confirmationService = inject(ConfirmationService);
  private readonly notification = inject(NotificationService);

  // selectedCountry: string | undefined;

  formOpen = signal<boolean>(false);
  formBuilder = inject(FormBuilder);

  validForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    documentation_link: ['', [Validators.required]],
    icon_link: ['', [Validators.required]],
    is_skill: [false, [Validators.required]],
  });

  private technologyService = inject(TechnologyService);
  private imageService = inject(ImageService);

  // Signal para las tecnologías con tipado correcto
  technology = signal<Technology>({} as Technology);
  technologies = signal<Technology[]>([]);
  images = signal<Image[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    await this.loadTechnologies();
  }

  async loadTechnologies() {
    this.isLoading.set(true);
    this.error.set(null);

    const techs = await this.technologyService.getTechnologies();

    this.technologies.set(techs);
    this.isLoading.set(false);
  }

  openForm() {
    this.validForm.patchValue({
      is_skill: false,
    });
    this.technology.set({} as Technology);
    this.loadImages();
    this.formOpen.set(true);
  }

  async loadImages() {
    this.isLoading.set(true);
    this.error.set(null);

    const imgs = await this.imageService.getImages();

    this.images.set(imgs.filter((img) => img.is_logo));
    this.isLoading.set(false);
  }

  closeForm() {
    this.validForm.reset();
    this.formOpen.set(false);
  }

  async onSubmit() {
    this.isLoading.set(true);

    try {
      if (this.validForm.invalid) {
        this.validForm.markAllAsTouched();
        return;
      }

      if (this.technology().id) {
        // actualizar tecnología
        await this.technologyService.updateTechnology(
          this.technology().id,
          this.validForm.value as CreateTechnology,
        );
      } else {
        // crear nueva tecnología
        await this.technologyService.createTechnology(
          this.validForm.value as CreateTechnology,
        );
      }

      this.formOpen.set(false);

      await this.loadTechnologies();

      this.validForm.reset();
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleClickEdit(technology: Technology) {
    this.technology.set(technology);

    this.validForm.patchValue({
      name: technology.name,
      documentation_link: technology.documentation_link,
      icon_link: technology.icon_link,
      is_skill: technology.is_skill,
    });
    this.formOpen.set(true);
  }

  handleClickDelete(event: Event, technology: Technology) {
    this.technology.set(technology);

    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Estas seguro de liminar esta tecnología?',
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

  async deleteTechnology(technology: Technology) {
    this.isLoading.set(true);

    try {
      await this.technologyService.deleteTechnology(technology.id);

      this.confirmationService.close();

      await this.loadTechnologies();

      this.technology.set({} as Technology);
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  acceptDelete() {
    this.deleteTechnology(this.technology());
  }

  rejectDelete() {
    this.confirmationService.close();
  }
}
