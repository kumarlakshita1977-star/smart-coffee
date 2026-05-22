import { MenuItem } from './types';

export const CAFE_MENU: MenuItem[] = [
  {
    id: "1",
    name: "Velvet Cloud Cappuccino",
    category: "coffee",
    price: 5.75,
    description: "An incredibly smooth espresso with dense, micro-foamed sweet milk foam, lightly dusted with organic Ceylon cocoa dust. Provides a comforting warmth.",
    moodTags: ["stressed", "relaxed", "happy", "tired"],
    weatherTags: ["cold", "rainy", "winter", "cloudy"],
    activityTags: ["reading", "working", "relaxing"],
    imageType: "cappuccino",
    steamEffect: true
  },
  {
    id: "2",
    name: "Midnight Eclipse Espresso",
    category: "coffee",
    price: 4.25,
    description: "A pure double-shot of our single-origin Colombian beans. Dark, syrupy, with deep notes of dark chocolate and sour cherry. Highly intense and highly focused.",
    moodTags: ["focused", "energetic", "tired"],
    weatherTags: ["cold", "cloudy", "winter", "summer", "hot"],
    activityTags: ["working", "gaming", "studying"],
    imageType: "espresso",
    steamEffect: true
  },
  {
    id: "3",
    name: "Lavender Breeze Cold Brew",
    category: "cold_brew",
    price: 6.25,
    description: "Our 18-hour slow steep cold brew infused with organic French lavender syrup and topped with a heavy splash of cold sweet cream.",
    moodTags: ["relaxed", "romantic", "happy"],
    weatherTags: ["hot", "summer", "cloudy"],
    activityTags: ["relaxing", "meeting friends"],
    imageType: "cold_brew",
    steamEffect: false
  },
  {
    id: "4",
    name: "Golden Elixir Chai Latte",
    category: "tea",
    price: 5.95,
    description: "A warming organic concentrate of black tea leaves, cinnamon, cardamom, and fresh ginger root, steamed with oat milk and finished with local wild honey.",
    moodTags: ["stressed", "relaxed", "tired"],
    weatherTags: ["cold", "rainy", "winter", "cloudy"],
    activityTags: ["reading", "relaxing", "studying"],
    imageType: "chai",
    steamEffect: true
  },
  {
    id: "5",
    name: "Rose Quartz Latte",
    category: "coffee",
    price: 6.50,
    description: "A gorgeous, sweet, romantic espresso custom-blended with organic rosewater syrup, white chocolate mocha sauce, and warm oat milk.",
    moodTags: ["romantic", "happy", "relaxed"],
    weatherTags: ["summer", "cloudy", "rainy"],
    activityTags: ["meeting friends", "relaxing"],
    imageType: "rose_latte",
    steamEffect: true
  },
  {
    id: "6",
    name: "Neon Volt Nitro Brew",
    category: "cold_brew",
    price: 6.75,
    description: "Nitro-infused cold brew charged with nitrogen for an ultra-creamy head, containing high caffeine content with zero bitterness. Smooth chocolate malt notes.",
    moodTags: ["energetic", "focused"],
    weatherTags: ["hot", "summer", "cloudy"],
    activityTags: ["gaming", "working", "studying"],
    imageType: "nitro",
    steamEffect: false
  },
  {
    id: "7",
    name: "Salted Caramel Obsidian",
    category: "coffee",
    price: 6.25,
    description: "A rich dark mocha layered with homemade buttery salted caramel, topped with espresso shots and an extra crack of pink Himalayan sea salt.",
    moodTags: ["happy", "stressed", "romantic"],
    weatherTags: ["cold", "rainy", "winter"],
    activityTags: ["relaxing", "gaming", "meeting friends"],
    imageType: "caramel_macchiato",
    steamEffect: true
  },
  {
    id: "8",
    name: "Crème Brûlée Affogato",
    category: "dessert",
    price: 7.25,
    description: "Two scoops of authentic Madagascan vanilla bean gelato, topped with a freshly poured single shot of dark espresso and toasted caramel fragments.",
    moodTags: ["happy", "romantic", "relaxed"],
    weatherTags: ["hot", "summer", "cloudy"],
    activityTags: ["meeting friends", "relaxing"],
    imageType: "affogato",
    steamEffect: false
  },
  {
    id: "9",
    name: "Cardamom Rose Bun",
    category: "bakery",
    price: 4.95,
    description: "Artisanal woven swedish sweet bun spiced with ground green cardamom, baked until golden, and iced with a delicate vanilla-rosewater glaze.",
    moodTags: ["relaxed", "happy", "romantic"],
    weatherTags: ["cold", "cloudy", "winter", "rainy"],
    activityTags: ["reading", "meeting friends", "relaxing"],
    imageType: "croissant",
    steamEffect: false
  },
  {
    id: "10",
    name: "Dark Chocolate Fondant Muffin",
    category: "bakery",
    price: 4.50,
    description: "A rich, double-chocolate muffin with a liquid Belgium dark chocolate molten center. Best served warm to melt any lingering stress away.",
    moodTags: ["stressed", "happy", "tired"],
    weatherTags: ["rainy", "cold", "winter"],
    activityTags: ["studying", "working", "relaxing"],
    imageType: "muffin",
    steamEffect: true
  },
  {
    id: "11",
    name: "Almond Croissant Dream",
    category: "bakery",
    price: 5.25,
    description: "Twice-baked butter croissant loaded with rich almond sweet frangipane cream, topped with toasted sliced almonds and powdered sugar dust.",
    moodTags: ["relaxed", "happy", "focused"],
    weatherTags: ["cloudy", "winter", "summer", "rainy", "cold"],
    activityTags: ["reading", "working", "studying"],
    imageType: "croissant",
    steamEffect: false
  }
];
