import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '@src/app/shared/services/notification-service';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { type Image, ImageService } from '../../services/image-service';
import {
  type CreateProfile,
  type Profile,
  ProfileService,
} from '../../services/profile-service';

@Component({
  selector: 'admin-profile-page',
  imports: [
    CardModule,
    // TableModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    // DatePickerModule,
    TextareaModule,
    // SkeletonModule,
    FloatLabelModule,
    FormsModule,
    SelectModule,
    // ToggleSwitchModule,
    ConfirmDialogModule,
    // BadgeModule,
  ],
  templateUrl: './profile-page.html',
  providers: [ConfirmationService],
})
export class ProfilePage {
  private confirmationService = inject(ConfirmationService);
  private readonly notification = inject(NotificationService);

  formOpen = signal<boolean>(false);
  formBuilder = inject(FormBuilder);

  validForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    last_name: [''],
    email: [''],
    phone: [''],
    image: [''],
    description: [''],
  });

  private profileService = inject(ProfileService);
  private imageService = inject(ImageService);

  // Signal para las tecnologías con tipado correcto
  profile = signal<Profile>({} as Profile);
  profiles = signal<Profile[]>([]);
  images = signal<Image[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    await this.loadProfiles();
  }

  async loadProfiles() {
    this.isLoading.set(true);

    const techs = await this.profileService.getProfiles();

    this.profiles.set(techs);
    this.isLoading.set(false);
  }

  openForm() {
    this.validForm.reset();
    this.profile.set({} as Profile);
    this.loadImages();
    this.formOpen.set(true);
  }

  async loadImages() {
    this.isLoading.set(true);

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

      if (this.profile().id) {
        // actualizar perfil
        await this.profileService.updateProfile(
          this.profile().id,
          this.validForm.value as CreateProfile,
        );
      } else {
        // crear nueva perfil
        await this.profileService.createProfile(
          this.validForm.value as CreateProfile,
        );
      }

      this.formOpen.set(false);

      await this.loadProfiles();

      this.validForm.reset();
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleClickEdit(profile: Profile) {
    this.profile.set(profile);

    this.validForm.patchValue({
      name: profile.name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      image: profile.image,
      description: profile.description,
    });

    this.loadImages();

    this.formOpen.set(true);
  }

  handleClickDelete(event: Event, profile: Profile) {
    this.profile.set(profile);

    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Estas seguro de eliminar este perfil?',
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

  async deleteTechnology(profile: Profile) {
    this.isLoading.set(true);

    try {
      await this.profileService.deleteProfile(profile.id);

      this.confirmationService.close();

      await this.loadProfiles();

      this.profile.set({} as Profile);
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  acceptDelete() {
    this.deleteTechnology(this.profile());
  }

  rejectDelete() {
    this.confirmationService.close();
  }
}
