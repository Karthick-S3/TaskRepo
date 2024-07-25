import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  reportData = [
    {
        "ID": "4",
        "SIZETYPE": "HC GP",
        "LOCATION": "AEDXB",
        "BALANCE": "-8"
    },
    {
        "ID": "12",
        "SIZETYPE": "22 CO",
        "LOCATION": "AEDXB",
        "BALANCE": "2"
    },
    {
        "ID": "9",
        "SIZETYPE": "20 GP",
        "LOCATION": "AEDXB",
        "BALANCE": "753"
    },
    {
        "ID": "1",
        "SIZETYPE": "20 GP",
        "LOCATION": "AEDXB",
        "BALANCE": "5"
    },
    {
        "ID": "8",
        "SIZETYPE": "HC GP",
        "LOCATION": "INBOM",
        "BALANCE": "43"
    },
    {
        "ID": "10",
        "SIZETYPE": "20 GP",
        "LOCATION": "INBOM",
        "BALANCE": "26"
    },
    {
        "ID": "11",
        "SIZETYPE": "HC RH",
        "LOCATION": "INBOM",
        "BALANCE": "3"
    },
    {
        "ID": "7",
        "SIZETYPE": "HC GP",
        "LOCATION": "INBOM",
        "BALANCE": "32"
    },
    {
        "ID": "5",
        "SIZETYPE": "20 HC",
        "LOCATION": "INBOM",
        "BALANCE": "7"
    },
    {
        "ID": "3",
        "SIZETYPE": "HC GP",
        "LOCATION": "INBOM",
        "BALANCE": "2"
    },
    {
        "ID": "2",
        "SIZETYPE": "20 GP",
        "LOCATION": "INBOM",
        "BALANCE": "99"
    },
    {
        "ID": "6",
        "SIZETYPE": "20 GP",
        "LOCATION": "INBOM",
        "BALANCE": "323"
    }
]

}
