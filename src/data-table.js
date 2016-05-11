import {bindable, inject, computedFrom, customElement} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Statham} from 'json-statham';

@customElement('data-table')
@inject(Router, Element)
export class DataTable {
  @bindable repository;
  // String representing the column names
  @bindable columns = '';
  // Column used by default for search
  @bindable defaultColumn;
  // Show the search field? (Optional attribut)
  @bindable searchable = null;
  // Columns can be sorted? (Optional attribut)
  @bindable sortable = null;
  // Rows are editable? (Optional attribut)
  @bindable update = null;
  // Rows are removable? (Optional attribut)
  @bindable destroy = null;
  // Rows are selactable? (Optional attribut)
  @bindable select;
  @bindable data;
  @bindable route;

  count = 0;
  columnsArray = [];
  sortingCriteria = {};
  searchCriteria = {}

  constructor(Router, element) {
    this.router  = Router;
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
    })
    .catch(error => {
      console.error('Something went wrong.', error);
    });
  }

  buildCriteria() {
    let criteria = {};

    if (this.searchable !== null && Object.keys(this.searchCriteria).length ) {
      let propertyName = Object.keys(this.searchCriteria)[0];
      if (this.searchCriteria[propertyName]) {
        criteria['where'] = {};
        criteria['where'][propertyName] = {};
        criteria['where'][propertyName]['contains'] = this.searchCriteria[propertyName];
      }
    }
    if (this.sortable !== null && Object.keys(this.sortingCriteria).length ) {
      let propertyName = Object.keys(this.sortingCriteria)[0];
      if (this.sortingCriteria[propertyName]) {
        criteria['sort'] = propertyName + ' ' + this.sortingCriteria[propertyName];
      }
    }
    return criteria;
  }

  populate (row) {
    return this.repository.getPopulatedEntity(row);
  }

  doDelete(row) {
    if (typeof this.delete === 'function') {
      return this.delete(this.populate(row));
    }

    this.populate(row).destroy()
      .then(ah => {
      this.load();
      this.triggerEvent('deleted', row);
    })
    .catch(error => {
      this.triggerEvent('exception', {on: 'delete', error: error});
    });
  }

  doUpdate (row) {
    if (typeof this.update === 'function') {
      return this.update(this.populate(row));
    }

    this.populate(row).update()
      .then(() => {
      this.load();
      this.triggerEvent('updated', row);
    })
    .catch(error => {
      this.triggerEvent('exception', {on: 'update', error: error});
    });
  }

  doSort(columnLabel) {
    if (this.sortable === null || this.isObject(columnLabel.column)) {
      return;
    }

    if (this.sortingCriteria[columnLabel.column]) {
      this.sortingCriteria[columnLabel.column] = (this.sortingCriteria[columnLabel.column] === 'asc' ? 'desc' : 'asc');
    }
    else {
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

  @computedFrom('columns')
  get columnLabels () {
    let instance  = this,
        labelsRaw = instance.columns.split(','),
        labels    = [];

    function clean (str) {
      return str.replace(/^'?\s*|\s*'$/g, '');
    }

    function ucfirst (str) {
      return str[0].toUpperCase() + str.substr(1);
    }

    labelsRaw.forEach(function (label) {
      if(!label) {
        return;
      }
      let aliased = label.split(' as '),
          cleanedLabel = clean(aliased[0]);

      if (instance.columnsArray.indexOf(cleanedLabel) === -1) {
        instance.columnsArray.push(cleanedLabel);
      }

      labels.push({
        column: cleanedLabel,
        label : ucfirst(clean(aliased[1] || aliased[0]))
      });
    });

    this.checkDefaultColumn();

    return labels;
  }

  checkDefaultColumn() {
    let hasNameColumn = (this.columnsArray.indexOf('name') !== -1);

    if (!this.defaultColumn || (this.defaultColumn && this.columnsArray.indexOf(this.defaultColumn) === -1)) {
      this.defaultColumn = (hasNameColumn ? 'name' : (this.columnsArray[0] || null));
    }
  }

  triggerEvent (event, payload = {}) {
    payload.bubbles = true;
    return this.element.dispatchEvent(new CustomEvent(event, payload));
  }

  destroyRow (id) {
    return this.element.dispatchEvent(new CustomEvent('destroyed', this.data.asObject()));
  }

  populate (row) {
    return this.repository.getPopulatedEntity(row);
  }

  selected (row) {
    if (this.select) {
      return this.select(this.repository.getPopulatedEntity(row));
    }

    return this.navigateTo(row.id);
  }

  navigateTo (id) {
    this.router.navigateToRoute(this.route, {id: id});
  }

  updateRecordCount () {
    // this.repository.count()
    //   .then(res => this.count = res.count)
    // .catch(res => console.error(res));
  }

  displayValue (row, propertyName) {
    if (row[propertyName]) {
      return row[propertyName];
    }
    let statham = new Statham(row, Statham.MODE_NESTED);
    return statham.fetch(propertyName);
  }

  isObject (columnName) {
    return (columnName.indexOf('.') !== -1);
  }
}