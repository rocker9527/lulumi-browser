import { ipcRenderer } from 'electron';
import fs from'fs';
import path from 'path';

import apiFactory, { initializeExtensionApi } from './api-factory';

export default class ExtHostExtensionService {
  constructor(VueInstance) {
    this.ready = false;
    this.instance = VueInstance;
    VueInstance.$electron.ipcRenderer.once('response-extension-objects', (event, manifestMap, manifestNameMap, backgroundPages) => {
      if (Object.keys(manifestMap) !== 0) {
        initializeExtensionApi(apiFactory(VueInstance)).then((restoreOriginalModuleLoader) => {
          if (restoreOriginalModuleLoader) {
            this._triggerOnReady();
            this.manifestMap = manifestMap;
            this.manifestNameMap = manifestNameMap;
            this.backgroundPages = backgroundPages;
            this._register();
          }
        });
      }
    });
    VueInstance.$electron.ipcRenderer.send('request-extension-objects');
  }

  _triggerOnReady() {
    this.ready = true;
  }

  _register() {
    const ipc = ipcRenderer;
    const vue = this.instance;
    ipc.on('lulumi-env-app-name', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-env-app-name-result', require('lulumi').env.appName());
      }
    });
    ipc.on('lulumi-env-app-version', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-env-app-version-result', require('lulumi').env.appVersion());
      }
    });

    ipc.on('lulumi-tabs-get', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-get-result', require('lulumi').tabs.get(data.tabId));
      }
    });
    ipc.on('lulumi-tabs-get-current', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-get-current-result', require('lulumi').tabs.getCurrent());
      }
    });
    ipc.on('lulumi-tabs-duplicate', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-duplicate-result', require('lulumi').tabs.duplicate(data.tabId));
      }
    });
    ipc.on('lulumi-tabs-query', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-query-result', require('lulumi').tabs.query(data.queryInfo));
      }
    });
    ipc.on('lulumi-tabs-update', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-update-result', require('lulumi').tabs.update(data.tabId, data.updateProperties));
      }
    });
    ipc.on('lulumi-tabs-reload', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-reload-result', require('lulumi').tabs.reload(data.tabId, data.reloadProperties));
      }
    });
    ipc.on('lulumi-tabs-remove', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-remove-result', require('lulumi').tabs.remove(data.tabIds));
      }
    });
    ipc.on('lulumi-tabs-detect-language', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        require('lulumi').tabs.detectLanguage(data.tabId, data.webContentsId);
      }
    });
    ipc.on('lulumi-tabs-detect-language-result', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-detect-language-result', data.value);
      }
    });
    ipc.on('lulumi-tabs-execute-script', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-execute-script-result', require('lulumi').tabs.executeScript(data.tabId, data.details));
      }
    });
    ipc.on('lulumi-tabs-insert-css', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-insert-css-result', require('lulumi').tabs.insertCSS(data.tabId, data.details));
      }
    });
    ipc.on('lulumi-runtime-send-message', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        require('lulumi').runtime.sendMessage(data.extensionId, data.message, data.options);
      }
    });
    ipc.on('lulumi-runtime-add-listener-on-message', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        const wrapper = function (...args) {
          webContents.send(`lulumi-runtime-add-listener-on-message-result-${data.digest}`, args);
        };
        require('lulumi').runtime.onMessage(data.webContentsId).addListener(wrapper);
      }
    });
    ipc.on('lulumi-runtime-remove-listener-on-message', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        const wrapper = function (...args) {
          webContents.send(`lulumi-runtime-add-listener-on-message-result-${data.digest}`, args);
        };
        require('lulumi').runtime.onMessage(data.webContentsId).removeListener(wrapper);
      }
    });
    ipc.on('lulumi-runtime-emit-on-message', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        require('lulumi').runtime.onMessage(data.webContentsId).emit(data.message, data.sender);
      }
    });
    ipc.on('lulumi-tabs-send-message', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        webContents.send('lulumi-tabs-send-message-result', require('lulumi').tabs.sendMessage(data.tabId, data.message));
      }
    });
    ipc.on('lulumi-tabs-add-listener-on-updated', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        const wrapper = function (...args) {
          webContents.send(`lulumi-tabs-add-listener-on-updated-result-${data.digest}`, args);
        };
        require('lulumi').tabs.onUpdated.addListener(wrapper);
      }
    });
    ipc.on('lulumi-tabs-remove-listener-on-updated', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        const wrapper = function (...args) {
          webContents.send(`lulumi-tabs-add-listener-on-updated-result-${data.digest}`, args);
        };
        require('lulumi').tabs.onUpdated.removeListener(wrapper);
      }
    });
    ipc.on('lulumi-tabs-emit-on-updated', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        require('lulumi').tabs.onUpdated.emit(data.args);
      }
    });
    ipc.on('lulumi-tabs-add-listener-on-created', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        const wrapper = function (...args) {
          webContents.send(`lulumi-tabs-add-listener-on-created-result-${data.digest}`, args);
        };
        require('lulumi').tabs.onCreated.addListener(wrapper);
      }
    });
    ipc.on('lulumi-tabs-remove-listener-on-created', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        const wrapper = function (...args) {
          webContents.send(`lulumi-tabs-add-listener-on-created-result-${data.digest}`, args);
        };
        require('lulumi').tabs.onCreated.removeListener(wrapper);
      }
    });
    ipc.on('lulumi-tabs-emit-on-created', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        require('lulumi').tabs.onCreated.emit(data.args);
      }
    });
    ipc.on('lulumi-tabs-add-listener-on-removed', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        const wrapper = function (...args) {
          webContents.send(`lulumi-tabs-add-listener-on-removed-result-${data.digest}`, args);
        };
        require('lulumi').tabs.onRemoved.addListener(wrapper);
      }
    });
    ipc.on('lulumi-tabs-remove-listener-on-removed', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        const wrapper = function (...args) {
          webContents.send(`lulumi-tabs-add-listener-on-removed-result-${data.digest}`, args);
        };
        require('lulumi').tabs.onRemoved.removeListener(wrapper);
      }
    });
    ipc.on('lulumi-tabs-emit-on-removed', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        require('lulumi').tabs.onRemoved.emit(data.args);
      }
    });

    ipc.on('lulumi-storage-add-listener-on-changed', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        const wrapper = function (...args) {
          webContents.send(`lulumi-storage-add-listener-on-changed-result-${data.digest}`, args);
        };
        require('lulumi').storage.onChanged.addListener(wrapper);
      }
    });
    ipc.on('lulumi-storage-remove-listener-on-changed', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        const webContents = vue.$electron.remote.webContents.fromId(data.webContentsId);
        const wrapper = function (...args) {
          webContents.send(`lulumi-storage-add-listener-on-changed-result-${data.digest}`, args);
        };
        require('lulumi').storage.onChanged.removeListener(wrapper);
      }
    });
    ipc.on('lulumi-storage-emit-on-changed', (event, data) => {
      if (vue.$electron.remote.webContents.fromId(data.webContentsId)) {
        require('lulumi').storage.onChanged.emit(data.args);
      }
    });
  }
};