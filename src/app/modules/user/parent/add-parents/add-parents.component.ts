import { Component, OnInit, NgModule, Inject, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageSource } from 'src/app/core/enums/image-upload-source.enum';
import { PipeModule } from 'src/app/shared/pipe.module';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
import { resolve } from 'dns';
import { NzModalRef } from 'ng-zorro-antd';
import { Mentor } from 'src/app/core/models/mentor';
import { ParentsService } from 'src/app/core/services/parents.service';
enum Mode {
  Create = 'Create',
  Edit = 'Edit'
}
@Component({
  selector: 'app-add-parents',
  templateUrl: './add-parents.component.html',
  styleUrls: ['./add-parents.component.css']
})
export class AddParentsComponent implements OnInit {

  isLoading = false;
  mode: String;
  id: any;
  blogFormGroup: FormGroup;
  mentor: Mentor;
  documentList = [];
  authorImageList = [];
  imageSource = ImageSource;
  public ClassicEditorBuild = ClassicEditorBuild;
  public editor: CKEditor5.Editor = null;
  public readyEmitter = new EventEmitter<CKEditor5.Editor>();
  editorConfig : CKEditor5.Config = function( config ) {
	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		'/',
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
	];
};
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddParentsComponent>,
    private parentService: ParentsService,
    private commonService: CommonService,
    private modal: NzModalRef,
  ) {
  }

  initBlogForm() {
    this.blogFormGroup = this.fb.group({
      name: [this.mentor ? this.mentor.name : null, [Validators.required]],
      qualification: [this.mentor ? this.mentor.qualification : null, [Validators.required]],
      email: [this.mentor ? this.mentor.email : null, [Validators.required]],
      password: [this.mentor ? this.mentor.password : null, [Validators.required]],
      phone_number: [this.mentor ? this.mentor.phone_number : null, [Validators.required]],
       status: [this.mentor ? (this.mentor.status = this.mentor.status === 1 ? true : false) : null],
    });
  }

  public onReady( editor: CKEditor5.Editor ) {
    this.editor = editor;
    this.readyEmitter.emit( this.editor );
  }

  addTagFn(name) {
    return { name };
  }

  onFileUpload(list) {
    if(list.length > 0) {
      this.blogFormGroup.patchValue({
        image: list[0],
      });
    } else {
      this.blogFormGroup.patchValue({
        image: null,
      });
    }
  }

  onAuthorImageUpload(list) {
    if(list.length > 0) {
      this.blogFormGroup.patchValue({
        author_image: list[0],
      });
    } else {
      this.blogFormGroup.patchValue({
        author_image: null,
      });
    }
    
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmitForm() {
    return new Promise<void>((resolve, reject) => {
      this.blogFormGroup.markAllAsTouched();
      if (this.blogFormGroup.invalid) {
        return;
      }
      const formData = this.blogFormGroup.getRawValue();
      formData["type"] = "parents";
      formData["phone_number"] = [];
      if (formData.status) {
        formData.status = 1;
      } else {
        formData.status = 2;
      }
      this.isLoading = true;
      return !this.mentor ? this.addBlog(formData).then((response)=>{
        resolve()
      }).catch((e)=>{
        reject();
      }) : this.updateBlog(formData).then((response)=>{
        resolve()
      }).catch((e)=>{
        reject()
      });
    })
    
  }

  addBlog(formObj):any {
    return new Promise((resolve, reject) => {
      this.parentService.saveParents(formObj).subscribe(
        (response) => {
          console.log("CREATE MENTOR",response);
          this.isLoading = false;
          Swal.fire({
            title: 'Successful',
            text: 'Parent created succesfully',
            icon: 'success',
          });
          // this.dialogRef.close(response);
          resolve(response)
        },
        (error) => {
          this.isLoading = false;
          Swal.fire(
            'Failed to create parent',
            error.message || error.error,
            'error'
          );
         reject(error)
        }
      );
    })
    
  }

  updateBlog(obj):any {
    return new Promise((resolve, reject) => {
      this.parentService.updateParents(obj, this.mentor._id).subscribe(
        (response) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Successful',
            text: 'Parent updated succesfully',
            icon: 'success',
          }).then(() => {
             resolve(response);
          });
        },
        (error) => {
          this.isLoading = false;
          Swal.fire(
            'Failed to update parent',
            error.message || error.error,
            'error'
          );
          reject(error)
        }
      );
    })
    
  }

  cancel() {
    this.modal.destroy();
  }

  ngOnInit(): void {
    this.initBlogForm();
 
  }
}

@NgModule({
  declarations: [AddParentsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    PipeModule,
  ],
})
class AddParentsModule {}