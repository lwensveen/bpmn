import { Injectable } from '@angular/core';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';



@Injectable({
  providedIn: 'root',
})
export class OverlaysService {

  constructor() {

  }

  addOverlays(diagram: any, canvas: undefined) {
    console.log('diagram', diagram)
    console.log('canvas', canvas)

    const bpmnViewer = new BpmnViewer({
      container: canvas,
      /* uncomment to configure defaults for all overlays
      overlays: {
        defaults: {
          show: { minZoom: 1 },
          scale: true
        }
      }
      */
    });

    bpmnViewer.importXML(diagram).then(function() {

      var canvas = bpmnViewer.get('canvas'),
        overlays = bpmnViewer.get('overlays');

      console.log('canvas', canvas)
      console.log('overlays', overlays)

      // zoom to fit full viewport
      canvas.zoom('fit-viewport');

      // attach an overlay to a node
      overlays.add('SCAN_OK', 'note', {
        position: {
          bottom: 0,
          right: 0,
        },
        html: '<div class="diagram-note">Mixed up the labels?</div>',
      });

      // // configure scale=false to use non-scaling overlays
      // overlays.add('START_PROCESS', 'note', {
      //   position: {
      //     bottom: 0,
      //     right: 0,
      //   },
      //   scale: false,
      //   html: '<div class="diagram-note">I don\'t scale</div>',
      // });
      //
      // // configure scale={ min: 1 } to use non-shrinking overlays
      // overlays.add('SCAN_QR_CODE', 'note', {
      //   position: {
      //     bottom: 0,
      //     right: 0,
      //   },
      //   scale: { min: 1 },
      //   html: '<div class="diagram-note">I don\'t shrink beyond 100%</div>',
      // });
      //
      // // configure show={ minZoom: 0.6 } to hide overlays at low zoom levels
      // overlays.add('END_PROCESS', 'note', {
      //   position: {
      //     bottom: 0,
      //     right: 0,
      //   },
      //   show: {
      //     minZoom: 0.7,
      //   },
      //   html: '<div class="diagram-note">I hide at low zoom levels</div>',
      // });

    }).catch(function(err: any) {

      console.error('could not import BPMN 2.0 diagram', err);
    });
  }
}
