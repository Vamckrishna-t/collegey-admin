import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { fromEvent, Observable } from 'rxjs';
import referralCodeGenerator from 'referral-code-generator'
import { Papa } from 'ngx-papaparse';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AppConstants } from 'src/app/shared/constants/app.constants';

// Load Services
import { PageContentService } from 'src/app/core/services/home-service/page-content.service';

// Componets
import Swal from 'sweetalert2';
import { AddHomeFooterDataComponent } from '../add-home-footer-data/add-home-footer-data.component';

enum Mode {
  Create = 'Create',
  Edit = 'Edit'
}

@Component({
  selector: 'app-view-home-footer-data',
  templateUrl: './view-home-footer-data.component.html',
  styleUrls: ['./view-home-footer-data.component.css']
})
export class ViewHomeFooterDataComponent implements OnInit {

  modal: NzModalRef;
  Mode = Mode;
  isLoading = false;
  assignData = [];

  msg_success: boolean = false;
  msg_danger: boolean = false;
  throw_msg:any;
  
  show_loader: boolean = false;

  constructor(
    private pageContentService: PageContentService,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
    private papa : Papa,
    private snackbar: MatSnackBar,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.getHomeFirstSecData(params);
    });
  }

  getHomeFirstSecData(filters) {
    this.isLoading   = true;
    this.show_loader = true;
    this.pageContentService.getHomeFirstSecData(filters).subscribe( response =>{
      this.show_loader = false;
      this.isLoading   = false;
      this.assignData  = response?.data?.docs[0]?.home_footer_section;
      this.ref.detectChanges();
      if(response?.data?.totalDocs - (+filters.limit) < -11) {
        this._showSnackbar("No more data found")
      }
    }, error => {
      this.isLoading = false;
    });
  }

  _showSnackbar(message) {
    this.snackbar.open(message, null, { duration: AppConstants.TOAST_DISPLAY_TIME })
  }

  contains(a: string, b: string) {
    return a.toLowerCase().indexOf(b.toLowerCase()) >= 0;
  }

  openModal(mode: Mode, id = null, item = null) {
    this.modal = this.modalService.create({
      nzTitle: mode === "Create" ? "Create New" : "Update Data",
      nzContent: AddHomeFooterDataComponent,
      nzFooter: [
        {
          label: mode === "Create" ? "Create" : "Update",
          show: item ? (item.isDeleted ? false : true) : true,
          type: "primary",
          onClick: (componentInstance) => {
            componentInstance!.save().then(() => {
              componentInstance!.cancel();
              this.activatedRoute.queryParams.subscribe(params => {
                this.getHomeFirstSecData(params);
              });
            });
          },
        },
        {
          label: "Cancel",
          show: item ? (item.isDeleted ? false : true) : true,
          type: "default",
          onClick: (componentInstance) => {
            componentInstance!.cancel();
          },
        },
        {
          label: "close",
          show: item ? (item.isDeleted ? true : false) : false,
          type: "default",
          onClick: (componentInstance) => {
            componentInstance!.cancel();
          },
        },
      ],
      nzMaskClosable: false,
      nzWidth:900,
      nzComponentParams: {
        mode: mode,
        id: id,
        itemData: item
      },
    });
  }

  deleteHome(index: any) {
    if (confirm("Are you sure to delete this item")) {
      var deletelist = { index: index, filedName: "home_footer_sec_data" };
      this.pageContentService.deleteHomeContents(deletelist).subscribe(
        (response) => {
          if (response.status == 'success') {
            this.activatedRoute.queryParams.subscribe(params => {
              this.getHomeFirstSecData(params);
            });
          }
        },
      );
    }
  }

}
