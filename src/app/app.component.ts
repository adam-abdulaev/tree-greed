import {Component, ViewChild} from '@angular/core';
import {DropDownListComponent} from '@syncfusion/ej2-angular-dropdowns';
import {
  EditSettingsModel,
  FilterService,
  GridComponent,
  VirtualScrollService
} from '@syncfusion/ej2-angular-grids';
import {getData} from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
  public contextMenuItems: Object;

  public ngOnInit(): void {
    this.data = getData(1000);
    this.editing = {allowEditOnDblClick: false};
    this.contextMenuItems = [
      {text: 'Style', target: '.e-headercontent', id: 'collapseall'},
      {text: 'Freeze On/Off', target: '.e-headercontent', id: 'frozen'},
      {text: 'Filter On/Off', target: '.e-headercontent', id: 'filter'},
      {text: 'Multi-Sort On/Off', target: '.e-headercontent', id: 'sort'},
      {text: 'Add/Del/Edit', target: '.e-headercontent', id: 'editor'},
      {text: 'Multi-Select On/Off', target: '.e-content', items: [{text: 'On', id: 'multiSelect'}, {text: 'Off', id: 'singleSelect'}]},
      {
        text: 'Add/Del/Edit',
        target: '.e-content',
        id: 'rowEditor',
        items: [
          {text: 'Add', id: 'addRow'},
          {text: 'Edit', id: 'editRow'},
          {text: 'Delete', id: 'deleteRow'}
        ]
      },
    ];
    this.filterSettings = {type: 'Menu'};
    this.filter = {type: 'CheckBox'};
    this.stTime = performance.now();
  }

  ngAfterViewInit(args): void {
    this.gridInstance.on('data-ready', function() {
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
      case 'filter':
        this.gridInstance.getColumnByField(args.column.field).allowFiltering = !this.gridInstance.getColumnByField(args.column.field).allowFiltering;
        break;
      case 'frozen':
        this.gridInstance.getColumnByField(args.column.field).isFrozen = !this.gridInstance.getColumnByField(args.column.field).isFrozen;
        break;
      case 'sort':
        this.gridInstance.getColumnByField(args.column.field).allowSorting = !this.gridInstance.getColumnByField(args.column.field).allowSorting;
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
        break;
      case 'multiSelect':
        this.gridInstance.selectionSettings = {type: 'Multiple'};
        break;
      case 'singleSelect':
        this.gridInstance.selectionSettings = {type: 'Single'};
        break;
      case 'editRow':
        this.gridInstance.editSettings = {allowEditing: true, mode: 'Normal'};
      case 'addRow':
        this.gridInstance.editSettings = {allowAdding: true, mode: 'Normal'};
        break;
      case 'deleteRow':
        this.gridInstance.editSettings = {allowDeleting: true, mode: 'Normal'};
        break;
    }
    this.gridInstance.clearSelection();
    this.gridInstance.refreshColumns();
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
    clearTimeout(this.clrIntervalFun);
    clearInterval(this.intervalFun);
    this.dtTime = true;
  }
}
