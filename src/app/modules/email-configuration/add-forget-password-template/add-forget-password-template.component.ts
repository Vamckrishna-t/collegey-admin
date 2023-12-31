import { Component, OnInit, NgModule, Inject, EventEmitter } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { NzModalRef } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

// Load Services
import { EmailConfigurationService } from 'src/app/core/services/email-configuration/email-configuration.service';

enum Mode {
  Create = 'Create',
  Edit = 'Edit'
}

@Component({
  selector: 'app-add-forget-password-template',
  templateUrl: './add-forget-password-template.component.html',
  styleUrls: ['./add-forget-password-template.component.css']
})
export class AddForgetPasswordTemplateComponent implements OnInit {

  emailTemplateForm: FormGroup;
  mode: String;
  id: any;
  itemData: any; 
  pageContent : any;


  constructor(
    private fb: FormBuilder,
    private emailConfigurationService: EmailConfigurationService,
    private modal: NzModalRef,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.createForm();
    if (this.mode === Mode.Edit)
    {
      this.fetchUpdated();
    }
    else 
    {
      
    }
  }

  fetchUpdated() {
    this.patchForm(this.itemData);
  }

  patchForm(pageContent) {
    this.pageContent = pageContent;
    this.emailTemplateForm.patchValue({
      email_template_type: pageContent?.email_template_type,
      email_subject: pageContent?.email_subject,
      email_content: pageContent?.email_content,
      bottom_button_text: pageContent?.bottom_button_text,
    });
    this.markAllTouched();
  }

  createForm() {
    this.emailTemplateForm = this.fb.group(
      {
        email_template_type: ["forget_password_template", [Validators.required]],
        email_subject: ["", [Validators.required]],
        email_content: ["", [Validators.required]],
        bottom_button_text: ["", [Validators.required]],
      },
    );
    this.emailTemplateForm.valueChanges.subscribe(() => {
    });
  }

  save() {
    return new Promise<void>((resolve, reject) => {
      this.markAllTouched();
      if (this.emailTemplateForm.valid) {
        if (this.mode === Mode.Create) {
          let obj = this.emailTemplateForm.value;
          obj['insertaction'] = 'forget_password_template';
          this.emailConfigurationService.addForgetPasswordTemplate(obj).subscribe(
            (res) => {
              this.modal.destroy();
              resolve();
              Swal.fire({
                title: 'Successful',
                text: res.message,
                icon: 'success',
              });
            },
            (err) => {
              debugger;
              reject();
              Swal.fire( 
                'Add data faild',
                'error'
              );
            },
            () => {
              reject(); 
            }
          );

        } else {
          let obj = this.emailTemplateForm.value;
          obj['insertaction'] = 'forget_password_template';
          this.emailConfigurationService.updateForgetPasswordTemplate(obj,this.id).subscribe(
            (res) => {
              Swal.fire({
                title: 'Successful',
                text: 'Update data Succesfully',
                icon: 'success',
              });
              resolve();
            },
            (err) => {
              Swal.fire(
                'Failed to Update',
                'error'
              );
              reject();
            },
            () => {
              reject();
            }
          );
        }
      }
    });
  }

  cancel() {
    this.modal.destroy();
  }

  markAllTouched() {
    for (const i in this.emailTemplateForm.controls) {
      this.emailTemplateForm.controls[i].markAsDirty();
      this.emailTemplateForm.controls[i].updateValueAndValidity();
    }
  }

}
