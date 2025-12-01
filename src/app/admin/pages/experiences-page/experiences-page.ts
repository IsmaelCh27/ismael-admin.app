import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '@src/app/shared/services/notification-service';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import {
  type CreateExperience,
  type Experience,
  ExperienceService,
} from '../../services/experience-service';

@Component({
  selector: 'admin-experiences-page',
  imports: [
    CardModule,
    TableModule,
    CommonModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    FloatLabel,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    TextareaModule,

    SkeletonModule,
    ConfirmDialogModule,
  ],
  templateUrl: './experiences-page.html',
  providers: [ConfirmationService],
})
export class ExperiencesPage {
  private confirmationService = inject(ConfirmationService);
  private readonly notification = inject(NotificationService);

  formBuilder = inject(FormBuilder);
  formOpen = signal<boolean>(false);

  validForm = this.formBuilder.group({
    company: ['', [Validators.required]],
    position: ['', [Validators.required]],
    start_date: [null as Date | null, [Validators.required]],
    end_date: [null as Date | null],
    description: ['', [Validators.required]],
  });

  private experienceService = inject(ExperienceService);

  experience = signal<Experience>({} as Experience);
  experiences = signal<Experience[]>([]);

  isLoading = signal(true);

  async ngOnInit() {
    await this.loadExperiences();
  }

  async loadExperiences() {
    this.isLoading.set(true);

    const experienceData = await this.experienceService.getExperiences();

    this.experiences.set(experienceData);
    this.isLoading.set(false);
  }

  openForm() {
    this.validForm.reset();
    this.experience.set({} as Experience);
    this.formOpen.set(true);
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

      const formValue = this.validForm.value;
      const experienceData: CreateExperience = {
        company: formValue.company ?? '',
        position: formValue.position ?? '',
        start_date: formValue.start_date
          ? (formValue.start_date as Date).toISOString()
          : '',
        end_date: formValue.end_date
          ? (formValue.end_date as Date).toISOString()
          : null,
        description: formValue.description,
      };

      if (this.experience().id) {
        // actualizar experiencia
        await this.experienceService.updateExperience(
          this.experience().id,
          experienceData,
        );
      } else {
        // crear nueva experiencia
        await this.experienceService.createExperience(experienceData);
      }

      this.formOpen.set(false);

      await this.loadExperiences();

      this.validForm.reset();
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleClickEdit(experience: Experience) {
    this.experience.set(experience);

    this.validForm.patchValue({
      company: experience.company,
      position: experience.position,
      start_date: this.parseDate(experience.start_date),
      end_date: this.parseDate(experience.end_date),
      description: experience.description,
    });
    this.formOpen.set(true);
  }

  handleClickDelete(event: Event, experience: Experience) {
    this.experience.set(experience);

    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: `Estas seguro de eliminar esta experiencia en (${experience.company})?`,
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

  async deleteTechnology(experience: Experience) {
    this.isLoading.set(true);

    try {
      await this.experienceService.deleteExperiencie(experience.id);

      this.confirmationService.close();

      await this.loadExperiences();

      this.experience.set({} as Experience);
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  acceptDelete() {
    this.deleteTechnology(this.experience());
  }

  rejectDelete() {
    this.confirmationService.close();
  }

  parseDate(dateStr: string | Date | null) {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;
    // Agregar T00:00:00 para asegurar que se interprete como local y no UTC
    if (typeof dateStr === 'string' && dateStr.length === 10) {
      return new Date(`${dateStr}T00:00:00`);
    }
    return new Date(dateStr);
  }
}
