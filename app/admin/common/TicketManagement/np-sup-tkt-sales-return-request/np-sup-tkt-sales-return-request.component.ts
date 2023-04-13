import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute } from '@angular/router';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map, catchError } from 'rxjs/operators';
import { param } from 'jquery';

@Component({
  selector: 'app-np-sup-tkt-sales-return-request',
  templateUrl: './np-sup-tkt-sales-return-request.component.html',
  styleUrls: ['./np-sup-tkt-sales-return-request.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NPSupTktSalesReturnRequestComponent implements OnInit {
  items:any = []
  tabIndexToView: number = 0;
  buttonname = "Save";
  ExecutiveList:any = []
  customarList:any = []
  ProductList:any = []
  ReasonReturnList:any = []
  ConditionOfGoodsList:any = []
  TypeReturnList:any = []
  objsaleReturn:saleReturn = new saleReturn()
  ObjaddSaleReturn:addSaleReturn = new addSaleReturn
  salereturnFormsSubmitted:boolean = false
  addSalereturnFormsSubmitted:boolean = false
  DocDate: any = {};
  dropdownIcon:string = "pi pi-chevron-down"
  SalereturnList:any = []
  Spinner:boolean = false
  SearchedBrowselist:any = []
  SearchedBrowselistHeader:any = []
  viewModal:boolean = false
  viewList:any = []
  TicketNo:any = ""
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService: DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE RETURN REQUEST"];
    this.Header.pushHeader({
      Header: "Sales Return Request",
      Link: "Ticket Management -> Sales Return Request"
    });
    this.GetSalesExecutiveList()
    this.GetCustomarList()
    this.getReasonOfReturnList()
    this.GetConditionOfGoodsList()
    this.GetTypeReturnList()
    this.getSearchedBrowselist()
  }
  TabClick(e:any){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE RETURN REQUEST"];
    this.buttonname = "Save";
    this.clearData()
  }
  clearData(){
    this.buttonname = "Save";
    this.salereturnFormsSubmitted = false
    this.objsaleReturn = new saleReturn()
    this.ProductList = []
    this.ObjaddSaleReturn = new addSaleReturn()
    this.addSalereturnFormsSubmitted = false
    this.SalereturnList = []
    this.Spinner = false
    this.TicketNo
    this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
   
  }
  onReject() {
    this.compacctToast.clear("c");
    this.ngxService.stop();
  }
  onConfirm(){

  }
  addSalereturnList(validMain:any,validAdd:any){
    this.addSalereturnFormsSubmitted = true
    this.salereturnFormsSubmitted = true
   if(validMain && validAdd){
     this.objsaleReturn.Ticket_No = 'A'
      this.objsaleReturn.Request_Date = this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DocDate))
      this.objsaleReturn.Posted_By = this.$CompacctAPI.CompacctCookies.User_ID
      const FilterProductList = this.ProductList.filter((el:any)=> Number(el.Product_ID) == Number(this.ObjaddSaleReturn.Product_ID))
      this.ObjaddSaleReturn.Product_Description = FilterProductList.length ? FilterProductList[0].Product_Description : ""
      this.ObjaddSaleReturn.Qty = Number(this.ObjaddSaleReturn.Qty)
      let tempAddData:any = {
        ...this.objsaleReturn,
        ...this.ObjaddSaleReturn
    };
    this.SalereturnList.push(tempAddData)
    this.ObjaddSaleReturn = new addSaleReturn()
    this.addSalereturnFormsSubmitted = false
    this.salereturnFormsSubmitted = false
    console.log("SalereturnList",this.SalereturnList)
    }
  }
  GetCustomarList(){
  this.customarList = []
  this.$http.get<any>("Common/Get_Subledger_DR_for_Nepal_with_User_ID",{params:{user_id: this.$CompacctAPI.CompacctCookies.User_ID }})
   .pipe(map((data:any) => data ? JSON.parse(data) : []))
   .subscribe((data:any)=>{
    if(data.length){
      data.forEach((xyz:any) => {
        xyz['label'] = xyz.Sub_Ledger_Name;
        xyz['value'] = xyz.Sub_Ledger_ID;
      });
      this.customarList = data
    }
     
   },
   (err:any)=>console.log(err)
   )
  }
  GetSalesExecutiveList(){
    this.ExecutiveList = []
    this.$http.get<any>("BL_CRM_Master_SalesTeam/Get_Sales_Man_for_napal")
   .subscribe((data:any)=>{
    if(data.length){
        data.forEach((xyz:any) => {
          xyz['label'] = xyz.Member_Name;
          xyz['value'] = xyz.Member_ID;
        });
        this.ExecutiveList = data
      }
    },(err:any)=> console.log(err))
  }
  getProduct(SubLedgerID:any){
    this.ProductList = []
    this.ObjaddSaleReturn = new addSaleReturn()
    this.addSalereturnFormsSubmitted = false
    this.dropdownIcon = "pi pi-spin pi-spinner"
    this.$http.get<any>("CRM_Processing_Order/Get_Product_Details_with_Sub_Ledger_ID?=185163",{params:{Sub_Ledger_ID: SubLedgerID }})
    .pipe(map((data:any)=> data ? JSON.parse(data) : []))
    .subscribe((data:any)=>{
      this.ProductList = [...data]
      this.ProductList.forEach((ele:any) => {
        ele['label'] = ele.Product_Description,
        ele['value'] = ele.Product_ID
      });
      this.dropdownIcon = "pi pi-chevron-down"
    },(error:any)=>{
      console.log(error)
      this.dropdownIcon = "pi pi-chevron-down"
    })
  }
  getProductDetalis(ProductID:any){
    const FindProductRow = this.ProductList.filter((el:any)=> Number(el.Product_ID) == Number(ProductID))
    if(FindProductRow.length){
      this.ObjaddSaleReturn.UOM = FindProductRow[0].UOM
      this.ObjaddSaleReturn.Rate = FindProductRow[0].Master_Rate
    }
    this.calculatAmount()
  }
  calculatAmount(){
    if(this.ObjaddSaleReturn.Product_ID){
      let convert = (v) =>{
        return v? v : 0
      }
      this.ObjaddSaleReturn.Amount = ((Number(convert(this.ObjaddSaleReturn.Qty)) * Number(convert(this.ObjaddSaleReturn.Rate))) + Number(convert(this.ObjaddSaleReturn.Tax_Amount))).toFixed(2) 
    }
    else {
      this.ObjaddSaleReturn.Amount = 0;
      this.ObjaddSaleReturn.Qty = undefined;
      this.ObjaddSaleReturn.Rate = undefined;
      this.ObjaddSaleReturn.Tax_Amount = undefined
    }
   
  }
  getReasonOfReturnList(){
    this.ReasonReturnList = []
   const obj = {
    'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
    'Report_Name_String': "Get_Reason_Of_Return"
   }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ReasonReturnList = [...data]
    })
  }
  GetConditionOfGoodsList(){
    this.ConditionOfGoodsList = []
    const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String': "Get_Condition_Of_Goods"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ConditionOfGoodsList = [...data]
    })
  }
  GetTypeReturnList(){
    this.TypeReturnList = []
    const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String': "Get_Type_Of_Return"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.TypeReturnList = [...data]
    })
  }
  DeleteSalereturnListRow(index:any){
     this.SalereturnList.splice(index,1);
  }
  Savesalereturn(){
    if(this.SalereturnList.length){
      if(this.TicketNo){
        this.SalereturnList.forEach((ele:any) => {
          ele.Ticket_No = this.TicketNo
          ele.Rate = Number(ele.Rate)
          ele.Tax_Amount = Number(ele.Tax_Amount)
        });
      }
     const obj = {
        'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
        'Report_Name_String':  "Create_Return_Request",
        'Json_Param_String': JSON.stringify(this.SalereturnList),
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        if(data[0].Column1){
         this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Sales Return Request",
            detail: "Succesfully "+this.buttonname,
          });
          this.clearData()
          this.tabIndexToView= 0;
          this.items = ["BROWSE", "CREATE RETURN REQUEST"];
          this.getSearchedBrowselist()
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Something Wrong",
            detail: "Try Again Later",
          });
        }
      })
    }
    
  }
  getSearchedBrowselist(){
    this.SearchedBrowselist = []
    this.SearchedBrowselistHeader = []
    const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String':  "Browse_Return_Request",
      'Json_Param_String': JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]),
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      if(data.length){
        if(data[0].hasOwnProperty('Return_Date')){
          data.forEach((ele:any) => {
            ele.Return_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(ele.Return_Date);
          });
        }
      this.SearchedBrowselist = data
      this.SearchedBrowselistHeader = Object.keys(data[0])
      }
    })
  }

 getView(col:any){
 this.DocDate = {}
 this.viewList = []
 if(col.Ticket_No){
  const obj = {
    'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
    'Report_Name_String':  "Get_Return_Request",
    'Json_Param_String': JSON.stringify([{Ticket_No : col.Ticket_No}]),
  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    this.viewList = data
    this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Request_Date);
    this.viewModal = true
  })
 }
 }
 getEdit(col:any){
  if(col.Ticket_No){
    this.clearData()
    this.DocDate = {}
    this.tabIndexToView = 1
    this.buttonname = "Update"
    this.items = ["BROWSE", "UPDATE RETURN REQUEST"];
    this.TicketNo = col.Ticket_No;
    this.getEditdata(col.Ticket_No)
  }
 }
 getEditdata(TicketNo:any){
  const obj = {
    'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
    'Report_Name_String':  "Get_Return_Request",
    'Json_Param_String': JSON.stringify([{Ticket_No : TicketNo}]),
  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    this.objsaleReturn = data[0]
    this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Request_Date);
    this.getProduct(data[0].Sub_Ledger_ID)
    this.SalereturnList = data
     }) 
 }


}

class saleReturn{
      Sales_Man_ID:any
      Request_Date:any
      Sub_Ledger_ID:any
      Posted_By:any
      Ticket_No:any
}

class addSaleReturn {
  Product_ID:any
  Qty:any
  Reason_Of_Return:any
  Condition_Of_Goods:any
  Type_Of_Return:any
  Return_Text:any	
  Against_Challan_No:any
  Tax_Invoice_No:any
  Product_Description:any
  UOM:any
  Rate:any
  Tax_Amount:any
  Amount:any
 }