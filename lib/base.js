var su = require('stylus').utils,
    n = require('stylus/lib/nodes');

module.exports = function() {
  return function(style) {
    var u = style.options.extensions.utils,
        storage = style.options.extensions.storage;

    storage.set('stem-cs__config', {});

    style.define('cs-config', function(hash) {
      var data = u.merge(storage.get('stem-cs__config'), u.toJS(hash)),
          f = this.functions;

      storage.set('stem-cs__config', data);

      var coercedData = new n.Expression();
      coercedData.push(su.coerce(data, true));
      f.reassign.call(this, new n.String('CS'), coercedData);

      if(this.return) {
        return coercedData;
      }
    });

    var cs = function(color) {
      var c = storage.get('stem-cs__config'),
          f = this.functions;

      if(color.nodeName == 'string' || color.nodeName == 'literal' || color.nodeName == 'ident') {
        return cs.call(this, c[color.string]);
      }

      return color;
    };

    style.define('cs', cs);
  };
};
