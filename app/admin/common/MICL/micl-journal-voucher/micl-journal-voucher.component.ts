import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-micl-journal-voucher',
  templateUrl: './micl-journal-voucher.component.html',
  styleUrls: ['./micl-journal-voucher.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MICLJournalVoucherComponent implements OnInit {
  tabIndexToView : any = 0;
  buttonname : any= "Create";
  Spinner : any = false;
  seachSpinner : any = false;
  can_popup : any = false;
  Del =false;
  Save = false;
  items : any= [];
  Browselist :any = [];
  act_popup : any= false;
  objJournal : Journal = new Journal();
  objsearch : Search = new Search();
  initDate = [];
  Voucher_Date = new Date();
  Ref_Doc_Date = new Date();
  JournalFormSubmitted : any = false;
  JournalTopperFormSubmitted : any = false;
  JournalSearchFormSubmit : any = false;
  JournalListAdd : any = [];
  TabSpinner : any = false;
  Tabbuttonname : any = "Create";
  LedgerList : any = [];
  LedgerdataList : any = [];
  SubLedgerListlow : any = [];
  SubLedgerDataListlow : any = [];
  costHeadList : any = [];
  VoucherTypeList : any = [];
  costHeadDataList : any = [];
  projectDataList : any = [];
  DRSum : any = 0;
  CRSum : any = 0;
  Sl_No : any = 0;
  DrList : any = ["DR", "CR"];
  balance : any;
  JournalList : any = [];
  companyList : any = [];
  SaveData : any = [];
  AlljournalData : any = [];
  VoucherNo : any;
  User_Type : any;
  DelVoucherNo =undefined;
  constructor(
    private $http : HttpClient, 
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService,

  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Journal Voucher",
      Link: " Financial Management --> Transaction -> Journal"
    });
    this.JournalList = ['Sale', 'Purchase', 'Credit Note', 'Debit Note', 'Normal(Journal)']
    this.Getledger();
    this.getCostCenter();
    this. GetCostHead();
    this.getProject();
    this.GetCompany();
    this.objJournal.DR = "DR";
    this.User_Type = this.commonApi.CompacctCookies.User_Type ;
    console.log('A=',this.User_Type);
    
   
  }
 
  GetCompany(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Dropdown_Company",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.companyList = data;
      this.objJournal.Company_ID = this.companyList.length?this.companyList[0].Company_ID: 0;
      console.log('this.objJournal.Company_ID=', this.objJournal.Company_ID);
      
      console.log("companyList=",this.companyList);
     })

  }

  Getledger(){
    this.LedgerList = [];
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Master_Accounting_Ledger_Dropdown_ALL",   
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.LedgerdataList = data ;
      console.log("LedgerList",this.LedgerdataList);
        this.LedgerdataList.forEach(el => {
          this.LedgerList.push({
            label: el.Ledger_Name,
            value: el.Ledger_ID
          });
         
        });
        
    })
  }

  getsubLedger(id){
    if(id){
      this.SubLedgerListlow = [];
      const obj = {
        "SP_String": "sp_Comm_Controller",
        "Report_Name_String": "Get_Accounting_Sub_Ledger_Dropdown",
        "Json_Param_String": JSON.stringify([{Ledger_ID : id}])      
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log(data);
        this.SubLedgerDataListlow = data;
       
        console.log("SubLedgerDataListlow",this.SubLedgerDataListlow);
        this.SubLedgerDataListlow.forEach(el => {
          this.SubLedgerListlow.push({
              label: el.Sub_Ledger_Name,
              value: el.Sub_Ledger_ID
            });
           
          });
         
      })
    }
    else {
      this.objJournal.Sub_Ledger_ID = undefined
      this.SubLedgerListlow = []
    }
   
   }
   validcheck(){
    return this.SubLedgerListlow.length ? true : false
  }

  getCostCenter(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Master_Cost_Center_Dropdown",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.costHeadList = data;
      this.objJournal.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
      this.objsearch.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
      console.log("costCentertran",this.costHeadList);
     })
   }

  
   
  
  GetCostHead(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Master_Accounting_Cost_Head_Dropdown",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.costHeadDataList = data ;
      console.log("costHeadDataList",this.costHeadDataList);
     })
  }

  getProject(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Master_Project_Detail_Dropdown",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("Project Data ==>",data);
       this.projectDataList = data;
     })
  }

  AddJournalVoucher(valid){
    this.JournalFormSubmitted = true;
    if(valid){
      const LedgerFilter = this.LedgerdataList.filter((el :any)=> Number(el.Ledger_ID)=== Number(this.objJournal.Ledger_ID));
      const SubLedgerFilter = this.SubLedgerDataListlow.filter((el :any)=> Number(el.Sub_Ledger_ID)=== Number(this.objJournal.Sub_Ledger_ID));
      const CostHeadFilter = this.costHeadDataList.filter((el : any)=> Number(el.Cost_Head_ID)=== Number(this.objJournal.Cost_Head_ID));
      this.objJournal.Ref_Doc_Date = this.DateService.dateConvert(this.Ref_Doc_Date);
      this.objJournal.Voucher_Date = this.DateService.dateConvert(this.Voucher_Date);
      this.objJournal.Fin_Year_ID = this.commonApi.CompacctCookies.Fin_Year_ID;
      this.objJournal.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
      this.objJournal.User_ID = this.commonApi.CompacctCookies.User_ID;
      
      
      console.log(this.DRSum);
      
      this.JournalListAdd.push({
        Sl_No : this.JournalListAdd.length + 1,
        Voucher_No : this.VoucherNo? this.VoucherNo : 'A',
        Company_ID : this.objJournal.Company_ID,
        Ledger_Name : LedgerFilter.length?LedgerFilter[0].Ledger_Name : "",
        Ledger_ID : this.objJournal.Ledger_ID,
        Sub_Ledger_Name : SubLedgerFilter.length? SubLedgerFilter[0].Sub_Ledger_Name : "",
        Sub_Ledger_ID : this.objJournal.Sub_Ledger_ID,
        Cost_Head_ID : this.objJournal.Cost_Head_ID,
        Cost_Head_Name : CostHeadFilter.length? CostHeadFilter[0].Cost_Head_Name : "",
        Fin_Year_ID :  this.objJournal.Fin_Year_ID,
        Naration : this.objJournal.Naration,
        DR_Amt : this.objJournal.DR == 'DR'? Number(Number(this.objJournal.Amount).toFixed(2)) : 0,
        CR_Amt : this.objJournal.DR == 'CR'? Number(Number(this.objJournal.Amount).toFixed(2)) : 0,
        Cost_Cen_ID : this.objJournal.Cost_Cen_ID,
        Cost_Cen_ID_Trn : this.objJournal.Cost_Cen_ID_Trn,
        User_ID : this.objJournal.User_ID,
        Adjustment_Doc_No : this.objJournal.Ref_Doc_No,
        Prev_doc_no : this.objJournal.Ref_Doc_No,

        Ref_Doc_No : this.objJournal.Ref_Doc_No,
        Voucher_Date : this.objJournal.Voucher_Date,
        Reconsil_Date : this.objJournal.Voucher_Date,
        Ref_Doc_Date : this.objJournal.Ref_Doc_Date,
        HSN_NO : this.objJournal.HSN_NO,
        ITC_Eligibility : this.objJournal.ITC_Eligibility,
        GST_Per : this.objJournal.GST_Per,
        JV_Type : this.objJournal.JV_Type


      });
      console.log("JournalListAdd",this.JournalListAdd);
      
      
      
      // this.SaveData.push({
      //   Voucher_No : this.VoucherNo? this.objJournal.Voucher_No : 'A',
      //   Company_ID : this.objJournal.Company_ID,
      //   Ledger_ID : this.objJournal.Ledger_ID,
      //   Sub_Ledger_ID : this.objJournal.Sub_Ledger_ID,
      //   Cost_Head_ID : this.objJournal.Cost_Head_ID,
      //   Fin_Year_ID :  this.objJournal.Fin_Year_ID,
      //   Naration : this.objJournal.Naration,
      //   DR_Amt : this.objJournal.DR == 'DR'? Number(Number(this.objJournal.Amount).toFixed(2)) : 0,
      //   CR_Amt : this.objJournal.DR == 'CR'? Number(Number(this.objJournal.Amount).toFixed(2)) : 0,
      //   Cost_Cen_ID : this.objJournal.Cost_Cen_ID,
      //   Cost_Cen_ID_Trn : this.objJournal.Cost_Cen_ID_Trn,
      //   User_ID : this.objJournal.User_ID,
      //   Adjustment_Doc_No : this.objJournal.Ref_Doc_No,
      //   Prev_doc_no : this.objJournal.Ref_Doc_No,

      //   Ref_Doc_No : this.objJournal.Ref_Doc_No,
      //   Voucher_Date : this.objJournal.Voucher_Date,
      //   Reconsil_Date : this.objJournal.Voucher_Date,
      //   Ref_Doc_Date : this.objJournal.Ref_Doc_Date,
      //   HSN_NO : this.objJournal.HSN_NO,
      //   ITC_Eligibility : this.objJournal.ITC_Eligibility,
      //   GST_Per : this.objJournal.GST_Per,
      //   JV_Type : this.objJournal.JV_Type


      // });
     
      this.objJournal = new Journal();
      this.JournalFormSubmitted = false;
    
      
      //this.clearData();
      if(this.JournalListAdd.length){
      this.objJournal.Company_ID = this.JournalListAdd.length?this.JournalListAdd[0].Company_ID :0;
      this.objJournal.Cost_Cen_ID_Trn = this.JournalListAdd.length?Number(this.JournalListAdd[0].Cost_Cen_ID_Trn) : 0;
      this.objJournal.Naration = this.JournalListAdd.length?this.JournalListAdd[0].Naration : "";
      this.objJournal.JV_Type = this.JournalListAdd.length? this.JournalListAdd[0].JV_Type : undefined;
      this.Voucher_Date =new Date(this.JournalListAdd[0].Voucher_Date); 
      }
      else{
        this.objJournal.Company_ID = undefined
        this.objJournal.Cost_Cen_ID_Trn = undefined
        this.objJournal.Naration = undefined;
        this.objJournal.JV_Type = undefined
        this.Voucher_Date =new Date();

      }
      
      //this.objJournal.DR = "DR";
      
      this.SubLedgerDataListlow = [];
      this.getTotalDRCR();
      
      

    }

   }

   getTotalDRCR(){
    this.DRSum = 0;
      this.CRSum = 0;
   
    this.JournalListAdd.forEach(el=>{
      this.DRSum += Number(Number(el.DR_Amt).toFixed(2));
      this.CRSum += Number(Number(el.CR_Amt).toFixed(2));
     })
      console.log('DRSum=',this.DRSum);
      console.log('CRSUM=', this.CRSum);
      this.getBalance();

     
    
   }

   getBalance(){
    this.balance = Math.abs(Number(this.DRSum) - Number(this.CRSum));
    if(this.DRSum > this.CRSum){
      //this.balance = Number(this.DRSum) - Number(this.CRSum);
      this.objJournal.Amount = this.balance;
      console.log(this.balance);
      this.objJournal.DR = "CR"
    }
    else if(this.DRSum < this.CRSum){
      //this.balance = Number(this.CRSum) - Number(this.DRSum);
      this.objJournal.Amount = this.balance;
      this.objJournal.DR = "DR"
    }
    else{
      this.objJournal.Amount = undefined;
      this.objJournal.DR = "DR";

    }
   }

   getToFix(number){
    if(number){
     return Number(Number(number).toFixed(2))
    }
   }

  
    DeleteProduct(index) {
      this.JournalListAdd.splice(index,1);
      this.getTotalDRCR();
      this. getBalance();
    }

   

  onReject(){
    this.compacctToast.clear("c");
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.DRSum = undefined;
    this.CRSum = undefined;
    this.balance = undefined;
    this.JournalListAdd = [];
    this.clearData();
  }

  JournalSave(){
    
 
 
    this.Del =true;
    this.Save = false;
   //this.DelVoucherNo = col.Voucher_No ;
   this.compacctToast.clear();
   this.compacctToast.add({
     key: "c",
     sticky: true,
     severity: "warn",
     summary: "Are you sure?",
     detail: "Confirm to proceed"
   });
 

    // this.JournalListAdd.forEach(el=>{
    //   this.SaveData.push({
    //     Company_ID : el.Company_ID, 
    //     Voucher_No : el.Voucher_No,
    //     Ledger_ID : el.Ledger_ID,
    //     Sub_Ledger_ID : el.Sub_Ledger_ID,
    //     Cost_Head_ID : el.Cost_Head_ID,
    //     Fin_Year_ID :  el.Fin_Year_ID,
    //     Naration : el.Naration,
    //     DR_Amt : el.DR_Amt,
    //     CR_Amt : el.CR_Amt,
    //     Cost_Cen_ID : el.Cost_Cen_ID,
    //     Cost_Cen_ID_Trn : el.Cost_Cen_ID_Trn,
    //     User_ID : el.User_ID,
    //     Adjustment_Doc_No : el.Adjustment_Doc_No,
    //     Prev_doc_no : el.Prev_doc_no,

    //     Ref_Doc_No : el.Ref_Doc_No,
    //     Voucher_Date : el.Voucher_Date,
    //     Reconsil_Date : el.Reconsil_Date,
    //     Ref_Doc_Date : el.Ref_Doc_Date,
    //     HSN_NO : el.HSN_NO,
    //     ITC_Eligibility : el.ITC_Eligibility,
    //     GST_Per : el.GST_Per,
    //     JV_Type : el.JV_Type

        
    //   })
    // });
    
    // const obj = {
    //   "SP_String": "Sp_MICL_Journal_Voucher",
    //   "Report_Name_String":"BL_Txn_Acc_Journal_Insert",
    //   "Json_Param_String": JSON.stringify(this.SaveData) 
    //  }
    //  this.GlobalAPI.getData(obj).subscribe((data : any)=>
    //  {
    //    console.log('data=',data);
       
    //    if(data[0].Column1)
    //    {
         
    //     this.compacctToast.clear();
    //     this.compacctToast.add({
    //     key: "compacct-toast",
    //     severity: "success",
    //     summary: "Journal Voucher Create Succesfully ",
    //     detail: "Succesfully Created"
    //   });
    //   //this.getList();
    //  // this.PaymentRequisitionActionPOPUP = false;
    //   this.clearData();
    //   this.JournalListAdd = [];
    //   this.SaveData = [];
    //   this.DRSum = undefined;
    //   this.CRSum = undefined;
    //   this.balance = undefined;
    //   //this.HolidayListAdd = [];
    //   this.Spinner = false;
    //   this.tabIndexToView = 0;
    //    this.items = ["BROWSE", "CREATE"];
    //   }
    //   else{
    //     this.compacctToast.clear();
    //     this.compacctToast.add({
    //     key: "compacct-toast",
    //     severity: "error",
    //     summary: "Error",
    //     detail: "Something Wrong"
    //   });
    //   this.clearData();
    //   this.Spinner = false;
    //   }
    //  });

  }
  getDateRange(dateRangeObj){
    if (dateRangeObj.length) {
      console.log("dateRangeObj",dateRangeObj);
      this.objsearch.Start_date = dateRangeObj[0];
      this.objsearch.End_date = dateRangeObj[1];
    }
  }

  ShowSearchData(valid){
    this.JournalSearchFormSubmit = true;
  if(valid){
   this.objsearch.Start_date = this.objsearch.Start_date
    ? this.DateService.dateConvert(new Date(this.objsearch.Start_date))
    : this.DateService.dateConvert(new Date());
    this.objsearch.End_date = this.objsearch.End_date
    ? this.DateService.dateConvert(new Date(this.objsearch.End_date))
    : this.DateService.dateConvert(new Date());
    let TempData = {
      
      Cost_Cen_ID: Number(this.objsearch.Cost_Cen_ID),
      Start_date: this.objsearch.Start_date,
      End_date: this.objsearch.End_date
     
    }
    const obj = {
      "SP_String": "Sp_MICL_Journal_Voucher",
      "Report_Name_String": "Browse_Journal_Voucher",
      "Json_Param_String" : JSON.stringify([TempData])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("all Data",data);
     this.AlljournalData = data;
      
     })
  }
  }

  EditJournal(Col){
    if(Col.Voucher_No){
    this.VoucherNo = Col.Voucher_No;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.getJournal(Col.Voucher_No);
    }

  }

  getJournal(V_No){
    const obj = {
      "SP_String": "Sp_MICL_Journal_Voucher",
      "Report_Name_String":"BL_Txn_Acc_Journal_Get_Data",
      "Json_Param_String": JSON.stringify([{ Voucher_No: V_No}]) 
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log('Data=',data);
        this.JournalListAdd = data;
        //this.SaveData = data;
        this.objJournal.Company_ID = data[0].Company_ID;
        this.objJournal.Voucher_No = data[0].Voucher_No;
        this.objJournal.Cost_Cen_ID_Trn = data[0].Cost_Cen_ID_Trn;
        this.objJournal.Naration = data[0].Naration;
        this.Voucher_Date = new Date(data[0].Voucher_Date);
        this.objJournal.JV_Type = data[0].JV_Type;
        
        this.getTotalDRCR();
        

  });
  

  }
  DeleteJournal(col){
 this.DelVoucherNo =undefined;
  this.Del =true;
 
 if(col.Voucher_No){
    this.Del =false;
    this.Save = true;
   this.DelVoucherNo = col.Voucher_No ;
   this.compacctToast.clear();
   this.compacctToast.add({
     key: "c",
     sticky: true,
     severity: "warn",
     summary: "Are you sure?",
     detail: "Confirm to proceed"
   });
 }


}

  onConfirm(){
    if(this.DelVoucherNo){
      const tempobj = {
        Voucher_No : this.DelVoucherNo,
        User_ID :this.commonApi.CompacctCookies.User_ID,
      }
      const obj = {
        "SP_String": "Sp_MICL_Journal_Voucher",
        "Report_Name_String": "BL_Txn_Acc_Journal_Delete_Data",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("del Data===", data[0].Column1)
        if (data[0].Column1){
          this.onReject();
          this.ShowSearchData(true);
          this.DelVoucherNo = undefined ;
        //  this.can_popup = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "User ",
            detail: "Succesfully Deleted"
          });
         }
      })
    }

  }

  onConfirm2(){
    this.JournalListAdd.forEach(el=>{
      this.SaveData.push({
        Company_ID : el.Company_ID, 
        Voucher_No : el.Voucher_No,
        Ledger_ID : el.Ledger_ID,
        Sub_Ledger_ID : el.Sub_Ledger_ID,
        Cost_Head_ID : el.Cost_Head_ID,
        Fin_Year_ID :  el.Fin_Year_ID,
        Naration : el.Naration,
        DR_Amt : el.DR_Amt,
        CR_Amt : el.CR_Amt,
        Cost_Cen_ID : el.Cost_Cen_ID,
        Cost_Cen_ID_Trn : el.Cost_Cen_ID_Trn,
        User_ID : el.User_ID,
        Adjustment_Doc_No : el.Adjustment_Doc_No,
        Prev_doc_no : el.Prev_doc_no,

        Ref_Doc_No : el.Ref_Doc_No,
        Voucher_Date : el.Voucher_Date,
        Reconsil_Date : el.Reconsil_Date,
        Ref_Doc_Date : el.Ref_Doc_Date,
        HSN_NO : el.HSN_NO,
        ITC_Eligibility : el.ITC_Eligibility,
        GST_Per : el.GST_Per,
        JV_Type : el.JV_Type

        
      })
    });
    
    const obj = {
      "SP_String": "Sp_MICL_Journal_Voucher",
      "Report_Name_String":"BL_Txn_Acc_Journal_Insert",
      "Json_Param_String": JSON.stringify(this.SaveData) 
     }
     this.GlobalAPI.getData(obj).subscribe((data : any)=>
     {
       console.log('data=',data);
       
       if(data[0].Column1)
       {
         
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Journal Voucher Create Succesfully ",
        detail: "Succesfully Created"
      });
      //this.getList();
     // this.PaymentRequisitionActionPOPUP = false;
      this.clearData();
      this.JournalListAdd = [];
      this.SaveData = [];
      this.DRSum = undefined;
      this.CRSum = undefined;
      this.balance = undefined;
      //this.HolidayListAdd = [];
      this.Spinner = false;
      this.tabIndexToView = 0;
       this.items = ["BROWSE", "CREATE"];
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      this.clearData();
      this.Spinner = false;
      }
     });

  }

  clearData(){
    this.objJournal = new Journal();
    this.objJournal.Company_ID = this.companyList.length?this.companyList[0].Company_ID: 0;
    this.objJournal.DR = "DR";
    this.JournalFormSubmitted = false;
    this.objsearch = new Search();
    this.JournalSearchFormSubmit = false;
    this.AlljournalData = [];
    this.VoucherNo = undefined;
    this.SaveData = [];
    this.SubLedgerListlow = [];
    this.objJournal.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
    this.objsearch.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
   
    this.initDate = [new Date(),new Date()];
 }

}

class Journal{
  

Company_ID : any;	
Voucher_Type_ID	: any;
Voucher_No	: any;
Voucher_Date : any;
Reconsil_Date	: any;	
Reconsil_Tag	: any
Ledger_ID: any;
Sub_Ledger_ID	: any;
Cost_Head_ID	: any;
Fin_Year_ID : any
Naration : any;
DR_Amt	: any;
CR_Amt	: any;
Cost_Cen_ID	: any;
Cost_Cen_ID_Trn	: any
User_ID	: any;
Adjustment_Doc_No : any;
Prev_doc_no	: any;
Ref_Doc_No	: any;
Ref_Doc_Date : any;
HSN_NO : any;
GST_Per	: any;
ITC_Eligibility	: any;
JV_Type	: any;

Amount : any;
DR : any;
		
  
}

class Search{ 
  Cost_Cen_ID : any;
  Start_date : any;				
	End_date : any;	
}
// class JournalTopper{
//   Voucher_No : any;
//   Cost_Cen_ID : any;
//   Naration : any;
//   journal_type : any;
// }
