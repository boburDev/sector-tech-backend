// const json = require('./brands.json')

// function getFirstCharCode(str) {
//     return str.charCodeAt(0);
// }

// for (const i of json) {
//     console.log(getFirstCharCode(i.title))
// }


const data = [
    {
        "name": "Сетевое оборудование",
        "subcatalog": [
            {
                "name": "Коммутаторы",
                "category": [
                    { "name": "Фиксированные коммутаторы" },
                    { "name": "Коммутаторы Fibre Channel" },
                    { "name": "Модульные коммутаторы" },
                    { "name": "Bare metal коммутаторы" },
                    { "name": "Аксессуары для коммутаторов" }
                ]
            },
            {
                "name": "Маршрутизаторы",
                "category": [
                    { "name": "Маршрутизаторы для корпоративных клиентов" },
                    { "name": "Маршрутизаторы для домашнего использования" },
                    { "name": "Маршрутизаторы для провайдеров услуг связи" },
                    { "name": "Аксессуары для маршрутизаторов" },
                    { "name": "Блоки питания для маршрутизаторов" }
                ]
            },
            {
                "name": "Медиаконвертеры",
                "category": [
                    { "name": "Медиаконвертеры 1Gb" },
                    { "name": "Медиаконвертеры 100Mb" },
                    { "name": "Медиаконвертеры 10G" },
                    { "name": "Блоки питания медиаконвертеров" }
                ]
            }
        ]
    }
]


function findLevel(data, value) {
    for (const catalog of data) {
        for (const subcatalog of catalog.subcatalog) {
            if (subcatalog.name === value) {
                // If the input is a subcatalog, return its categories
                return subcatalog.category.map(c => c.name);
            }
            for (const category of subcatalog.category) {
                if (category.name === value) {
                    // If the input is a category, return all categories under that subcatalog
                    return subcatalog.category.map(c => c.name);
                }
            }
        }
    }
    return null; // Return null if not found
}

// console.log(findLevel(data, "Коммутаторы")); // Returns categories of "Коммутаторы"
// console.log(findLevel(data, "Маршрутизаторы для корпоративных клиентов")); // Returns categories under "Маршрутизаторы"

