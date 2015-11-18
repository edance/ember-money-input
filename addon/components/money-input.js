import Ember from 'ember';
import layout from '../templates/components/money-input';

export default Ember.TextField.extend({
  layout: layout,
  keyPress(e) {
    var code = e.keyCode, str = this.get("value") || "";

    str += String.fromCharCode(code);
    if (!str.match(/^[\$\,\d\.]*$/)) {
      e.preventDefault();
    }
    var split = str.split(".");
    if (split.length > 2) {
      e.preventDefault();
    }
    if (split.length === 2 && split[1].length > 2) {
      e.preventDefault();
    }
  },
  amountDidChange: Ember.observer("amount", function() {
    var amount = this.get("amount"),
        value = "" + this.get("value");

    if (Ember.isEmpty(amount) && Ember.isEmpty(value)) {
      return;
    }
    if (amount === value.replace(/[^\d\.]/g, "")) {
      return;
    }
    this.set("value", amount)
  }),
  valueDidChange: Ember.observer("value", function() {
    var amount, value;
    value = "" + this.get("value");

    // Remove all non numberic characters
    amount = value.replace(/[^\d\.]/g, "");

    // Insert commas to standardize money
    value = amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

    // Insert a dollar sign in front
    if (value.length) {
      value = "$" + value;
    }
    this.set("value", value);
    if (Ember.isEmpty(value)) {
      return this.set("amount", null);
    } else {
      return this.set("amount", parseFloat(amount));
    }
  })
});
