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
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { type Image, ImageService } from '../../services/image-service';
import {
  type CreateProject,
  type Project,
  ProjectService,
} from '../../services/project-service';
import {
  type Technology,
  TechnologyService,
} from '../../services/technology-service';

@Component({
  selector: 'admin-projects-page',
  imports: [
    CardModule,
    TableModule,
    CommonModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SkeletonModule,
    FloatLabelModule,
    FormsModule,
    SelectModule,
    MultiSelectModule,
    ConfirmDialogModule,
  ],
  templateUrl: './projects-page.html',
  providers: [ConfirmationService],
})
export class ProjectsPage {
  private confirmationService = inject(ConfirmationService);
  private readonly notification = inject(NotificationService);

  formBuilder = inject(FormBuilder);
  formOpen = signal<boolean>(false);

  validForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    demo_link: [''],
    image_link: ['', [Validators.required]],
    repository_link: [''],
    technologies_ids: [[] as number[]],
  });

  private projectService = inject(ProjectService);
  private technologyService = inject(TechnologyService);
  private imageService = inject(ImageService);

  project = signal<Project>({} as Project);
  projects = signal<Project[]>([]);
  technologies = signal<Technology[]>([]);
  images = signal<Image[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    await this.loadProjects();
    await this.loadTechnologies();
  }

  async loadProjects() {
    this.isLoading.set(true);

    const data = await this.projectService.getProjects();
    this.projects.set(data);

    this.isLoading.set(false);
  }

  async loadTechnologies() {
    const data = await this.technologyService.getTechnologies();
    this.technologies.set(data);
  }

  async loadImages() {
    const data = await this.imageService.getImages();
    // Filtrar imágenes que NO son logos si se desea, o mostrar todas.
    // En SocialNetworks filtraban por is_logo, aquí quizás queramos lo contrario o todas.
    // Asumiré todas por ahora o las que no son logos si es para proyectos.
    this.images.set(data);
  }

  openForm() {
    this.validForm.reset();
    this.project.set({} as Project);
    this.loadImages();
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
      const projectData: CreateProject = {
        name: formValue.name ?? '',
        description: formValue.description ?? '',
        demo_link: formValue.demo_link,
        image_link: formValue.image_link ?? '',
        repository_link: formValue.repository_link,
        technologies_ids: formValue.technologies_ids ?? [],
      };

      if (this.project().id) {
        await this.projectService.updateProject(this.project().id, projectData);
      } else {
        await this.projectService.createProject(projectData);
      }

      this.formOpen.set(false);
      await this.loadProjects();
      this.validForm.reset();
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleClickEdit(project: Project) {
    this.project.set(project);
    this.loadImages();

    this.validForm.patchValue({
      name: project.name,
      description: project.description,
      demo_link: project.demo_link,
      image_link: project.image_link,
      repository_link: project.repository_link,
      technologies_ids: project.technologies.map((t) => t.id),
    });
    this.formOpen.set(true);
  }

  handleClickDelete(event: Event, project: Project) {
    this.project.set(project);

    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: '¿Estás seguro de eliminar este proyecto?',
      icon: 'pi pi-trash',
      rejectLabel: 'No',
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true,
      },
      acceptLabel: 'Sí',
      acceptButtonProps: {
        severity: 'danger',
      },
      accept: () => {
        this.acceptDelete();
      },
    });
  }

  async acceptDelete() {
    this.isLoading.set(true);
    try {
      if (this.project().id) {
        await this.projectService.deleteProject(this.project().id);
        await this.loadProjects();
      }
    } catch (error) {
      this.notification.error('Error', error as string);
    } finally {
      this.isLoading.set(false);
      this.confirmationService.close();
    }
  }

  rejectDelete() {
    this.confirmationService.close();
  }
}
