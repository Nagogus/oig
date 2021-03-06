var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {

    /**
     *
     * will decode html like into a textarea
     *
     * @param {String} html
     * @returns {String}
     */
    function decodeHtml(html) {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    }

    var TemplateElement = {
      /**
       */
      attachedCallback: {
        value: function () {

          oig.ContextElement.prototype.attachedCallback.call(this);
          this.update();
        }
      },
      update: {
        value: function () {

          console.log('Updating template element', this);

          var templateElement = this.firstElementChild,
            nextSibling,
            dataContext = this.dataContext,
            templateEngine,
            template,
            html;
          if (!(templateElement instanceof HTMLTemplateElement)) {
            throw '[oig:templateelement] first element needs to be a template element';
          }

          if (this.dataset.oigTemplateengine) {
            templateEngine = oig.templateEngines[this.dataset.oigTemplateengine];
          } else {
            templateEngine = oig.templateEngines.default;
          }
          if (!templateEngine) {
            throw '[oig:templateelement] no templateengine found';
          }
          template = decodeHtml(new XMLSerializer().serializeToString(templateElement.content, 'text/html'));
          html = templateEngine.compile(template, dataContext);

          // remove any previous rendered content
          while ((nextSibling = templateElement.nextSibling) !== null) {
            this.removeChild(templateElement.nextSibling);
          }

          this.insertAdjacentHTML('beforeend', html);
        }
      }
    };
    /**
     * registration
     */
    elements.TemplateElement = document.registerElement('oig-template', {
      prototype: Object.create(oig.ContextElement.prototype, TemplateElement),
      extends : 'div'
    });
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start*/(oig || (oig = {})/* jshint ignore:end */);
