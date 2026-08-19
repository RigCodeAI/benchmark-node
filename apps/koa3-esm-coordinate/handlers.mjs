import * as vm from "node:vm";

export async function evaluateInput(context) {
  try {
    context.body = String(vm.runInNewContext(context.query.input));
  } catch {
    context.status = 400;
    context.body = "invalid expression";
  }
}
