try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap-sass');
} catch (e) {}

require('bootstrap-sass');

require('metismenu');

require('bootstrap-datepicker');

require('bootstrap-filestyle');

require('./plugins/bootstrap-timepicker'); //fetch from plugin folder

require('datatables.net');

require('./plugins/bootstrap-tagsinput');

window.Typeahead = require('typeahead');
