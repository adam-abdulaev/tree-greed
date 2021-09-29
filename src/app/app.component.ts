import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {DropDownListComponent} from '@syncfusion/ej2-angular-dropdowns';
import {
  EditSettingsModel,
  FilterService,
  GridComponent,
  VirtualScrollService
} from '@syncfusion/ej2-angular-grids';
import {getData} from './data';
import {addClass, removeClass} from "@syncfusion/ej2-base";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FilterService, VirtualScrollService]
})
export class AppComponent {
  public dReady = false;
  public dtTime = false;
  public isDataBound = false;
  public isDataChanged = true;
  public intervalFun: any;
  public clrIntervalFun: any;
  public clrIntervalFun2: any;
  public dropSlectedIndex: number = null;
  public stTime: any;
  public data: Object;
  public filter: Object;
  public filterSettings: Object;
  public editing: EditSettingsModel;
  public height = '240px';
  public flag = false;
  @ViewChild('sample')
  public listObj: DropDownListComponent;
  @ViewChild('overviewgrid')
  public gridInstance: GridComponent;
  public ddlData: Object[] = [
    {text: '1,000 Rows and 11 Columns', value: '1000'},
    {text: '10,000 Rows and 11 Columns', value: '10000'},
    {text: '1,00,000 Rows and 11 Columns', value: '100000'}
  ];
  public fields: Object = {text: 'text', value: 'value'};
  public item: number[] = [1, 2, 3, 4, 5];
  public contextMenuItems: any[];
  private initialRender = false;
  private gridProperties: any;

  public ngOnInit(): void {
    this.data = getData(1000);
    this.editing = {allowEditOnDblClick: false, allowEditing: true, allowDeleting: true, allowAdding: true};
    this.contextMenuItems = [
      {text: 'Show Columns', target: '.e-headercontent', id: 'showColumns'},
      {text: 'Freeze On', target: '.e-headercontent', id: 'frozen'},
      {text: 'Filter On', target: '.e-headercontent', id: 'filter'},
      {text: 'Multi-Sort On', target: '.e-headercontent', id: 'multiSort'},
      {text: 'Add/Del/Edit', target: '.e-headercontent', id: 'editor'},
      {
        text: 'Multi-Select On/Off',
        target: '.e-content',
        items: [{text: 'On', id: 'multiSelect'}, {text: 'Off', id: 'singleSelect'}]
      },
      {
        text: 'Add/Del/Edit',
        target: '.e-content',
        items: [
          {text: 'Add', id: 'addRow'},
          {text: 'Edit', id: 'editRow'},
          {text: 'Delete', id: 'deleteRow'}
        ]
      },
      {text: 'Drag and Drop On', target: '.e-content', id: 'dragAndDrop'},
      {text: 'Copy', target: '.e-content', id: 'copy'},
    ];
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    ;
    this.filter = {type: 'CheckBox'};
    this.stTime = performance.now();
  }

  ngAfterViewInit(args): void {
    this.gridInstance.on('data-ready', function () {
      this.dReady = true;
    });

    document.getElementById('overviewgrid').addEventListener('DOMSubtreeModified', () => {
      if (this.stTime && this.isDataChanged) {
        const msgEle = document.getElementById('msg');
        const val: any = (performance.now() - this.stTime).toFixed(0);
        this.stTime = null;
        this.dtTime = false;
        this.isDataChanged = false;
        msgEle.innerHTML = 'Load Time: ' + '<b>' + val + '</b>' + '<b>ms</b>';
        msgEle.classList.remove('e-hide');
      }
    });
  }

  contextMenuClick(args?): void {
    switch (args.item.id) {
      case 'showColumns':
        console.log(this.gridInstance.columns)
        // this.gridInstance.showColumns(this.gridInstance.columns);
        break;
      case 'filter':
        if (args.item.properties.text === 'Filter On') {
          const newItem = {...this.contextMenuItems[2], text: 'Filter Off'};
          this.changeContextMenuItemText(newItem)
        } else {
          const newItem = {...this.contextMenuItems[2], text: 'Filter On'};
          this.changeContextMenuItemText(newItem)
        }
        this.gridInstance.allowFiltering = !this.gridInstance.allowFiltering;
        this.gridInstance.refreshColumns();
        break;
      case 'frozen':
        if (args.item.properties.text === 'Freeze On') {
          const newItem = {...this.contextMenuItems[1], text: 'Freeze Off'};
          this.changeContextMenuItemText(newItem)
          this.gridInstance.frozenColumns = this.gridInstance.getColumnByField(args.column.field).index + 1;
        } else {
          const newItem = {...this.contextMenuItems[1], text: 'Freeze On'};
          this.changeContextMenuItemText(newItem)
          this.gridInstance.frozenColumns = 0;
        }
        break;
      case 'multiSort':
        if (args.item.properties.text === 'Multi-Sort On') {
          const newItem = {...this.contextMenuItems[3], text: 'Multi-Sort Off'};
          this.changeContextMenuItemText(newItem)
        } else {
          const newItem = {...this.contextMenuItems[3], text: 'Multi-Sort On'};
          this.changeContextMenuItemText(newItem)
        }
        this.gridInstance.allowMultiSorting = !this.gridInstance.allowMultiSorting;
        this.gridInstance.clearSorting();
        break;
      case 'editor':
        this.gridInstance.allowResizing = !this.gridInstance.allowResizing;
        if (this.gridInstance.allowResizing) {
          this.gridInstance.columns.forEach(column => {
            if (column.field !== args.column.field) {
              column.allowResizing = false;
            }
          });
        }
        this.gridInstance.refreshColumns();
        break;
      case 'multiSelect':
        this.gridInstance.selectionSettings = {type: 'Multiple'};
        break;
      case 'singleSelect':
        this.gridInstance.selectionSettings = {type: 'Single'};
        break;
      case 'editRow':
        this.gridInstance.startEdit();
        break;
      case 'addRow':
        this.gridInstance.addRecord();
        break;
      case 'deleteRow':
        this.gridInstance.deleteRecord();
        break;
      case 'dragAndDrop':
        if (args.item.properties.text === 'Drag and Drop On') {
          const newItem = {...this.contextMenuItems[7], text: 'Drag and Drop Off'};
          this.changeContextMenuItemText(newItem)
        } else {
          const newItem = {...this.contextMenuItems[7], text: 'Drag and Drop On'};
          this.changeContextMenuItemText(newItem)
        }
        this.gridInstance.allowRowDragAndDrop = !this.gridInstance.allowRowDragAndDrop ;
        break;
      case 'copy':
        this.gridInstance.copy();

    }
  }

  valueChange(args): void {
    this.listObj.hidePopup();
    this.gridInstance.showSpinner();
    this.dropSlectedIndex = null;
    const index: number = this.listObj.value as number;
    clearTimeout(this.clrIntervalFun2);
    this.clrIntervalFun2 = setTimeout(() => {
      this.isDataChanged = true;
      this.stTime = null;
      const contentElement: Element = this.gridInstance.contentModule.getPanel().firstChild as Element;
      contentElement.scrollLeft = 0;
      contentElement.scrollTop = 0;
      this.gridInstance.pageSettings.currentPage = 1;
      this.stTime = performance.now();
      this.gridInstance.dataSource = getData(index);
      this.gridInstance.hideSpinner();
    }, 100);
  }

  onDataBound(args: any): void {
    this.flag = true;
    clearTimeout(this.clrIntervalFun);
    clearInterval(this.intervalFun);
    this.dtTime = true;
    // if(this.initialRender){
    //   this.gridProperties = JSON.parse(this.gridInstance.getPersistData());
    //   this.initialRender = false;
    // }
  }

  changeContextMenuItemText(newItem) {
    // @ts-ignore
    this.gridInstance.contextMenuItems = this.gridInstance.contextMenuItems.map(item => {
      if (item.id === newItem.id) {
        return newItem;
      }
      return item;
    });
  }


  public onClicked(e): void {
    if (!this.flag) { return; }

    let element: HTMLElement = <HTMLInputElement>e.target;

    if (element.textContent === 'Show All') {
      document.querySelectorAll('.e-tbar-btn-text').forEach(element => element.classList.remove('e-ghidden'));
      this.gridInstance.columns.forEach(item => this.gridInstance.showColumns(item.headerText))
      return;
    }

    if (!element.classList.contains('e-tbar-btn-text') && !element.classList.contains('e-tbar-btn')) {
      return;
    }

    element = <HTMLElement>(element.tagName === 'BUTTON' ? element.firstElementChild : element);
    this.flag = false;
    let hidden: boolean = element.classList.contains('e-ghidden');
    let classFn: Function = hidden ? removeClass : addClass;
    classFn([element], 'e-ghidden');

    if (hidden) {
      this.gridInstance.showColumns(element.innerHTML);
    } else {
      this.gridInstance.hideColumns(element.innerHTML);
    }
    this.flag = true;
  }
}
