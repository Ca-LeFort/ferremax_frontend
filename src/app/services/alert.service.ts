import { Injectable } from '@angular/core';
import { cuteAlert } from 'cute-alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  success(title: string, description: string): Promise<string> {
    return cuteAlert({
      type: 'success',
      title,
      description,
      primaryButtonText: 'Aceptar'
    });
  }

  error(title: string, description: string): Promise<string> {
    return cuteAlert({
      type: 'error',
      title,
      description,
      primaryButtonText: 'Aceptar'
    });
  }

  info(title: string, description: string): Promise<string> {
    return cuteAlert({
      type: 'info',
      title,
      description,
      primaryButtonText: 'Aceptar'
    });
  }

  warning(title: string, description: string): Promise<string> {
    return cuteAlert({
      type: 'warning',
      title,
      description,
      primaryButtonText: 'Aceptar'
    });
  }

  async question(title: string, description: string): Promise<boolean> {
    return cuteAlert({
      type: 'question',
      title,
      description,
      primaryButtonText: 'Sí',
      secondaryButtonText: 'No'
    }).then((result) => {
      if (result === 'primaryButtonClicked') {
        return true; // Confirmado
      } else {
        return false; // Cancelado
      }
    });
  }
}
