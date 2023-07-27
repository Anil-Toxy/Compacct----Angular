import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ExportExcelService } from '../../../shared/compacct.services/export-excel.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-related-report',
  templateUrl: './employee-related-report.component.html',
  styleUrls: ['./employee-related-report.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeRelatedReportComponent implements OnInit {
  tabIndexToView: number = 0;
  ReportName: any;
  replist: any = [];
  visibleDate: string = "";
  currentMonth: Date = new Date();
  From_Date: Date = new Date();
  To_Date: Date = new Date();
  findObj: any;
  initDate: any = [];
  reportFormSubmit: boolean = false;
  Spinner: boolean = false;
  seachSpinner:boolean = false;
  buttonname: string = 'Create';
  EmployeeList:any = [];
  Emp_ID: any;
  Atten_Type_ID: any;
  AttenTypelist:any = [];
  GridList:any = [];
  GridListHeader:any = [];
  employeedisabled:boolean = false;

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService,
    private ExportExcelService: ExportExcelService,
  ) { }

    ngOnInit() {
      this.Header.pushHeader({
        Header: "Employee Related Report",
        Link: "HR --> Employee Related Report"
      });
      this.getReportNames();
      this.EmployeeData();
      this.getAttendanceType();
    }
  
    getDateRange(dateRangeObj: any) {
      if (dateRangeObj.length) {
        this.From_Date = dateRangeObj[0];
        this.To_Date = dateRangeObj[1];
      }
    }
  
    getReportNames() {
      const obj = {
        "SP_String": "SP_HR_Reports",
        "Report_Name_String": "Get_Report_Names_emp",
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('report Names', data);
        this.replist = data;
      });
    }
  
    structureData(repname: any) {
      this.visibleDate = "";
      this.findObj = this.replist.find((ele: any) => ele.report_name == repname)
      console.log('selected report', this.findObj);
      if (this.findObj) {
        this.visibleDate = this.findObj.allowed_control;
        console.log('this.visibleDate===',this.visibleDate);
      }
    }
    EmployeeData(){
      this.EmployeeList = []
       const obj = {
         "SP_String":"SP_HR_Reports",
         "Report_Name_String": "Get_Employee_List",
         "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
       }
        this.GlobalAPI.getData(obj)
        .subscribe((data:any)=>{
          if(data.length){
            data.forEach((ele:any) => {
              ele['label'] = ele.Emp_Name,
              ele['value'] = ele.Emp_ID
            });
          this.EmployeeList = data;
         var empname = this.EmployeeList.filter(el=> Number(el.User_ID) === Number(this.$CompacctAPI.CompacctCookies.User_ID))
         console.log(empname)
         this.Emp_ID = empname.length ? empname[0].Emp_ID : undefined;
         this.employeedisabled = empname.length ? true : false;
         console.log("employee==",this.EmployeeList);
          } else {
            this.EmployeeList = [];
            this.Emp_ID = undefined;
          }
         });
    }
    getAttendanceType(){
      this.AttenTypelist = [];
      const obj = {
        "SP_String": "SP_HR_Reports",
        "Report_Name_String": "Get_Leave_Type_List"
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.AttenTypelist = data;
        //  console.log("AttenTypelist ===",this.AttenTypelist);
      })
    }
    GetGridData(){
      this.GridList = [];
      this.GridListHeader = [];
      this.seachSpinner = true;
      const start = this.From_Date
      ? this.DateService.dateConvert(new Date(this.From_Date))
      : this.DateService.dateConvert(new Date());
      const end = this.To_Date
      ? this.DateService.dateConvert(new Date(this.To_Date))
      : this.DateService.dateConvert(new Date());
      const senddata = {
        Emp_ID : this.Emp_ID ? this.Emp_ID : 0,
        Atten_Type_ID : this.Atten_Type_ID ? this.Atten_Type_ID : 0,
        StartDate : start,
        EndDate : end
      }
      const obj = {
        "SP_String": "SP_HR_Reports",
        "Report_Name_String": "Attn. Report",
        "Json_Param_String": JSON.stringify([senddata])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GridList = data;
        this.GridListHeader = data.length ? Object.keys(data[0]): []
        this.seachSpinner = false;
        //  console.log("GridList ===",this.GridList);
      })
    } 
  
    exportExcel(Arr,fileName): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
      const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      XLSX.writeFile(workbook, fileName+'.xlsx');
    }
  
    TabClick(e: any) {
    }
}
