const books = [
    {
        ISBN: "123450NE",
        title: "Getting started with MERN",
        authors: [1,2],
        language: "en",
        pubDate: "2021-07-07",
        numOfPage: 221,
        category: ["fiction", "programming", "tech", "web dev"],
        publication: 1,
    },
    {
        ISBN: "123650NA",
        title: "Getting started with PYTHON",
        authors: [1,3],
        language: "en",
        pubDate: "2020-06-03",
        numOfPage: 285,
        category: ["programming", "tech","python"],
        publication: 2,
    },
    {
        ISBN: "124560NB",
        title: "Getting started with HTML",
        authors: [3],
        language: "en",
        pubDate: "2020-06-03",
        numOfPage: 456,
        category: ["programming", "tech", "web dev","HTML"],
        publication: 1,
    }
];

const authors = [
    {
        id: 1,
        name: "pavan",
        books: ["123450NE","123650NA"],
    },
    {
        id: 2,
        name: "deepak",
        books: ["123450NE"],
    },
    {
        id: 3,
        name: "rakhi",
        books: ["123650NA","124560NB"],
    }
];

const publications = [
    {
        id: 1,
        name: "Chakra",
        books: ["123450NE"],
    },
    {
        id: 2,
        name: "Tata mcgraw hills",
        books: ["123650NA"],
    },
    {
        id: 3,
        name: "Pearson",
        books: [],
    },
];

module.exports = {books, authors, publications};