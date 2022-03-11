// Internal Dependencies
import modules from './modules';

jquery(window).on('et_builder_api_ready', (event, API) => {
  // alert("124");
 API.registerModules(modules);
});
