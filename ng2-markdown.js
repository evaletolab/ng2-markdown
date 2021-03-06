import { Directive, Inject, ElementRef } from 'angular2/core';
import { HTTP_PROVIDERS, Http } from 'angular2/http';

// external
import Showdown from 'showdown';
import { Prism } from 'prism';
import 'prism/themes/prism-okaidia.css!css';

//@Directive({
@Directive({
  selector: 'ng2-markdown',
  inputs: [ 'src', 'data' ],
  providers: [ HTTP_PROVIDERS ]
})
export class MarkdownComponent {
  constructor (@Inject(ElementRef) elementRef, @Inject(Http) http) {
    // used for http requests
    this.http = http;
    // reference to the DOM element
    this.element = elementRef.nativeElement;
  }

  ngOnInit () {
    // element with 'src' attribute set
    if (this.src) {
      this.fromFile(this.src);
    }
    // element with 'data' attribute set
    if (this.data) {
      this.fromData(this.data);
    }
    // element containing markdown
    if (!this.src) {
      this.fromRAW();
    }
  }

  fromFile(src) {
    this.http.get(src).toPromise()
    .then((res) => {
       return this.prepare(res._body);
    })
    .then((markdown) => {
      return this.process(markdown);
    })
    .then((html) => {
      this.element.innerHTML = html;
      this.highlight(html);
    })
  }

  fromData(data) {
    let raw = data;
    let html = this.process(this.prepare(raw));
    this.element.innerHTML = html;
    this.highlight(html);
  }

  fromRAW() {
    let raw = this.element.innerHTML;
    let html = this.process(this.prepare(raw));
    this.element.innerHTML = html;
    this.highlight(html);
  }

  prepare(raw) {
    return raw.split('\n').map((line) => line.trim()).join('\n')
  }

  process(markdown) {
    let converter = new Showdown.converter();
    return converter.makeHtml(markdown)
  }

  highlight(html){
    Prism.highlightAll();
  }
}
