import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OrdemServicoService } from '../../core/services/ordem-servico.service';
import { OrdemServico } from '../../core/models/ordem-servico.model';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Icon, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private ordemServicoService = inject(OrdemServicoService);

  ordens = signal<OrdemServico[]>([]);

  faturamentoConcluidas = computed(() =>
    this.ordens()
      .filter((os) => os.status === 'CONCLUIDA')
      .reduce((soma, os) => soma + os.valorTotal, 0)
  );

  ngOnInit(): void {
    this.ordemServicoService.listar().subscribe((ordens) => this.ordens.set(ordens));
  }

  contarPorStatus(...status: string[]): number {
    return this.ordens().filter((os) => status.includes(os.status)).length;
  }
}
