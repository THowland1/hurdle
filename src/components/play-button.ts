import { CustomElement } from '../decorators/custom-element';

const template = /*html*/ `    
<button>Play</button>`;

const style = /* css */ `
:host {
    --hello: 40px;
}
#outer {
    width: 100px;
    height: 30px;
    background-color: red;
}
#inner {
    width: var(--hello);
    height: 30px;
    background-color: blue;
    transition: width .3s;
}`;

const observedAttributes = ['progress', 'for', 'playing'] as const;

function attributeGet(name: string) {
  return;
}

type AttributeRecord = {
  get(): string | null;
  set(value: string | null): void;
};
type AttributeMap<TNames extends readonly string[]> = {
  [key in TNames[number]]: AttributeRecord;
};

function buildAttributeMap<TNames extends readonly string[]>(
  el: HTMLElement,
  qualifiedNames: TNames
) {
  const entries = qualifiedNames.map(
    (name) => [name, buildAttributeRecord(el, name)] as const
  );
  return Object.fromEntries(entries) as AttributeMap<TNames>;
}

function buildAttributeRecord(
  el: HTMLElement,
  qualifiedName: string
): AttributeRecord {
  return {
    get(): string | null {
      return el.getAttribute(qualifiedName);
    },
    set(value: string | null) {
      if (value) {
        el.setAttribute(qualifiedName, value);
      } else {
        el.removeAttribute(qualifiedName);
      }
    },
  };
}

class CustomHTMLElement<TAttributes extends string[]> extends HTMLElement {
  // constructor(attributes: TAttributes[]) {
  //   super();
  // }
  // customAttributes = {
  //   get ty() {},
  // };
  // get boo() {
  //   this.getno
  //   return this.();
  // }
  // set boo(value: string) {
  //   this.getAttributeNode('boo', value);
  // }
}

@CustomElement({
  selector: 'app-play-button',
  template,
  style,
  useShadow: true,
})
export class ProgressBarElement extends CustomHTMLElement<any> {
  private audioElement: HTMLAudioElement;
  private get button() {
    return this.shadowRoot!.querySelector('button')!;
  }

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
    this.audioElement.addEventListener('play', () => {
      this.observedAttributeMap.playing.set('true');
    });
    this.audioElement.addEventListener('pause', () => {
      this.observedAttributeMap.playing.set('false');
    });

    this.addEventListener('click', () => {
      const playing = this.observedAttributeMap.playing;
      if (playing.get() === 'true') {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } else {
        this.audioElement.play();
      }
    });

    // this.moo = this.attributes.getNamedItem('playing')  ??
  }

  observedAttributeMap = buildAttributeMap(this, observedAttributes);

  static get observedAttributes() {
    return observedAttributes;
  }

  attributeChangedCallback(
    name: typeof observedAttributes[number],
    oldValue: string,
    newValue: string
  ) {
    switch (name) {
      case 'playing':
        if (newValue === 'true') {
          this.button.innerHTML = 'Pause';
        } else {
          this.button.innerHTML = 'Play';
        }

        break;

      default:
        break;
    }
  }
}
// customElements.define('app-progress-bar', ProgressBarElement);
