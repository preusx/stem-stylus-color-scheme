var su = require('stylus').utils,
    n = require('stylus/lib/nodes'),
    sf = require('stylus').functions;

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

    var cs = function(color, ratio, ratio2) {
      var c = storage.get('stem-cs__config'),
          f = this.functions;

      if(color.nodeName == 'string' || color.nodeName == 'literal' || color.nodeName == 'ident') {
        return cs.call(this, c[color.string], ratio, ratio2);
      }

      if(u.noNull(ratio2)) {
        return cs.call(this, cs.call(this, color, ratio), ratio2);
      }

      if(ratio.nodeName == 'unit') {
        if(ratio.val == 0) {
          return fs.rgba.call(this, color, new Unit(1));
        } else {
          ratio2 = ratio;
          ratio = (ratio.val > 0 ? c.factor.darker : c.factor.lighten)
          ratio.val *= f['to-raw-pct'].call(this, ratio2).val * 100;
          ratio.type = '%';

          return fs.darken.call(this, color, ratio);
        }
      }

      return color;
    };

    style.define('cs', cs);
  };
};
