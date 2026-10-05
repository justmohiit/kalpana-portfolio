const OHIO_LIBRARY_SOURCE = 'ohio';

jQuery( window ).on('ui/frontend/init', () => {
  if (!window.uiFrontend || !uiFrontend.isEditMode()) {
    return;
  }

  ui.templates.component.addTab('templates/ohio', { title: 'Ohio Blocks', getFilter: () => ({ type: 'block', source: OHIO_LIBRARY_SOURCE}) });

  ui.hooks.addFilter(
    'templates/source/is-remote',
    function(isRemote, activeSource) {
      if (activeSource !== OHIO_LIBRARY_SOURCE) {
        return isRemote;
      }

      let isInsert = false;
      try {
        throw new Error('');
      } catch(e) {
        isInsert = e.stack.includes('onInsertButtonClick');
      }

      if (!isInsert) {
        setTimeout( () => {
          const view =
            ui.templates.layout?.modalContent?.currentView;

          if ( 'function' === typeof view?.setFiltersUI ) {
            view.setFiltersUI();
          }
        } );

        return true;
      }

      return isRemote;
    }
  );

  ui.hooks.addFilter(
    'ui/editor/template-library/template/classes',
    function(classes, viewInstance) {
      const source = viewInstance.model.get('source');

      if (source === OHIO_LIBRARY_SOURCE) {
        classes += ' ui-template-library-template-remote';
      }

      return classes;
    }
  )

  ui.templates.getFilter = new Proxy(ui.templates.getFilter, {
    apply(target, thisArg, args) {
      if (thisArg && thisArg.component && thisArg.component.currentTab === 'templates/ohio') {
        try {
          throw new Error('');
        } catch (e) {
          if (e.stack.includes('onRenderCollection')) {
            return 'remote';
          }
        }
      }

      return Reflect.apply(target, thisArg, args);
    }
  })

  ui.hooks.addFilter(
    'ui/editor/template-library/template/action-button',
    function ( viewId, templateData ) {
      if ( templateData && templateData.source === OHIO_LIBRARY_SOURCE && templateData.licenseType === 'envato' ) {
        return '#tmpl-ohio-source-promo-button';
      }

      return viewId;
    }
  );
});
