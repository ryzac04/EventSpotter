
const { sqlForPartialUpdate } = require("./sqlPartialUpdate");
const { BadRequestError } = require("./expressError");

describe("sqlForPartialUpdate", () => {
    test("should construct SQL components for updating partial data", () => {
        const dataToUpdate = {
            firstName: "John",
            age: 30,
            city: "New York"
        };

        const jsToSql = {
            firstName: "first_name",
            age: "age",
            city: "city"
        };

        const expectedResult = {
            setCols: '"first_name"=$1, "age"=$2, "city"=$3',
            values: ["John", 30, "New York"]
        };

        expect(sqlForPartialUpdate(dataToUpdate, jsToSql)).toEqual(expectedResult);
    });

    test("should throw an error when no data is provided", () => {
        const dataToUpdate = {};
        const jsToSql = {};

        expect(() => {
            sqlForPartialUpdate(dataToUpdate, jsToSql);
        }).toThrow(BadRequestError);
    });
});