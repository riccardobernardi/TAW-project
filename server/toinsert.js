"use strict";
exports.__esModule = true;
var item = require("./Item");
var table = require("./Table");
var ticket = require("./Ticket");
exports.itemsToInsert = [
    {
        name: "Bistecca alla griglia",
        type: item.type[0],
        price: 8,
        ingredients: ["bistecca"],
        required_time: 10,
        description: "Forse è una bistecca?"
    },
    {
        name: "Coca cola",
        type: item.type[1],
        price: 2.5,
        ingredients: ["coca cola"],
        required_time: 1,
        description: "Coca cola alla spina da 333ml"
    },
    {
        name: "Chinotto",
        type: item.type[1],
        price: 2,
        ingredients: ["coca cola"],
        required_time: 1,
        description: "Chinotto in lattina da 333ml"
    },
    {
        name: "Spaghetti al ragù",
        type: item.type[0],
        price: 6,
        ingredients: ["spaghetti", "sugo di pomodoro", "carne macinata"],
        required_time: 12,
        description: "Semplici spaghetti al ragù."
    },
    {
        name: "Spaghetti al pomodoro",
        type: item.type[0],
        price: 5,
        ingredients: ["spaghetti", "sugo di pomodoro"],
        required_time: 12,
        description: "Semplici spaghetti al pomodoro che Cecchini non può però mangiare a pranzo, perchè porta sempre il riso per cani."
    },
    {
        name: "Pasticcio al ragù ",
        type: item.type[0],
        price: 5.50,
        ingredients: ["pasta all'uovo", "ragù", "besciamella"],
        required_time: 15,
        description: "Pasticcio della nonna."
    },
    {
        name: "Tagliatelle gamberi e zucchine",
        type: item.type[0],
        price: 6.50,
        ingredients: ["tagliatelle", "gamberi", "zucchine"],
        required_time: 13,
        description: ""
    },
    {
        name: "Ravioli ai porcini",
        type: item.type[0],
        price: 6,
        ingredients: ["ravioli ripieni di carne", "salsa ai porcini"],
        required_time: 6,
        description: ""
    },
    {
        name: "Ravioli al burro",
        type: item.type[0],
        price: 5.50,
        ingredients: ["ravioli ripieni di carne", "burro"],
        required_time: 6,
        description: ""
    },
    {
        name: "Spaghetti alla carbonara",
        type: item.type[0],
        price: 6,
        ingredients: ["spaghetti", "uovo", "guanciale", "pecorino"],
        required_time: 18,
        description: ""
    },
    {
        name: "Gnocchi al Gorgonzola e Speck",
        type: item.type[0],
        price: 6,
        ingredients: ["sgnocchi", "gorgonzola", "speck"],
        required_time: 15,
        description: ""
    },
    {
        name: "Insalata mista",
        type: item.type[0],
        price: 4,
        ingredients: ["insalata", "pomodori", "carote", "mozzarella", "tonno"],
        required_time: 4,
        description: ""
    },
    {
        name: "Frittura mista di pesce",
        type: item.type[0],
        price: 9,
        ingredients: ["calamari", "gamberi", "seppioline", "polenta"],
        required_time: 17,
        description: ""
    },
    {
        name: "Sarde in saor",
        type: item.type[0],
        price: 5.50,
        ingredients: ["sarde", "cipolla"],
        required_time: 5,
        description: ""
    },
    {
        name: "Acqua",
        type: item.type[1],
        price: 1.50,
        ingredients: [],
        required_time: 1,
        description: "Bottiglia da 1l."
    },
    {
        name: "Aranciata",
        type: item.type[1],
        price: 3.50,
        ingredients: [],
        required_time: 1,
        description: "0.40l."
    },
    {
        name: "Birra bionda piccola alla spina",
        type: item.type[1],
        price: 3,
        ingredients: [],
        required_time: 1,
        description: "20cl."
    },
    {
        name: "Birra bionda media alla spina",
        type: item.type[1],
        price: 5,
        ingredients: [],
        required_time: 1,
        description: "40cl."
    },
    {
        name: "Costicine alla griglia",
        type: item.type[0],
        price: 6,
        ingredients: ["costicine"],
        required_time: 10,
        description: ""
    },
    {
        name: "Salsicce alla griglia",
        type: item.type[0],
        price: 5.70,
        ingredients: ["salsicce"],
        required_time: 10,
        description: ""
    }
];
exports.tablesToInsert = [
    { number: 1, max_people: 4, state: table.states[0] },
    { number: 2, max_people: 4, state: table.states[0] },
    { number: 3, max_people: 6, state: table.states[0] },
    { number: 4, max_people: 6, state: table.states[0] },
    { number: 5, max_people: 2, state: table.states[0] },
    { number: 6, max_people: 4, state: table.states[0] },
    { number: 7, max_people: 8, state: table.states[0] },
    { number: 8, max_people: 6, state: table.states[0] },
    { number: 9, max_people: 5, state: table.states[0] },
    { number: 10, max_people: 7, state: table.states[0] }
];
exports.usersToInsert = [
    { username: "waiter1", password: "waiter1", role: "waiter" },
    { username: "waiter2", password: "waiter2", role: "waiter" },
    { username: "waiter3", password: "waiter3", role: "waiter" },
    { username: "waiter4", password: "waiter4", role: "waiter" },
    { username: "waiter5", password: "waiter5", role: "waiter" },
    { username: "bartender1", password: "bartender1", role: "bartender" },
    { username: "bartender2", password: "bartender2", role: "bartender" },
    { username: "bartender3", password: "bartender3", role: "bartender" },
    { username: "cook1", password: "cook1", role: "cook" },
    { username: "cook2", password: "cook2", role: "cook" },
    { username: "cook3", password: "cook3", role: "cook" },
];
exports.ticketToInsert = [
    {
        waiter: "waiter1",
        table: 1,
        start: new Date(),
        orders: [{
                //id_order: new ObjectID(),
                name_item: "Bistecca alla griglia",
                username_waiter: "waiter1",
                state: ticket.orderState[0],
                price: 9,
                type_item: item.type[0],
                required_time: 10
            },
            {
                name_item: "Coca cola",
                username_waiter: "waiter1",
                state: ticket.orderState[0],
                price: 2.5,
                type_item: item.type[1],
                required_time: 1
            },
            {
                name_item: "Spaghetti al pomodoro",
                username_waiter: "waiter1",
                state: ticket.orderState[0],
                price: 6,
                added: ["Mozzarella"],
                type_item: item.type[0],
                required_time: 12
            }, {
                name_item: "Bistecca alla griglia",
                username_waiter: "waiter1",
                state: ticket.orderState[0],
                price: 9,
                type_item: item.type[0],
                required_time: 10
            },
            {
                name_item: "Chinotto",
                username_waiter: "waiter1",
                state: ticket.orderState[0],
                price: 2.5,
                type_item: item.type[1],
                required_time: 1
            }],
        state: ticket.ticketState[0],
        total: 0,
        people_number: 2
    },
    {
        waiter: "waiter1",
        table: 3,
        start: new Date(),
        orders: [{
                //id_order: new ObjectID(),
                name_item: "Bistecca alla griglia",
                username_waiter: "waiter1",
                state: ticket.orderState[0],
                price: 9,
                type_item: item.type[0],
                required_time: 10
            },
            {
                name_item: "Ravioli ai porcini",
                username_waiter: "waiter1",
                state: ticket.orderState[0],
                price: 6,
                added: ["Mozzarella"],
                type_item: item.type[0],
                required_time: 12
            }, {
                name_item: "Bistecca alla griglia",
                username_waiter: "waiter1",
                state: ticket.orderState[0],
                price: 9,
                type_item: item.type[0],
                required_time: 10
            },
            {
                name_item: "Chinotto",
                username_waiter: "waiter3",
                state: ticket.orderState[0],
                price: 2.5,
                type_item: item.type[1],
                required_time: 1
            }],
        state: ticket.ticketState[0],
        total: 0,
        people_number: 5
    },
    {
        waiter: "waiter2",
        table: 2,
        start: new Date(),
        orders: [{
                //id_order: new ObjectID(),
                name_item: "Spaghetti al pomodoro",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 6,
                added: ["Mozzarella"],
                type_item: item.type[0],
                required_time: 12
            }, {
                //id_order: new ObjectID(),
                name_item: "Bistecca alla griglia",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 9,
                type_item: item.type[0],
                required_time: 10
            },
            {
                name_item: "Chinotto",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 2.5,
                type_item: item.type[1],
                required_time: 1
            },
            {
                name_item: "Spaghetti al pomodoro",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 6,
                added: ["Mozzarella"],
                type_item: item.type[0],
                required_time: 12
            }, {
                name_item: "Bistecca alla griglia",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 9,
                type_item: item.type[0],
                required_time: 10
            },
            {
                name_item: "Chinotto",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 2.5,
                type_item: item.type[1],
                required_time: 1
            },
            {
                name_item: "Spaghetti al pomodoro",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 6,
                added: ["Mozzarella"],
                type_item: item.type[0],
                required_time: 12
            }, {
                name_item: "Bistecca alla griglia",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 9,
                type_item: item.type[0],
                required_time: 10
            },
            {
                name_item: "Chinotto",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 2.5,
                type_item: item.type[1],
                required_time: 1
            },
            {
                name_item: "Spaghetti al pomodoro",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 6,
                added: ["Mozzarella"],
                type_item: item.type[0],
                required_time: 12
            }, {
                name_item: "Frittura mista di pesce",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 9,
                type_item: item.type[0],
                required_time: 10
            },
            {
                name_item: "Chinotto",
                username_waiter: "waiter2",
                state: ticket.orderState[0],
                price: 2.5,
                type_item: item.type[1],
                required_time: 1
            }],
        state: ticket.ticketState[0],
        total: 0,
        people_number: 2
    },
    {
        waiter: "waiter4",
        table: 6,
        start: new Date(),
        orders: [{
                name_item: "Ravioli ai porcini",
                username_waiter: "waiter4",
                state: ticket.orderState[0],
                price: 6,
                added: ["Mozzarella"],
                type_item: item.type[0],
                required_time: 12
            },
            {
                name_item: "Bistecca alla griglia",
                username_waiter: "waiter4",
                state: ticket.orderState[0],
                price: 9,
                type_item: item.type[0],
                required_time: 10
            },
            {
                name_item: "Chinotto",
                username_waiter: "waiter4",
                state: ticket.orderState[0],
                price: 2.5,
                type_item: item.type[1],
                required_time: 1
            }],
        state: ticket.ticketState[0],
        total: 0,
        people_number: 2
    },
    {
        waiter: "waiter3",
        table: 9,
        start: "2019-05-27T00:00:00.000Z",
        orders: [{
                name_item: "Spaghetti al pomodoro",
                username_waiter: "waiter3",
                state: ticket.orderState[0],
                price: 6,
                added: ["Mozzarella"],
                type_item: item.type[0],
                required_time: 12
            },
            {
                name_item: "Bistecca alla griglia",
                username_waiter: "waiter3",
                state: ticket.orderState[0],
                price: 9,
                type_item: item.type[0],
                required_time: 10
            },
            {
                name_item: "Chinotto",
                username_waiter: "waiter3",
                state: ticket.orderState[0],
                price: 2.5,
                type_item: item.type[1],
                required_time: 1
            }],
        state: ticket.ticketState[0],
        total: 0,
        people_number: 2
    }
];
exports.reportToInsert = [
    {
        date: "2019-05-28T00:00:00.000Z",
        total: 175,
        total_customers: 18,
        total_orders: {
            dish: 24,
            beverage: 30
        },
        average_stay: 40,
        users_reports: {
            waiters: [{ username: "waiter1", customers_served: 20, orders_served: 66 }, { username: "waiter2", customers_served: 40, orders_served: 120 }],
            bartenders: [{ username: "bartender1", items_served: 60 }],
            cookers: [{ username: "cook1", items_served: 60 }]
        }
    },
    {
        date: "2019-05-27T00:00:00.000Z",
        total: 320,
        total_customers: 40,
        total_orders: {
            dish: 50,
            beverage: 112
        },
        average_stay: 90,
        users_reports: {
            waiters: [{ username: "waiter1", customers_served: 20, orders_served: 66 }, { username: "waiter2", customers_served: 40, orders_served: 120 }],
            bartenders: [{ username: "bartender1", items_served: 60 }],
            cookers: [{ username: "cook1", items_served: 60 }]
        }
    },
    {
        date: "2019-05-29T00:00:00.000Z",
        total: 5600,
        total_customers: 120,
        total_orders: {
            dish: 350,
            beverage: 712
        },
        average_stay: 120,
        users_reports: {
            waiters: [{ username: "waiter1", customers_served: 80, orders_served: 912 }, { username: "waiter2", customers_served: 40, orders_served: 305 }],
            bartenders: [{ username: "bartender1", items_served: 400 }, { username: "waiter2", items_served: 700 }],
            cookers: [{ username: "cook1", items_served: 60 }, { username: "cook2", items_served: 1110 }]
        }
    },
    {
        date: "2019-05-30T00:00:00.000Z",
        total: 5600,
        total_customers: 120,
        total_orders: {
            dish: 350,
            beverage: 712
        },
        average_stay: 120,
        users_reports: {
            waiters: [{ username: "waiter1", customers_served: 80, orders_served: 912 }, { username: "waiter2", customers_served: 40, orders_served: 305 }],
            bartenders: [{ username: "bartender1", items_served: 400 }, { username: "waiter2", items_served: 700 }],
            cookers: [{ username: "cook1", items_served: 60 }, { username: "cook2", items_served: 1110 }]
        }
    },
    {
        date: "2019-06-03T00:00:00.000Z",
        total: 5600,
        total_customers: 120,
        total_orders: {
            dish: 350,
            beverage: 712
        },
        average_stay: 120,
        users_reports: {
            waiters: [{ username: "waiter1", customers_served: 80, orders_served: 912 }, { username: "waiter2", customers_served: 40, orders_served: 305 }],
            bartenders: [{ username: "bartender1", items_served: 400 }, { username: "waiter2", items_served: 700 }],
            cookers: [{ username: "cook1", items_served: 60 }, { username: "cook2", items_served: 1110 }]
        }
    }
];
