import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-features',
  templateUrl: './admin-features.component.html',
  styleUrl: './admin-features.component.css'
})
export class AdminFeaturesComponent implements OnInit {
  

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    
  }

  
}