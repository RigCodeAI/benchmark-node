import { Aurelia, CustomElement } from "aurelia";

window.Aurelia = Object.assign(Aurelia, { version: "2.0.0-rc.2" });

const Application = CustomElement.define(
  {
    name: "app-root",
    template: `<main au-started>
      <label>Expression <input id="expression" value.bind="expression"></label>
      <button id="submit" click.trigger="submit()">Evaluate</button>
      <output id="result" textcontent.bind="result"></output>
    </main>`,
  },
  class {
    expression = "";
    result = "";

    async submit() {
      const response = await fetch(`/evaluate?input=${encodeURIComponent(this.expression)}`);
      this.result = await response.text();
    }
  },
);

Aurelia.app({
  component: Application,
  host: document.querySelector("app-root"),
}).start();
