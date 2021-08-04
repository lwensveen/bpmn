import { Injectable } from '@angular/core';
import Modeler from 'bpmn-js/lib/Modeler';
import Canvas from 'diagram-js/lib/core/Canvas';
import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import Modeling from "diagram-js/lib/features/modeling/Modeling";

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
    this.modeler = new Modeler();
  }

  init(options?: BpmnModelerOptions) {
    this.modeler = new Modeler(options);
  }

  importXML(
    xml: string,
    bpmnDiagram?: Object | string
  ): Promise<{ warnings: string[] }> {
    return this.modeler.importXML(xml, bpmnDiagram);
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
