import {
  AfterContentInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { BpmnService } from '../common/bpmn.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss'],
})
export class DiagramComponent implements AfterContentInit, OnInit, OnDestroy {
  diagramUrl: string =
    'https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/master/starter/diagram.bpmn';
  diagramXml: string = '';

  @ViewChild('canvas', { static: true }) private canvasEl!: ElementRef;
  @ViewChild('properties', { static: true }) private propertiesEl!: ElementRef;

  constructor(private http: HttpClient, private bpmn: BpmnService) {}

  ngOnInit() {
    this.initModeler();
  }

  initModeler() {
    console.log('[BPMN] Modeler:', this.bpmn['modeler']);
    const canvas = this.bpmn.getCanvas();

    this.bpmn.on('import.done', ({ error }: any) => {
      console.log('[BPMN] import done');
      if (!error) {
        this.doThings();
        canvas.zoom('fit-viewport', 'auto');
      }
    });
  }

  doThings() {
    const elementRegistry = this.bpmn.getElementRegistry();
    const modeling = this.bpmn.getModeling();
    elementRegistry.forEach((element, gfx) => {
      if (is(element, 'bpmn:Task')) {
        modeling.setColor(element, { stroke: '#0B6B6F', fill: '#94d4d6' });
      }
    });
  }

  ngAfterContentInit(): void {
    this.bpmn.attachTo(this.canvasEl.nativeElement);
    this.bpmn.getPropertiesPanel().attachTo(this.propertiesEl.nativeElement);
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
      .pipe(switchMap((xml: string) => this.bpmn.importXML(xml)))
      .subscribe(
        (warnings) => {
          if (warnings.length) {
            console.log('[BPMN] import warnings:', warnings);
          }
        },
        (err) => {
          console.error('[BPMN] import failed:', err);
        }
      );
  }

  loadXml(xml: string): Subscription {
    return this.bpmn.importXML(xml).subscribe(
      (warnings) => {
        if (warnings.length) {
          console.log('[BPMN] import warnings:', warnings);
        }
      },
      (err) => {
        console.error('[BPMN] import failed:', err);
      }
    );
  }
}
