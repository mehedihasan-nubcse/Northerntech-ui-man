import {Component, inject, OnInit} from '@angular/core';
import {Clipboard} from "@angular/cdk/clipboard";
import {UiService} from "../../../services/core/ui.service";
import {Branch_list, PAYMENT_TYPES1} from "../../../core/utils/app-data";
@Component({
  selector: 'app-all-branch',
  templateUrl: './all-branch.component.html',
  styleUrls: ['./all-branch.component.scss']
})
export class AllBranchComponent implements OnInit {

  branch = Branch_list;

  protected readonly clipboard = inject(Clipboard);
  protected readonly uiService = inject(UiService);
  ngOnInit(): void {
  }

  copyLink(url: string) {
    this.clipboard.copy(url);
    this.uiService.success('Url copied to clipboard');
  }

}
