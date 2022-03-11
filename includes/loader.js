// External Dependencies
import jQuery from 'jquery'

// Internal Dependencies
import modules from './modules';

jQuery(window).on('et_builder_api_ready', (event, API) => {
  // alert("124");
 API.registerModules(modules);
});
