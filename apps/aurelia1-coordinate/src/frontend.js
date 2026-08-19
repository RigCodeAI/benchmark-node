import { Aurelia } from "aurelia-framework";
import { Loader } from "aurelia-loader";
import { initialize } from "aurelia-pal-browser";

initialize();
const framework = new Aurelia(new Loader());
framework.version = "1.4.1";
window.aurelia = { framework, version: "1.4.1" };

document.querySelector("#submit").addEventListener("click", async () => {
  const value = document.querySelector("#expression").value;
  const response = await fetch(`/evaluate?input=${encodeURIComponent(value)}`);
  document.querySelector("#result").textContent = await response.text();
});
