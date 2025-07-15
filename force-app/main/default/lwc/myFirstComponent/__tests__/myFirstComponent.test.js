import { createElement } from '@lwc/engine-dom';
import myFirstComponent from 'c/myFirstComponent';

describe('c-my-first-component', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('Display first div', () => {
        // Arrange
        const element = createElement('c-my-first-component', {
            is: myFirstComponent
        });

        // Act
        document.body.appendChild(element);

        // Assert
        const firstDiv = element.shadowRoot.querySelector('div.first');
        expect(firstDiv.textContent).toBe('Hello World!');
    });

    test('Display second div',()=>{
        const element = createElement('c-my-first-component',{
            is:myFirstComponent
        });
        document.body.appendChild(element);
        const secondDiv = element.shadowRoot.querySelector('div.second');
        expect(secondDiv.textContent).toBe('My World!')
    })
});