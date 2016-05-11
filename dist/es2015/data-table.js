var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { bindable, inject, computedFrom, customElement } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Statham } from 'json-statham';

export let DataTable = (_dec = customElement('data-table'), _dec2 = inject(Router, Element), _dec3 = computedFrom('columns'), _dec(_class = _dec2(_class = (_class2 = class DataTable {

  constructor(Router, element) {
    _initDefineProp(this, 'repository', _descriptor, this);

    _initDefineProp(this, 'columns', _descriptor2, this);

    _initDefineProp(this, 'defaultColumn', _descriptor3, this);

    _initDefineProp(this, 'searchable', _descriptor4, this);

    _initDefineProp(this, 'sortable', _descriptor5, this);

    _initDefineProp(this, 'update', _descriptor6, this);

    _initDefineProp(this, 'destroy', _descriptor7, this);

    _initDefineProp(this, 'select', _descriptor8, this);

    _initDefineProp(this, 'data', _descriptor9, this);

    _initDefineProp(this, 'route', _descriptor10, this);

    this.count = 0;
    this.columnsArray = [];
    this.sortingCriteria = {};
    this.searchCriteria = {};

    this.router = Router;
    this.element = element;
  }

  attached() {
    return this.load();
  }

  load() {
    this.updateRecordCount();
    let criteria = this.buildCriteria();
    this.repository.find(criteria, true).then(result => {
      this.data = result;
    }).catch(error => {
      console.error('Something went wrong.', error);
    });
  }

  buildCriteria() {
    let criteria = {};

    if (this.searchable !== null && Object.keys(this.searchCriteria).length) {
      let propertyName = Object.keys(this.searchCriteria)[0];
      if (this.searchCriteria[propertyName]) {
        criteria['where'] = {};
        criteria['where'][propertyName] = {};
        criteria['where'][propertyName]['contains'] = this.searchCriteria[propertyName];
      }
    }
    if (this.sortable !== null && Object.keys(this.sortingCriteria).length) {
      let propertyName = Object.keys(this.sortingCriteria)[0];
      if (this.sortingCriteria[propertyName]) {
        criteria['sort'] = propertyName + ' ' + this.sortingCriteria[propertyName];
      }
    }
    return criteria;
  }

  populate(row) {
    return this.repository.getPopulatedEntity(row);
  }

  doDelete(row) {
    if (typeof this.delete === 'function') {
      return this.delete(this.populate(row));
    }

    this.populate(row).destroy().then(ah => {
      this.load();
      this.triggerEvent('deleted', row);
    }).catch(error => {
      this.triggerEvent('exception', { on: 'delete', error: error });
    });
  }

  doUpdate(row) {
    if (typeof this.update === 'function') {
      return this.update(this.populate(row));
    }

    this.populate(row).update().then(() => {
      this.load();
      this.triggerEvent('updated', row);
    }).catch(error => {
      this.triggerEvent('exception', { on: 'update', error: error });
    });
  }

  doSort(columnLabel) {
    if (this.sortable === null || this.isObject(columnLabel.column)) {
      return;
    }

    if (this.sortingCriteria[columnLabel.column]) {
      this.sortingCriteria[columnLabel.column] = this.sortingCriteria[columnLabel.column] === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortingCriteria = {};
      this.sortingCriteria[columnLabel.column] = 'asc';
    }

    this.load();
  }

  doSearch(searchInput) {
    if (this.searchable === null) {
      return;
    }

    if (!(this.defaultColumn in this.searchCriteria)) {
      this.searchCriteria = {};
    }
    this.searchCriteria[this.defaultColumn] = searchInput;
    this.load();
  }

  get columnLabels() {
    let instance = this,
        labelsRaw = instance.columns.split(','),
        labels = [];

    function clean(str) {
      return str.replace(/^'?\s*|\s*'$/g, '');
    }

    function ucfirst(str) {
      return str[0].toUpperCase() + str.substr(1);
    }

    labelsRaw.forEach(function (label) {
      if (!label) {
        return;
      }
      let aliased = label.split(' as '),
          cleanedLabel = clean(aliased[0]);

      if (instance.columnsArray.indexOf(cleanedLabel) === -1) {
        instance.columnsArray.push(cleanedLabel);
      }

      labels.push({
        column: cleanedLabel,
        label: ucfirst(clean(aliased[1] || aliased[0]))
      });
    });

    this.checkDefaultColumn();

    return labels;
  }

  checkDefaultColumn() {
    let hasNameColumn = this.columnsArray.indexOf('name') !== -1;

    if (!this.defaultColumn || this.defaultColumn && this.columnsArray.indexOf(this.defaultColumn) === -1) {
      this.defaultColumn = hasNameColumn ? 'name' : this.columnsArray[0] || null;
    }
  }

  triggerEvent(event, payload = {}) {
    payload.bubbles = true;
    return this.element.dispatchEvent(new CustomEvent(event, payload));
  }

  destroyRow(id) {
    return this.element.dispatchEvent(new CustomEvent('destroyed', this.data.asObject()));
  }

  populate(row) {
    return this.repository.getPopulatedEntity(row);
  }

  selected(row) {
    if (this.select) {
      return this.select(this.repository.getPopulatedEntity(row));
    }

    return this.navigateTo(row.id);
  }

  navigateTo(id) {
    this.router.navigateToRoute(this.route, { id: id });
  }

  updateRecordCount() {}

  displayValue(row, propertyName) {
    if (row[propertyName]) {
      return row[propertyName];
    }
    let statham = new Statham(row, Statham.MODE_NESTED);
    return statham.fetch(propertyName);
  }

  isObject(columnName) {
    return columnName.indexOf('.') !== -1;
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'repository', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'columns', [bindable], {
  enumerable: true,
  initializer: function () {
    return '';
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'defaultColumn', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'searchable', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'sortable', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'update', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'destroy', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'select', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'data', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'route', [bindable], {
  enumerable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2.prototype, 'columnLabels', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'columnLabels'), _class2.prototype)), _class2)) || _class) || _class);