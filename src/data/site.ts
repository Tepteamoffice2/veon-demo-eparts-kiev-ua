// Content of the homepage. Every fact comes from veon/client.json (paths in comments).
// Not used on purpose (client decision): customer count, number of items, reviews, Kharkiv, e-mail.

export const SOON = "Розділ у розробці";
export const PICKER_SOON = "Онлайн-підбір з'явиться в повній версії сайту";

/** company.contacts.phones[4] — free line, the primary action */
export const freeLine = { href: "tel:0800210982", display: "0-800-21-09-82", note: "безкоштовно по Україні" } as const;

/** company.contacts.phones[0–3, 5]; operator labels by prefix (to confirm with the client, ux/demo-home.md §9) */
export const phones = [
  { href: "tel:+380443609664", display: "(044) 360-96-64", label: "Київ" },
  { href: "tel:+380672911825", display: "(067) 291-18-25", label: "Київстар" },
  { href: "tel:+380950530035", display: "(095) 053-00-35", label: "Vodafone" },
  { href: "tel:+380636318439", display: "(063) 631-84-39", label: "lifecell" },
] as const;
export const feedbackPhone = { href: "tel:+380679506678", display: "067 950 66 78", label: "Питання та пропозиції" } as const;
export const stoPhone = phones[0];

/** company.contacts.addresses[0] */
export const address = {
  street: "бул. Вацлава Гавела, 18в",
  detail: "2 поверх, офіс 65",
  city: "Київ",
  mapHref: "https://www.google.com/maps/search/?api=1&query=%D0%B1%D1%83%D0%BB.%20%D0%92%D0%B0%D1%86%D0%BB%D0%B0%D0%B2%D0%B0%20%D0%93%D0%B0%D0%B2%D0%B5%D0%BB%D0%B0%2C%2018%D0%B2%2C%20%D0%9A%D0%B8%D1%97%D0%B2",
} as const;

/** company.contacts.hours[0] */
export const hours = [
  { days: "Пн–пт", time: "9:00–19:00", note: "" },
  { days: "Сб", time: "10:00–15:00", note: "лише прийом замовлень" },
  { days: "Нд", time: "вихідний", note: "" },
] as const;
export const hoursShort = "Пн–пт 9:00–19:00, сб 10:00–15:00";

/** company.products_services[0], grouped by car system (design/concept.md, catalog) */
export const catalog = [
  { group: "Обслуговування", items: ["Запчастини для ТО", "Мастила й рідини"] },
  { group: "Двигун і трансмісія", items: ["Двигун", "КПП", "Охолодження й опалення", "Вихлоп"] },
  { group: "Ходова й керування", items: ["Гальмівна система", "Підвіска", "Рульове керування"] },
  { group: "Кузов і світло", items: ["Кузов", "Електрика", "Освітлення"] },
] as const;

/** facts C-015: 49 makes in the car finder, alphabetical */
export const brands = [
  "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick",
  "Cadillac", "Chevrolet", "Chrysler", "Citroen", "Dacia", "Daewoo", "Daihatsu",
  "Dodge", "Ferrari", "Fiat", "Ford", "Honda", "Hummer", "Hyundai",
  "Infiniti", "Isuzu", "Jaguar", "Jeep", "Kia", "Lada", "Lancia",
  "Land Rover", "Lexus", "Mazda", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan",
  "Opel", "Peugeot", "Pontiac", "Porsche", "Renault", "Rover", "Saab",
  "Seat", "Skoda", "Subaru", "Suzuki", "Toyota", "Volvo", "Volkswagen",
] as const;

/** company.business_lines[1] */
export const stoTerms = [
  { term: "Знижки", desc: "для СТО та юридичних осіб" },
  { term: "Накопичувальна програма", desc: "для оптових клієнтів" },
  { term: "Безкоштовна доставка", desc: "по Києву" },
  { term: "Розміщення вашого СТО", desc: "на сайті Eparts" },
] as const;

/** company.geography[1], products_services[4–5] */
export const delivery = {
  receive: [
    { title: "Київ", text: "Самовивіз з бул. Вацлава Гавела, 18в або кур'єр по Києву." },
    { title: "Україна", text: "Нова Пошта, Інтайм, Гюнсел, Автолюкс. Доставку оплачує отримувач." },
  ],
  pay: [
    { title: "Онлайн", text: "Картка Visa або Mastercard через LiqPay." },
    { title: "При отриманні", text: "Готівка чи картка при самовивозі, накладений платіж Нової Пошти." },
  ],
} as const;

export const nav = [
  { href: "#hero", label: "Підбір" },
  { href: "#catalog", label: "Каталог" },
  { href: "#brands", label: "Марки" },
  { href: "#delivery", label: "Доставка й оплата" },
  { href: "#sto", label: "Для СТО" },
  { href: "#contacts", label: "Контакти" },
] as const;

export const footerCols = [
  { title: "Покупцям", items: ["Як замовити", "Оплата", "Доставка", "Повернення"] },
  { title: "Співпраця", items: ["Оптовим покупцям", "Постачальникам", "Вакансії"] },
  { title: "Документи", items: ["Політика конфіденційності", "Договір оферти"] },
] as const;
