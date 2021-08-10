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
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { BpmnService } from '../common/bpmn.service';
import Base = djs.model.Base;

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
    this.registerEventHandlers();
  }

  registerEventHandlers() {
    const canvas = this.bpmn.getCanvas();

    // after a successful xml import
    this.bpmn.on('import.done', ({ error }) => {
      console.log('[BPMN] import done');
      if (!error) {
        this.doThings();
        canvas.zoom('fit-viewport', 'auto');
      }
    });

    this.bpmn.on('element.click', (event) => {
      console.log('[BPMN] element.click event:', event);
    });

    this.bpmn.on('elements.changed', (event) => {
      console.log('[BPMN] elements.changed event:', event);
      event.elements.forEach((element: Base) => {
        switch (element.type) {
          case 'bpmn:SequenceFlow':
            this.checkElementValidity(element);
            this.checkElementValidity(element.source as Base);
            this.checkElementValidity(element.target as Base);
            // TODO: find workaroud for when "SequenceFlow" is removed, since source and target are null
            break;
          default:
            this.checkElementValidity(element);
        }
      });
    });
  }

  checkElementValidity(element: Base) {
    if (!element) {
      return;
    }

    console.log('[BPMN] validating element', element);
    this.clearAllErrors(element);
    const businessObject = getBusinessObject(element);

    if (
      element.type === 'bpmn:Task' ||
      element.type === 'bpmn:UserTask' ||
      element.type === 'bpmn:ScriptTask'
    ) {
      // check business rules
      if (!(businessObject.incoming && businessObject.incoming.length)) {
        this.addValidationError(element, 'No incoming connections');
      }
      if (!(businessObject.outgoing && businessObject.outgoing.length)) {
        this.addValidationError(element, 'No outgoing connections');
      }
    } else if (element.type === 'bpmn:SequenceFlow') {
      // check expression syntax
      const name = businessObject.name;
      if (name) {
        console.log(`[BPMN] checking syntax of expression "${name}"`);
        const conditionRegExp = new RegExp(
          /^{(\[[A-Za-z_:]+]\s([<>]=?|[!=]=)\s("\w*"|'\w*')|(\(\[[A-Za-z_:]+]\s([<>]=?|[!=]=)\s("\w*"|'\w*')\)(\s(and|or)\s)?)+)}$/
        );
        const isValidCondition = conditionRegExp.test(name);
        console.log(`[BPMN] expression is ${isValidCondition ? '' : 'in'}valid`);
        if (!isValidCondition) {
          this.addSyntaxError(element, 'Invalid syntax');
        }
      }
    }
  }

  addValidationError(element: Base, error: string) {
    const businessObject = getBusinessObject(element);
    if (!businessObject.errorOverlay) {
      businessObject.errorOverlay = this.bpmn.addWarningOverlay(
        element,
        'Invalid task'
      );
    }
    businessObject.errors.push(error);
  }

  addSyntaxError(element: Base, error: string) {
    const businessObject = getBusinessObject(element);
    if (!businessObject.errorOverlay) {
      businessObject.errorOverlay = this.bpmn.addErrorOverlay(element, 'Invalid syntax');
    }
    businessObject.errors.push(error);
  }

  clearAllErrors(element: Base) {
    const businessObject = getBusinessObject(element);
    businessObject.errors = [];
    if (businessObject.errorOverlay) {
      this.bpmn.removeOverlay(businessObject.errorOverlay);
      businessObject.errorOverlay = undefined;
    }
  }

  doThings() {
    const elementRegistry = this.bpmn.getElementRegistry();
    const modeling = this.bpmn.getModeling();
    const canvas = this.bpmn.getCanvas();
    elementRegistry.forEach((element, gfx) => {
      if (is(element, 'bpmn:Task')) {
        modeling.setColor(element, { stroke: '#0B6B6F', fill: '#94d4d6' });
      }
    });

    this.bpmn.addNoteOverlay('SCAN_OK', 'Mixed up the labels?');
  }

  ngAfterContentInit(): void {
    this.bpmn.attachTo(this.canvasEl.nativeElement);
    this.bpmn.getPropertiesPanel().attachTo(this.propertiesEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.bpmn.destroy();
  }

  createDiagram(): void {
    this.bpmn.createDiagram();
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
