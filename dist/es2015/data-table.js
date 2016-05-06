var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;

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

import { inject, customElement, bindable, computedFrom } from 'aurelia-framework';

export let DataTable = (_dec = customElement('data-table'), _dec2 = inject(Element), _dec3 = computedFrom('columns'), _dec(_class = _dec2(_class = (_class2 = class DataTable {

  constructor(element) {
    _initDefineProp(this, 'repository', _descriptor, this);

    _initDefineProp(this, 'columns', _descriptor2, this);

    _initDefineProp(this, 'defaultColumn', _descriptor3, this);

    _initDefineProp(this, 'searchable', _descriptor4, this);

    _initDefineProp(this, 'sortable', _descriptor5, this);

    _initDefineProp(this, 'editable', _descriptor6, this);

    _initDefineProp(this, 'removable', _descriptor7, this);

    _initDefineProp(this, 'data', _descriptor8, this);

    this.columnsArray = [];
    this.sortingCriteria = {};
    this.searchCriteria = {};

    this.element = element;
  }

  attached() {
    this.sortable = this.sortable === 'false' ? false : true;
    this.searchable = this.searchable === 'false' ? false : true;
    this.editable = this.editable === 'false' ? false : true;
    this.removable = this.removable === 'false' ? false : true;
    return this.load();
  }

  load() {
    return this.data;
  }

  populate(row) {
    return this.repository.getPopulatedEntity(row);
  }

  doDelete(index) {
    this.data.splice(index, 1);
  }

  doUpdate(row) {}

  doSort(columnLabel) {
    if (!this.sortable) {
      return;
    }

    if (this.sortingCriteria[columnLabel.column]) {
      this.sortingCriteria[columnLabel.column] = this.sortingCriteria[columnLabel.column] === 'desc' ? 'asc' : 'desc';
    } else {
      this.sortingCriteria = {};
      this.sortingCriteria[columnLabel.column] = 'desc';
    }
    console.log(this.sortingCriteria);
    console.log('HEYYEYYEYE', columnLabel);
  }

  doSearch(searchInput) {
    if (!this.searchable) {
      return;
    }

    if (!(this.defaultColumn in this.searchCriteria)) {
      this.searchCriteria = {};
    }
    this.searchCriteria[this.defaultColumn] = searchInput;
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
    return true;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'sortable', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'editable', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'removable', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'data', [bindable], {
  enumerable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2.prototype, 'columnLabels', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'columnLabels'), _class2.prototype)), _class2)) || _class) || _class);