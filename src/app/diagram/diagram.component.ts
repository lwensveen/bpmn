import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  OnInit,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import { from, Observable, Subscription } from 'rxjs';
import { BpmnService } from '../common/bpmn.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styles: [
    `
      .diagram-canvas {
        height: 80vh;
        width: 100%;
      }
    `,
  ],
})
export class DiagramComponent implements AfterContentInit, OnInit, OnDestroy {
  // private bpmnJS: any;
  private canvas: any;
  private elementRegistry: any;
  private modeling: any;

  diagramUrl: string =
    'https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/master/starter/diagram.bpmn';

  @ViewChild('canvas', { static: true }) private el!: ElementRef;

  constructor(private http: HttpClient, private bpmn: BpmnService) {}

  ngOnInit() {
    // this.bpmnJS = new BpmnJS();

    this.initModeler();
  }

  initModeler() {
    console.log('[BPMN] Modeler:', this.bpmn['modeler']);
    this.canvas = this.bpmn.get('canvas');
    this.elementRegistry = this.bpmn.get('elementRegistry');
    this.modeling = this.bpmn.get('modeling');

    this.bpmn.on('import.done', ({ error }: any) => {
      console.log('[BPMN] import done');
      if (!error) {
        this.doThings();
        this.canvas.zoom('fit-viewport', 'auto');
      }
    });
  }

  doThings() {
    console.log('[BPMN] elementRegistry:', this.elementRegistry);
    this.elementRegistry.forEach((element: any, gfx: any) => {
      console.log('[BPMN] element type', element.type);
      if (is(element, 'bpmn:Task')) {
        this.modeling.setColor(element, { stroke: '#0B6B6F', fill: '#94d4d6' });
      }
      console.log('[BPMN] gfx', gfx);
    });
    console.log('[BPMN] modeling:', this.modeling);
  }

  ngAfterContentInit(): void {
    this.bpmn.attachTo(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.bpmn.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string): Subscription {
    return this.http
      .get(url, { responseType: 'text' })
      .pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map((result) => result.warnings)
      )
      .subscribe(
        (warnings) => {
          console.log('[BPMN] import warnings:', warnings);
        },
        (err) => {
          console.warn('[BPMN] import failed:', err);
        }
      );
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmn.importXML(xml));
  }
}
