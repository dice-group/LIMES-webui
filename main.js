// apply vue-material stuff
Vue.use(VueMaterial);

const makeDatasource = (data, tag) => `<${tag.toUpperCase()}>
<ID>${data.id}</ID>
<ENDPOINT>${data.endpoint}</ENDPOINT>
<VAR>${data.var}</VAR>
<PAGESIZE>${data.pagesize}</PAGESIZE>
<RESTRICTION>${data.restriction}</RESTRICTION>
<TYPE>${data.type}</TYPE>
${data.properties.map(p => `<PROPERTY>${p}</PROPERTY>`)}
</${tag.toUpperCase()}>
`;

// init the app
let app = new Vue({
  el: '#app',
  template: '#mainApp',
  data: {
    prefixes: [],
    source: {
      id: 'sourceId',
      endpoint: 'http://source.endpoint.com/sparql',
      var: '?src',
      pagesize: 1000,
      restriction: '?src rdf:type some:Type',
      type: 'sparql',
      properties: ['dc:title AS lowercase RENAME name'],
    },
    target: {
      id: 'targetId',
      endpoint: 'http://target.endpoint.com/sparql',
      var: '?target',
      pagesize: 1000,
      restriction: '?target rdf:type other:Type',
      type: 'sparql',
      properties: ['foaf:name AS lowercase RENAME name'],
    },
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

      const src = makeDatasource(this.source, 'SOURCE');
      const target = makeDatasource(this.target, 'TARGET');

      const config = configHeader + prefixes.join('') + src + target + configFooter;
      console.log(config);
    },
  },
});
