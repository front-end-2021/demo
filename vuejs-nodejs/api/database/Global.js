module.exports = {
    getString: function (date) {    // default format YYYY-MM-DD HH:MM:SS.SSS
        if(this.isValidDate(date)) {
            return date.toLocaleString('en-GB', { timeZone: 'UTC' })
        }
        return '';
    },
    getBaseModel: function () {
        return {
            Id: 'Id', Name: 'Name', MIndex: 'MIndex',
            CreatedDate: 'CreatedDate', CreatedBy: 'CreatedBy',
            ModifiedDate: 'ModifiedDate', ModifiedBy: 'ModifiedBy'
        }
    },
    getQueryInsert: function () {
        if(arguments.length < 1) throw new Error('param must has table name');
        const tbName = arguments[0];
        var iCols = [];
        var iQValues = [];
        for (let i = 1; i < arguments.length; i++) {
            iCols.push(arguments[i]);
            iQValues.push('?');
        }
        var iQueryS = `INSERT INTO ${tbName} (${iCols.join(', ')})`;
        const iQueryE = `VALUES(${iQValues.join(', ')})`;
        return `${iQueryS} ${iQueryE}`
    },
    getQueryCreateTable: function (tableName) {
        return `CREATE TABLE IF NOT EXISTS ${tableName}`;
    },
    getQueryIntAutoIncrease: function (id) {
        return `${id} INTEGER PRIMARY KEY AUTOINCREMENT`;
    },
    isValidDate: function (d) {
        return d instanceof Date && !isNaN(d);
    }
}