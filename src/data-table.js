import {inject, customElement, bindable, computedFrom} from 'aurelia-framework';

@customElement('data-table')
@inject(Element)
export class DataTable {
  @bindable repository;
  // String representing the olumn names
  @bindable columns = '';
  // Column used by default for search
  @bindable defaultColumn;
  // Show the search field? (Optional attribut)
  @bindable searchable = true;
  // Columns can be sorted? (Optional attribut)
  @bindable sortable = true;
  // Rows are editable? (Optional attribut)
  @bindable editable = true;
  // Rows are removable? (Optional attribut)
  @bindable removable = true;
  @bindable data;

  columnsArray = [];
  sortingCriteria = {};
  searchCriteria = {}

  constructor(element) {
    // console.log(element);
    this.element = element;
  }

  attached() {
    this.sortable = (this.sortable === 'false' ? false : true);
    this.searchable = (this.searchable === 'false' ? false : true);
    this.editable = (this.editable === 'false' ? false : true);
    this.removable = (this.removable === 'false' ? false : true);
    return this.load();
  }

  load() {
    // *********ORM********
    // let criteria = {};
    // if (this.searchable ) {
    //   this.searchCriteria
    // }
    // if (this.sortable ) {
    //   this.sortingCriteria
    // }
    // this.repository.find(criteria, true).then(result => {
    //  this.data = result;
    // })
    // .catch(error => {
    //   console.error('Something went wrong.', error);
    // });
    return this.data;
  }

  populate (row) {
    return this.repository.getPopulatedEntity(row);
  }

  doDelete(index) {
    // *********ORM********
    // this.populate(row).destroy()
    //   .then(() => {
    //   this.load();
    //   this.triggerEvent('deleted', row);
    // })
    // .catch(error => {
    //     this.triggerEvent('exception', {on: 'delete', error: error});
    // });
    this.data.splice(index, 1);
  }

  doUpdate (row) {
    // *********ORM********
    // this.populate(row).update()
    //   .then(() => {
    //   this.load();
    //   this.triggerEvent('updated', row);
    // })
    // .catch(error => {
    //     this.triggerEvent('exception', {on: 'update', error: error});
    // });
  }

  doSort(columnLabel) {
    if (!this.sortable) {
      return;
    }

    if (this.sortingCriteria[columnLabel.column]) {
      this.sortingCriteria[columnLabel.column] = (this.sortingCriteria[columnLabel.column] === 'desc' ? 'asc' : 'desc');
    }
    else {
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
    this.searchCriteria[this.defaultColumn] = searchInput
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
}