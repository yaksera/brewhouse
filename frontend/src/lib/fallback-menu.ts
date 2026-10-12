import type { Menu } from "./types";

/** Mirrors backend/cafe/migrations/0002_seed_menu.py; used when the API is unreachable. */
export const FALLBACK_MENU: Menu = {
  "categories": [
    {
      "id": 1,
      "name": "Beverage",
      "slug": "beverage"
    },
    {
      "id": 2,
      "name": "Breakfast",
      "slug": "breakfast"
    },
    {
      "id": 3,
      "name": "Main Course",
      "slug": "main-course"
    },
    {
      "id": 4,
      "name": "Desserts",
      "slug": "desserts"
    }
  ],
  "items": [
    {
      "id": 1,
      "name": "Caramel Latte",
      "description": "Double shot Himalayan espresso, gently steamed textured cow milk, and artisanal slow-cooked jaggery caramel drizzle.",
      "price": 380,
      "badge": "bestseller",
      "note": "Rich & Creamy",
      "is_popular": true,
      "category": "beverage"
    },
    {
      "id": 2,
      "name": "Single Origin Pour-Over",
      "description": "Hand-brewed V60 of washed Nuwakot beans with notes of stone fruit, brown sugar and a clean, bright finish.",
      "price": 420,
      "badge": "chef_choice",
      "note": "Bright & Fruity",
      "is_popular": true,
      "category": "beverage"
    },
    {
      "id": 3,
      "name": "Flat White",
      "description": "Ristretto double shot under a thin layer of velvety micro-foam, poured in a 6 oz cup.",
      "price": 340,
      "badge": "",
      "note": "Bold & Smooth",
      "is_popular": false,
      "category": "beverage"
    },
    {
      "id": 4,
      "name": "Himalayan Masala Chiya",
      "description": "Assam leaf simmered with fresh ginger, cardamom and clove in full-cream milk, sweetened to taste.",
      "price": 180,
      "badge": "",
      "note": "Warm & Spiced",
      "is_popular": false,
      "category": "beverage"
    },
    {
      "id": 5,
      "name": "Iced Honey Cold Brew",
      "description": "18-hour cold brew over ice with wild Chitwan honey and a splash of oat milk.",
      "price": 360,
      "badge": "new",
      "note": "Cool & Mellow",
      "is_popular": false,
      "category": "beverage"
    },
    {
      "id": 6,
      "name": "Muesli Bowl",
      "description": "House-toasted oats, nuts and seeds with Himalayan yoghurt, seasonal fruit and a drizzle of local honey.",
      "price": 420,
      "badge": "bestseller",
      "note": "Light & Wholesome",
      "is_popular": true,
      "category": "breakfast"
    },
    {
      "id": 7,
      "name": "Sourdough Avocado Toast",
      "description": "Slow-fermented sourdough, smashed avocado, cherry tomatoes, timur pepper and a soft poached egg.",
      "price": 520,
      "badge": "chef_choice",
      "note": "Fresh & Zesty",
      "is_popular": false,
      "category": "breakfast"
    },
    {
      "id": 8,
      "name": "Butter Toast & Eggs",
      "description": "Thick-cut house bread with cultured butter, two eggs your way and sautéed greens.",
      "price": 360,
      "badge": "",
      "note": "Simple & Hearty",
      "is_popular": false,
      "category": "breakfast"
    },
    {
      "id": 9,
      "name": "Buckwheat Pancakes",
      "description": "Fluffy Mustang buckwheat pancakes with whipped butter, berry compote and maple syrup.",
      "price": 450,
      "badge": "",
      "note": "Sweet & Fluffy",
      "is_popular": false,
      "category": "breakfast"
    },
    {
      "id": 10,
      "name": "Italian Pasta",
      "description": "Penne in slow-simmered tomato and basil sauce with garlic, chilli flakes and shaved yak cheese.",
      "price": 650,
      "badge": "bestseller",
      "note": "Savory & Herby",
      "is_popular": true,
      "category": "main-course"
    },
    {
      "id": 11,
      "name": "Chicken Momo Platter",
      "description": "Ten hand-folded steamed momos with roasted tomato–sesame achar and a light jhol.",
      "price": 480,
      "badge": "chef_choice",
      "note": "Juicy & Spiced",
      "is_popular": true,
      "category": "main-course"
    },
    {
      "id": 12,
      "name": "Grilled Chicken Sandwich",
      "description": "Herb-marinated chicken, caramelised onion, pickled cucumber and aioli on toasted ciabatta.",
      "price": 560,
      "badge": "",
      "note": "Smoky & Filling",
      "is_popular": false,
      "category": "main-course"
    },
    {
      "id": 13,
      "name": "Thakali Veg Set",
      "description": "Mustang-style dal, rice, seasonal tarkari, gundruk, achar and papad, served as a full set.",
      "price": 620,
      "badge": "",
      "note": "Comforting & Homely",
      "is_popular": false,
      "category": "main-course"
    },
    {
      "id": 14,
      "name": "Sizzling Brownie",
      "description": "Warm dark-chocolate brownie on a hot skillet with vanilla ice cream and hot chocolate sauce.",
      "price": 450,
      "badge": "chef_choice",
      "note": "Rich & Gooey",
      "is_popular": true,
      "category": "desserts"
    },
    {
      "id": 15,
      "name": "Chocolate Layer Cake",
      "description": "Four layers of moist cocoa sponge with dark chocolate ganache, topped with a fresh raspberry.",
      "price": 380,
      "badge": "",
      "note": "Decadent & Moist",
      "is_popular": false,
      "category": "desserts"
    },
    {
      "id": 16,
      "name": "Lemon Cheesecake",
      "description": "Baked New York–style cheesecake with a buttery biscuit base and tangy lemon curd.",
      "price": 420,
      "badge": "new",
      "note": "Tangy & Creamy",
      "is_popular": false,
      "category": "desserts"
    }
  ]
};
