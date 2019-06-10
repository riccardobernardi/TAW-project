
import * as item from './Item';
import * as table from './Table';
export var itemsToInsert = [
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

export var tablesToInsert = [
    {number : 1, max_people: 4, state: table.states[0]},
    {number : 2, max_people: 4, state: table.states[0]},
    {number : 3, max_people: 6, state: table.states[0]},
    {number : 4, max_people: 6, state: table.states[0]},
    {number : 5, max_people: 2, state: table.states[0]},
    {number : 6, max_people: 4, state: table.states[0]},
    {number : 7, max_people: 8, state: table.states[0]},
    {number : 8, max_people: 6, state: table.states[0]},
    {number : 9, max_people: 5, state: table.states[0]},
    {number : 10, max_people: 7, state: table.states[0]}
];