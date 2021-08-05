import { Injectable } from '@angular/core';
import Modeler from 'bpmn-js/lib/Modeler';
import Canvas from 'diagram-js/lib/core/Canvas';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import Overlays from 'diagram-js/lib/features/overlays/Overlays';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const propertiesPanelModule = require('bpmn-js-properties-panel');
const propertiesProvider = require('bpmn-js-properties-panel/lib/provider/bpmn');

@Injectable({
  providedIn: 'root',
})
export class BpmnService {
  private _modeler: Modeler;

  constructor() {
    this._modeler = new Modeler({
      additionalModules: [propertiesPanelModule, propertiesProvider],
    });
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  importXML(xml: string, bpmnDiagram?: Object | string): Observable<string[]> {
    return from(this._modeler.importXML(xml, bpmnDiagram)).pipe(
      map((result) => result.warnings)
    );
  }

  get(name: string): any {
    return this._modeler.get(name);
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

  getOverlays(): Overlays {
    return this.get('overlays');
  }

  getPropertiesPanel(): any {
    return this.get('propertiesPanel');
  }

  on(event: string, callback: (...args: any[]) => void): void {
    return this._modeler.on(event, callback);
  }

  attachTo(element: Node): void {
    return this._modeler.attachTo(element);
  }

  destroy(): void {
    return this._modeler.destroy();
  }
}
