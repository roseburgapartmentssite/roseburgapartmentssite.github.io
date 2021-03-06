String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
}


//This prototype is provided by the Mozilla foundation and
//is distributed under the MIT license.
//http://www.ibiblio.org/pub/Linux/LICENSES/mit.license
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
          this[from] === elt)
                return from;
        }
        return -1;
    };
}

Array.prototype.unique = function() {
    var a = [];
    for (var i = 0; i < this.length; i++) {
        if (a.indexOf(this[i]) < 0) { a.push(this[i]); }
    }
    return a;
};
