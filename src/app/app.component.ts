import { Component, OnInit } from '@angular/core';
import { Salario } from 'src/salario';
import { interval } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-salario';
  salarioInformado: number;
  salarioLiquidoDesejado: number;

  salario = new Salario(0);

 
  public updateSalario(event): void {
    this._internalUpdateSalario(+event.target.value);
  }

  public _internalUpdateSalario(newSalario): void {
    this.salario = new Salario(+newSalario);
  }


  updateSalarioLiquidoDesejado(event): void {
    this.salarioLiquidoDesejado = event.target.value;
  }

  public converteSalarioBrutoParaLiquido(): void {
    this.salarioInformado = this.salarioLiquidoDesejado;    
    const obs$ = interval(1).pipe(
      map(() => {
        const currentValue = +this.salario.salarioLiquido;
        const difference = Math.abs(currentValue - +this.salarioLiquidoDesejado);
        const increment = difference >= 5 ? 1 : 0.01;
        this.salarioInformado = +((this.salarioInformado + increment).toFixed(2));

        this._internalUpdateSalario(this.salarioInformado);
        return +this.salario.salarioLiquido;
      }),
    );

    const match$ = obs$.pipe(
      filter(currentValue => +currentValue >= +this.salarioLiquidoDesejado),
    );
    obs$.pipe(takeUntil(match$)).subscribe();
  }
}

