// apply vue-material stuff
Vue.use(VueMaterial);

const makeDatasource = (data, tag) => `<${tag.toUpperCase()}>
<ID>${data.id}</ID>
<ENDPOINT>${data.endpoint}</ENDPOINT>
<VAR>${data.var}</VAR>
<PAGESIZE>${data.pagesize}</PAGESIZE>
<RESTRICTION>${data.restriction}</RESTRICTION>
<TYPE>${data.type}</TYPE>
${data.properties.map(p => `<PROPERTY>${p}</PROPERTY>`).join('\n')}
</${tag.toUpperCase()}>
`;

const makeAccReview = (data, tag) => `<${tag.toUpperCase()}>
<THRESHOLD>${data.threshold}</THRESHOLD>
<FILE>${data.file}</FILE>
<RELATION>${data.relation}</RELATION>
</${tag.toUpperCase()}>
`;

// init the app
let app = new Vue({
  el: '#app',
  template: '#mainApp',
  data: {
    // config display
    display: false,
    configText: '',
    // config
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
    metrics: ['trigrams(y.dc:title, x.linkedct:condition_name)'],
    acceptance: {
      threshold: 0.98,
      file: 'accepted.nt',
      relation: 'owl:sameAs',
    },
    review: {
      threshold: 0.95,
      file: 'reviewme.nt',
      relation: 'owl:sameAs',
    },
    mlalgorithm: {
      enabled: false,
      name: 'simple ml',
      type: 'supervised batch',
      training: 'trainingData.nt',
      parameters: [
        {
          name: 'max execution time in minutes',
          value: 60,
        },
      ],
    },
    execution: {
      rewriter: 'DEFAULT',
      planner: 'DEFAULT',
      engine: 'DEFAULT',
    },
    output: 'TAB',
  },
  methods: {
    generateConfig() {
      const configHeader = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE LIMES SYSTEM "limes.dtd">
<LIMES>
`;
      const configFooter = `</LIMES>`;

      const prefixes = this.prefixes
        .map(
          p => `<PREFIX>
  <NAMESPACE>${p.namespace}</NAMESPACE>
  <LABEL>${p.label}</LABEL>
</PREFIX>
`
        )
        .join('');

      const src = makeDatasource(this.source, 'SOURCE');
      const target = makeDatasource(this.target, 'TARGET');

      const metrics = this.metrics
        .map(
          m => `<METRIC>
  ${m}
</METRIC>
`
        )
        .join('');

      const acceptance = makeAccReview(this.acceptance, 'ACCEPTANCE');
      const review = makeAccReview(this.review, 'REVIEW');

      const ml = this.mlalgorithm.enabled
        ? `<MLALGORITHM>
  <NAME>${this.mlalgorithm.name}</NAME>
  <TYPE>${this.mlalgorithm.type}</TYPE>
  <TRAINING>${this.mlalgorithm.training}</TRAINING>
  ${this.mlalgorithm.parameters
    .map(
      p => `<PARAMETER>
  <NAME>${p.name}</NAME>
  <VALUE>${p.value}</VALUE>
</PARAMETER>`
    )
    .join('\n  ')}
</MLALGORITHM>
`
        : '';

      const execution = `<EXECUTION>
  <REWRITER>${this.execution.rewriter}</REWRITER>
  <PLANNER>${this.execution.planner}</PLANNER>
  <ENGINE>${this.execution.engine}</ENGINE>
</EXECUTION>
`;

      const output = `<OUTPUT>${this.output}</OUTPUT>
`;

      const config =
        configHeader + prefixes + src + target + metrics + acceptance + review + ml + execution + output + configFooter;
      return config;
    },
    showConfig() {
      this.configText = this.generateConfig();
      this.$refs.configDialog.open();
      // syntax highlight for xml
      setTimeout(() => hljs.highlightBlock(document.getElementsByTagName('code')[0]));
    },
    closeConfig() {
      this.$refs.configDialog.close();
    },
    execute() {
      const config = this.generateConfig();
      const configBlob = new Blob([config], {type: 'text/plain'});
      const fd = new FormData();
      fd.append('fileupload', configBlob, 'config.xml');
      fetch('http://localhost:1337/http://localhost:8080/execute', {
        method: 'post',
        body: fd,
      })
        .then(r => r.text())
        .then(r => {
          console.log(r);
        });
    },
  },
});
