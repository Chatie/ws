/**
 * WebSockets with Angular2 and RxJS - https://medium.com/@lwojciechowski/websockets-with-angular2-and-rxjs-8b6c5be02fac)
 */
import { Observable } from 'rxjs/Observable'
import { Observer }   from "rxjs/Observer"
import { Subject }    from 'rxjs/Subject'

export class Client {
	private subject: Subject<any>;

  constructor() {

  }

	public connect(url: string): Subject<any> {
		if (!this.subject) {
			this.subject = this.create(url);
		}
		return this.subject;
	}

	private create(url: string): Subject<any> {
		let ws = new WebSocket(url);

		let observable = Observable.create(
			(obs: Observer<any>) => {
				ws.onmessage = obs.next.bind(obs);
				ws.onerror   = obs.error.bind(obs);
				ws.onclose   = obs.complete.bind(obs);

				return ws.close.bind(ws);
			});

		let observer = {
			next: (data: Object) => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
				} else {
          console.warn('websocket not ready. readyState = ' + ws.readyState)
        }
			}
		};

		return Subject.create(observer, observable);
	}

}

export default Client