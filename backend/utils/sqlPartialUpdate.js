
const { BadRequestError } = require("./expressError");

/**
 * Constructs SQL components for updating partial data in a database table.
 * @param {Object} dataToUpdate - The data to be updated. Keys represent column names, and values represent new data.
 * @param {Object} jsToSql - An optional mapping object to map JavaScript-style column names to their SQL equivalents.
 * @returns {Object} An object containing the SQL components for the update query.
 * @throws {BadRequestError} Throws an error if no data is provided for update.
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
    const keys = Object.keys(dataToUpdate);
    if (keys.length === 0) throw new BadRequestError("No data");

    const cols = keys.map((colName, idx) =>
        `"${jsToSql[colName] || colName}"=$${idx + 1}`,
    );

    const setCols = cols.join(", ");
    const values = Object.values(dataToUpdate);

    return {
        setCols: setCols,
        values: values
    };
};

module.exports = { sqlForPartialUpdate };