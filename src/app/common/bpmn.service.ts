import { Injectable } from '@angular/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import Canvas from 'diagram-js/lib/core/Canvas';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import Modeling from 'diagram-js/lib/features/modeling/Modeling';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const propertiesPanelModule = require('bpmn-js-properties-panel');
const propertiesProvider = require('bpmn-js-properties-panel/lib/provider/bpmn');

export interface BpmnModelerOptions {
  container?: string;
  width?: string | number;
  height?: string | number;
  moddleExtensions?: Object;
  modules?: any[];
  additionalModules?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class BpmnService {
  private modeler: any;

  constructor() {
    this.modeler = new BpmnModeler({
      additionalModules: [propertiesPanelModule, propertiesProvider],
    } as BpmnModelerOptions);
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  importXML(xml: string, bpmnDiagram?: Object | string): Observable<string[]> {
    return from(
      this.modeler.importXML(xml, bpmnDiagram) as Promise<{
        warnings: string[];
      }>
    ).pipe(map((result) => result.warnings));
  }

  get(name: string): any {
    return this.modeler.get(name);
  }

  getCanvas(): Canvas {
    return this.get('canvas');
  }

  getElementRegistry(): ElementRegistry {
    return this.get('elementRegistry');
  }

  getModeling(): Modeling {
    return this.get('modeling');
  }

  getPropertiesPanel(): any {
    return this.get('propertiesPanel');
  }

  on(event: string, callback: ({}: any) => void): void {
    return this.modeler.on(event, callback);
  }

  attachTo(element: HTMLElement): void {
    return this.modeler.attachTo(element);
  }

  destroy(): void {
    return this.modeler.destroy();
  }
}
