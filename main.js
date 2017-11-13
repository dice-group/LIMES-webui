// apply vue-material stuff
Vue.use(VueMaterial);

// Define a new component for prefixes
Vue.component('prefixes-list', {
  template: '#prefixComponent',
  props: ['prefixes'],
  data() {
    return {
      label: '',
      namespace: '',
    };
  },
  methods: {
    deleteChip(prefix) {
      this.prefixes = this.prefixes.filter(p => p.label !== prefix.label && p.namespace !== prefix.namespace);
    },
    add() {
      // push new prefix
      this.prefixes.push({
        label: this.label,
        namespace: this.namespace,
      });
      // cleanup
      this.namespace = '';
      this.label = '';
    },
  },
});

// init the app
let app = new Vue({
  el: '#app',
  template: '#mainApp',
  data: {
    prefixes: [],
  },
  methods: {
    execute() {
      const configHeader = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE LIMES SYSTEM "limes.dtd">
<LIMES>
`;
      const configFooter = `</LIMES>`;

      const prefixes = this.prefixes.map(
        p => `<PREFIX>
  <NAMESPACE>${p.namespace}</NAMESPACE>
  <LABEL>${p.label}</LABEL>
</PREFIX>
`
      );

      const config = configHeader + prefixes.join('') + configFooter;
      console.log(config);
    },
  },
});
