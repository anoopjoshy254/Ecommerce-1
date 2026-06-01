import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent implements OnInit {
  route = inject(ActivatedRoute);
  orderId!: number;

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
  }
}
