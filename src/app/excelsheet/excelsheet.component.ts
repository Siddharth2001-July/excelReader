import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excelsheet',
  templateUrl: './excelsheet.component.html',
  styleUrls: ['./excelsheet.component.css']
})
export class ExcelsheetComponent implements OnInit {

  data: [][] | undefined;
  header: [][] | undefined;
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }
  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);

    // Multiple files error
    if (target.files.length !== 1) {
      throw new Error("Please upload one file at a time.");
    }
    // Reading File
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // reading worksheet 
      //  name
      const wsname: string = wb.SheetNames[0];
      //  content
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      // console.log(ws);

      // converting xlsx to json
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      // Sending data to Firebase Server
      this.httpClient.post("https://excelreader-27e76-default-rtdb.firebaseio.com/excelFile/excelData.json", this.data)
        .subscribe(response => console.log(response))

      this.header = this.data[0];

      this.data.splice(0, 1);
    }

    reader.readAsBinaryString(target.files[0]);
  }
}
