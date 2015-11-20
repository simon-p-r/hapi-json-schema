'use strict';
print('Inserting records into mongo for tests');
db.lookup.drop();

var salutations = [{
    _id: "salutation::mr",
    lookup: {
        value: "Mr"
    },
    recType: "salutation"
},
{
    _id: "salutation::mrs",
    lookup: {
        value: "Mrs"
    },
    recType: "salutation"
},
{
    _id: "salutation::miss",
    lookup: {
        value: "Miss"
    },
    recType: "salutation"
},
{
    _id: "salutation::bishop",
    lookup: {
        value: "Bishop"
    },
    recType: "salutation"
},
{
    _id: "salutation::father",
    lookup: {
        value: "Father"
    },
    recType: "salutation"
},
{
    _id: "salutation::lady",
    lookup: {
        value: "Lady"
    },
    recType: "salutation"
},
{
    _id: "salutation::father",
    lookup: {
        value: "Father"
    },
    recType: "salutation"
},
{
    _id: "salutation::lady",
    lookup: {
        value: "Lady"
    },
    recType: "salutation"
},
{
    _id: "salutation::father",
    lookup: {
        value: "Father"
    },
    recType: "salutation"
},
{
    _id: "contacttype::lady",
    lookup: {
        value: "Lady"
    },
    recType: "salutation"
}];

db.lookup.insert(salutations);

var locators = [{
    _id: "locator::address",
    lookup: {
        value: "address"
    },
    recType: "locator"
},
{
    _id: "locator::contact",
    lookup: {
        value: "contact"
    },
    recType: "locator"

},
{
    _id: "locator::email",
    lookup: {
        value: "email"
    },
    recType: "locator"
},
{
    _id: "locator::billing",
    lookup: {
        value: "billing"
    },
    recType: "locator"
},
{
    _id: "locator::phone",
    lookup: {
        value: "phone"
    },
    recType: "locator"
}];

db.lookup.insert(locators);
