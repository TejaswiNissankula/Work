import { createElement } from '@lwc/engine-dom';
import MyEventTesting from 'c/myEventTesting';

describe('Event testing Suite', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    beforeEach(()=>{
        const domElement = createElement('c-my-event-testing',{ is:MyEventTesting});
        document.body.appendChild(domElement);
       
    })

    it('c-my-event-testing greeting to be Hello World!', () => {
        const element = document.querySelector('c-my-event-testing');
        const pElement = element.shadowRoot.querySelector('p');
        expect(pElement.textContent).toBe('Hello World!');
    });

    it('c-my-event-testing greeting to not be Hello World!', () => {
        const element = document.querySelector('c-my-event-testing');
        const pElement = element.shadowRoot.querySelector('p');
        expect(pElement.textContent).not.toBe('Hello Salesforce!');
    });

     it('c-my-event-testing greeting to be dynamic value!', () => {
        const element = document.querySelector('c-my-event-testing');
        const lightningElement = element.shadowRoot.querySelector('lightning-input');
        lightningElement.value ='Tejaswi!'
        lightningElement.dispatchEvent(new CustomEvent('change'));

        return Promise.resolve().then(()=>{
            const pElement = element.shadowRoot.querySelector('p');
            expect(pElement.textContent).toBe('Hello Tejaswi!');
        })
        
    });
});