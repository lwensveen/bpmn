import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import { from, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OverlaysService } from './overlays.service';

@Component({
  selector: 'app-diagram',
  template: `
    <div #ref class="diagram-container"></div>
  `,
  styles: [
    `
      .diagram-container {
        height: 500px;
        width: 100%;
      }
    `,
  ],
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy {
  private bpmnJS;

  @ViewChild('ref', { static: true }) private el!: ElementRef;
  @ViewChild('canvas', { static: false }) private canvas!: any;

  @Output() private importDone: EventEmitter<any> = new EventEmitter();

  @Input() url!: string;
  xml!: string;

  constructor(
    private http: HttpClient,
    private overlaysService: OverlaysService,
  ) {
    this.bpmnJS = new BpmnJS();

    this.bpmnJS.on('import.done', ({ error }: any) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
        this.overlaysService.addOverlays(this.xml, this.canvas);
      }
    });
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string): Subscription {

    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => {
          this.xml = xml;
          return this.importDiagram(xml);
        }),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings,
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err,
          });
        },
      )
    );
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(
      this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }
}
