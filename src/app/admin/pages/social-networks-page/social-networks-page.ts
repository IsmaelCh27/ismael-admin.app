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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { type Image, ImageService } from '../../services/image-service';
import {
  type CreateSocialNetwork,
  type SocialNetwork,
  SocialNetworkService,
} from '../../services/social-network-service';

@Component({
  selector: 'admin-social-networks-page',
  imports: [
    CardModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    SkeletonModule,
    FloatLabelModule,
    FormsModule,
    SelectModule,
    ToggleSwitchModule,
    ConfirmDialogModule,
    BadgeModule,
  ],
  templateUrl: './social-networks-page.html',
  providers: [ConfirmationService],
})
export class SocialNetworksPage {
  private confirmationService = inject(ConfirmationService);
  private readonly notification = inject(NotificationService);

  formOpen = signal<boolean>(false);
  formBuilder = inject(FormBuilder);

  validForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    logo: ['', [Validators.required]],
    link: ['', [Validators.required]],
    is_active: [false, [Validators.required]],
  });

  private socialNetworkService = inject(SocialNetworkService);
  private imageService = inject(ImageService);

  // Signal para las tecnologías con tipado correcto
  socialNetwork = signal<SocialNetwork>({} as SocialNetwork);
  socialNetworks = signal<SocialNetwork[]>([]);
  images = signal<Image[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    await this.loadSocialNetworks();
  }

  async loadSocialNetworks() {
    this.isLoading.set(true);

    const socialNet = await this.socialNetworkService.getSocialNetworks();

    this.socialNetworks.set(socialNet);
    this.isLoading.set(false);
  }

  openForm() {
    this.validForm.patchValue({
      is_active: true,
    });
    this.socialNetwork.set({} as SocialNetwork);
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

      if (this.socialNetwork().id) {
        // actualizar red social
        await this.socialNetworkService.updateSocialNetwork(
          this.socialNetwork().id,
          this.validForm.value as CreateSocialNetwork,
        );
      } else {
        // crear nueva red social
        await this.socialNetworkService.createSocialNetwork(
          this.validForm.value as CreateSocialNetwork,
        );
      }

      this.formOpen.set(false);

      await this.loadSocialNetworks();

      this.validForm.reset();
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleClickEdit(socialNetwork: SocialNetwork) {
    this.socialNetwork.set(socialNetwork);

    this.validForm.patchValue({
      name: socialNetwork.name,
      logo: socialNetwork.logo,
      link: socialNetwork.link,
      is_active: socialNetwork.is_active,
    });

    this.loadImages();

    this.formOpen.set(true);
  }

  handleClickDelete(event: Event, socialNetwork: SocialNetwork) {
    this.socialNetwork.set(socialNetwork);

    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Estas seguro de eliminar esta red social?',
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

  async deleteSocialNetwork(socialNetwork: SocialNetwork) {
    this.isLoading.set(true);

    try {
      await this.socialNetworkService.deleteSocialNetwork(socialNetwork.id);

      this.confirmationService.close();

      await this.loadSocialNetworks();

      this.socialNetwork.set({} as SocialNetwork);
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  acceptDelete() {
    this.deleteSocialNetwork(this.socialNetwork());
  }

  rejectDelete() {
    this.confirmationService.close();
  }
}
