import { CustomElement } from '../decorators/custom-element';

const template = /*html*/ `    
<div id="outer">
    <div data-duration="1"></div>
    <div data-duration="2"></div>

    <div id="inner"></div>
</div>
<div id="currentTime"></div>
<div id="duration"></div>`;

const style = /* css */ `
:host {
    --hello: 40px;
}
#outer {
    width: 100px;
    height: 30px;
    background-color: red;
    position: relative;
}
#inner {
    width: var(--hello);
    height: 30px;
    background-color: blue;
    transition: width .3s;
}
[data-duration="1"] {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: calc(1/16);
    background-color: '#0002';
}
`;

const observedAttributes = ['progress', 'for'] as const;
@CustomElement({
  selector: 'app-progress-bar',
  template,
  style,
  useShadow: true,
})
export class ProgressBarElement extends HTMLElement {
  private audioElement: HTMLAudioElement;

  constructor() {
    super();
    const audioElement = document.getElementById(
      this.getAttribute('for') || ''
    );
    if (!(audioElement instanceof HTMLAudioElement)) {
      throw new Error(
        "Must contain 'for' attribute with ID of an audio element"
      );
    }
    this.audioElement = audioElement;
    setInterval(() => {
      this.progress = String(
        this.audioElement.currentTime / this.audioElement.duration
      );
      this.currentTime.innerHTML = String(this.audioElement.currentTime);
      this.duration.innerHTML = String(this.audioElement.duration);
    }, 100);
  }
  get progress() {
    return this.getAttribute('progress');
  }
  set progress(value: string | null) {
    if (typeof value === 'string') {
      this.setAttribute('progress', value);
    } else {
      this.removeAttribute('progress');
    }
  }
  get inner() {
    return this.shadowRoot!.querySelector('#inner') as HTMLDivElement;
  }
  get outer() {
    return this.shadowRoot!.querySelector('#outer') as HTMLDivElement;
  }
  get currentTime() {
    return this.shadowRoot!.querySelector('#currentTime') as HTMLDivElement;
  }
  get duration() {
    return this.shadowRoot!.querySelector('#duration') as HTMLDivElement;
  }
  static get observedAttributes() {
    return observedAttributes;
  }

  attributeChangedCallback(
    name: typeof observedAttributes[number],
    oldValue: string,
    newValue: string
  ) {
    switch (name) {
      case 'progress':
        this.inner.style.width = `${Number(newValue) * 100}%`;
        break;

      default:
        break;
    }
  }
}
// customElements.define('app-progress-bar', ProgressBarElement);
