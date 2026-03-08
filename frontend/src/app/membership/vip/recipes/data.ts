export const AUTHOR_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBbqfNLKnQRIJjCO8V8wZGDh47a0dgt8V49617P1-dS_DIonB4q7oh-GS8-yRyw3Iz5uqZ76dGj1VxBXb6fmwYBHv0FbLxfAMNLK1-FBiFM5mjSiVR-rTL_vsuiEbKj4INN98rQtm0Po271HYuexxABnEX2BwqKL8mD-tLzD8O7-uFQR1uABnrC8z9MZksM9_0ErgPNss2ORU8QK43T0CwRtXWQ72avSO6AvduzpgotWx97hSNjzdPacM9yhTQpiL31DLB9c5BpM74";

const REVIEW_AVATAR_1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCU37CEWUO1EQxyj1qZArM5FJwCX_GBIH3EkBVC6mKNu5D-Wuo3Ex7H2y7QTJAnC4HOPltGX_SprQilztA5IOd8AFdALe6CrCy15kAbr1eDqqjbDb8f6Jx32U5ML7lRUb1S6iiiI2sPNoE8jz6qdkjVhgUW_Z0aRSGy6tkDQLmfy9V8cFHdsoihbP35RWNkHnOtyJOUpYSc3DXURYaneeY-D-_d8C05OaYt9SCLtuIyrehHfRnZCb1DxiSGhPQ8JnxamSNgpodbfGc";

const REVIEW_AVATAR_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDnechCpJhO3R_a56N3okRzvaR8AhWTk8L5HazX-fTAlCjnfpFmMtAXBd7HN1tSFxDPDQofRqueOtci95PrF-a38ZQh-se3exvu-4eOoRvcStiZKly_WXntIuaW8FCfxtlgY5WAErIz6k53KC30mkOOFJKvqxtqZqTFC3ijgMydf1kOJtBvoF21lSvXPB5ipfMoju9YU5GUPMP_Wqn7YIWsf1iQ6-slF5sqBukUSh1S0l8RNnpXcBavD6CGZMsbMKPPsyqVFcKUf7c";

const STEP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuANLU-TxvdhLQrh88Yy-jJDKTapJimy51nkiosaR3KC5QpuKY3RprP86Fy0SpfLyE-ggMNC3GLA6rZzT23dwvKnqemBp71R0mMlDG4WYuiW6BZF6rSi4patTs62cg1YaQT8IBD37Ogy8kSe93inD4ayHtmXx-HbKJvAWsnrQtXsMYVXtdhs7gRBauBxZB7_85nqoXPTwEHIFZMK1I-R55Ad3FerLg6o8DnNHX-UMTi92gE8-95jYVnHp5CCPvvyqW-rbTmfzujWrBs";

const PRODUCT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCLi8SQ_ZGZNDcnQyZZHJPfwsgSL0RpprEZAnG2ynWnSUhKmtLBfVLAEUpNIzYthcrVlot1znTJz2bu-gRci_WRfJPOiH8bPQDYqiw5YIGp2D5ueSwbtu5iyxlABwDKNx0ChYj-mwgYva1GGhVOHyTSMAfj72HH1JnyqjZELts4up7lbRkPkh_0KQ8jBGTlSIrTiCMNE8XviE1YRcDkOA28HoLCCwhGwtgw0SXoThkR2c5HcQl5_CckhfhdzfQHgfzeb4bbCp9V3us";

export interface RecipeStep {
  title: string;
  body: string;
  imageUrl?: string;
}

export interface RecipeReview {
  name: string;
  date: string;
  stars: number;
  text: string;
  avatarUrl: string;
}

export interface RatingBar {
  stars: number;
  pct: number;
}

export interface PremiumRecipe {
  slug: string;
  flavorName: string;
  category: string;
  shortDescription: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  prep?: string;
  cook?: string;
  yield: string;
  difficulty: string;
  specialBadge?: string;
  calories: number;
  caloriesLabel: string;
  ingredients: string[]; // static HTML strings — safe, not user input
  proTipLabel: string;
  proTipText: string;
  proTipProductImage: string;
  chefTip: string;
  steps: RecipeStep[];
  reviews: RecipeReview[];
  ratingBars: RatingBar[];
}

export const PREMIUM_RECIPES: PremiumRecipe[] = [
  {
    slug: "chocolate-almond-crunch",
    flavorName: "Chocolate Almond Crunch",
    category: "Chocolate Flavors",
    shortDescription:
      "A decadent dark chocolate base swirled with toasted California almonds and a touch of sea salt. A fan-favorite masterpiece.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtYxRJ_1FiHZ9QO1bEjKBOF0MBqw_orqlr_J086AFZVQLsjhot_znm_WwAR_gprSnD4sU6I_lE3t0Nm7x_ZWHxGoxSgYduajZrd61IO6ooovw4vM2ei-1cVuMEpPVgGSZXz0ebvEjK0aDwmGuXScHfJTPPr_jJbRM0_BrAhGqHwU6HrfQUc1Wwsd2AjtocEuPd0JU9tc_BsAG42tJ-fpMdcmFqSv9Btrv3x2PdC1M5kmQKInDea7kZ5GfLa-FJSPpdwQAtsqvf7cc",
    rating: 4.9,
    reviewCount: 215,
    prep: "45m",
    yield: "1.5 Qts",
    difficulty: "Medium",
    specialBadge: "Fan Favorite",
    calories: 420,
    caloriesLabel: "Calories per scoop",
    ingredients: [
      "2 cups <strong>heavy cream</strong>",
      "1 cup <strong>whole milk</strong>",
      "3/4 cup <strong>cocoa powder</strong>",
      "1/2 cup <strong>roasted almonds</strong>",
      "3/4 cup <strong>granulated sugar</strong>",
      "1 tsp <strong>vanilla extract</strong>",
      "Pinch of <strong>sea salt</strong>",
    ],
    proTipLabel: "Recommended",
    proTipText: "Use Premium Roasted California Almonds",
    proTipProductImage: PRODUCT_IMAGE,
    chefTip:
      "Toast your almonds right before adding them for a more intense nutty flavor profile! It releases the natural oils and makes them crunchier.",
    steps: [
      {
        title: "The Base Mix",
        body: "In a medium saucepan, whisk together the cocoa powder and sugar. Slowly whisk in the milk and half of the heavy cream until smooth. Heat over medium heat, stirring constantly, until the sugar has completely dissolved.",
      },
      {
        title: "Chill & Infuse",
        body: "Remove from heat and stir in the remaining heavy cream, vanilla extract, and sea salt. Pour the mixture into a clean bowl, cover with plastic wrap, and refrigerate for at least 4 hours.",
        imageUrl: STEP_IMAGE,
      },
      {
        title: "Churning Time",
        body: "Pour the chilled custard into your ice cream maker and churn according to the manufacturer's instructions. This usually takes about 20-25 minutes until it reaches a soft-serve consistency.",
      },
      {
        title: "The Crunch Factor",
        body: "During the last 5 minutes of churning, slowly add the chopped roasted almonds. Allow them to be evenly distributed throughout the chocolate base.",
      },
      {
        title: "Final Freeze",
        body: "Transfer the ice cream to an airtight container. Press a piece of parchment paper against the surface to prevent ice crystals. Freeze for at least 2 hours.",
      },
    ],
    reviews: [
      {
        name: "David Smith",
        date: "1 day ago",
        stars: 5,
        text: "The best chocolate ice cream I've ever made. The sea salt perfectly balances the rich cocoa.",
        avatarUrl: REVIEW_AVATAR_1,
      },
    ],
    ratingBars: [
      { stars: 5, pct: 90 },
      { stars: 4, pct: 8 },
      { stars: 3, pct: 2 },
    ],
  },
  {
    slug: "mango-tango-sorbet",
    flavorName: "Mango Tango Sorbet",
    category: "Fruit Flavors",
    shortDescription:
      "A refreshing, zesty tropical delight by Mr. A's Ice Cream Parlor. Made with fresh mangoes and a touch of honey.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKlaDS98ymt0WEtI_alRE_Ggi_FwnHocU2Z19bkzDOXkwlTozuXh0Tjzvz3hRppnCOUPveG_AYW-oQpAToawlASGKb9JNlwoEim_x0gj0JCtTDXhVxZ3EX8zR0pPCn9qGdoYr162kST4VeCt-qNGXpxHIKKD9i8LRciPSk95Yei7zotJXWADI0kKZvR2FDnsW3GK0ExN7p_h13vhvGDpI_D0J-1D1QprbUKAXStzopybFc2Hp6sh0j76JgHh1EJ6d1HbkXCO7cuIE",
    rating: 4.9,
    reviewCount: 86,
    prep: "15m",
    yield: "4 Scoops",
    difficulty: "Easy",
    calories: 120,
    caloriesLabel: "Calories per scoop",
    ingredients: [
      "3 large ripe <strong>mangoes</strong>, cubed",
      "1/4 cup <strong>fresh lime juice</strong>",
      "1/3 cup <strong>organic honey</strong>",
      "1/2 cup <strong>cold filtered water</strong>",
      "A pinch of <strong>sea salt</strong>",
      "<strong>Fresh mint</strong> for garnish",
    ],
    proTipLabel: "Pro Tip from Mr. A",
    proTipText: "Use Ataulfo mangoes for the creamiest texture without any stringy fibers!",
    proTipProductImage: PRODUCT_IMAGE,
    chefTip:
      "Freeze the mango cubes on a tray for at least 2 hours before blending. This ensures a thick, instant-serve sorbet consistency!",
    steps: [
      {
        title: "Prep the Fruit",
        body: "Peel and cube your ripe mangoes. For the best results, place the mango cubes on a tray and freeze for about 2 hours before blending.",
      },
      {
        title: "Blend to Perfection",
        body: "Add the frozen mango cubes, lime juice, honey, salt, and water into a high-speed blender. Blend until smooth and velvety.",
      },
      {
        title: "The Chill Factor",
        body: "Transfer the mixture into a shallow, freezer-safe container. Smooth out the top and cover with parchment paper.",
      },
      {
        title: "Freeze and Serve",
        body: "Freeze for at least 4-6 hours. Garnish with fresh mint leaves and enjoy the tango!",
      },
    ],
    reviews: [
      {
        name: "Sarah Jenkins",
        date: "2 days ago",
        stars: 5,
        text: "Perfectly refreshing for the summer! The honey adds just the right amount of sweetness.",
        avatarUrl: REVIEW_AVATAR_1,
      },
    ],
    ratingBars: [
      { stars: 5, pct: 90 },
      { stars: 4, pct: 8 },
      { stars: 3, pct: 2 },
    ],
  },
  {
    slug: "strawberry-cheesecake-delight",
    flavorName: "Strawberry Cheesecake Delight",
    category: "Fruit Flavors",
    shortDescription:
      "A rich and creamy strawberry ice cream loaded with cheesecake chunks and a graham cracker swirl. The perfect summer treat straight from Mr. A's kitchen.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBcnRaEtmxgwbStR1UVDcxO0Rb2kt8SPM3UR2nyYbgft8Qts5MQb1FI7UomKtbQPrIxGWU48wxa_r3kKn7FYrIrYdsLTAPo_3zpo3lTjSvUyLaa4h68Mzhp6B4Oczo4kervppeq66zqNr9ZeD14Dl_m4z7F-tugpbMR6KKXz31-TBk4iQ3ELyKlazb13qgtvpIYhrx6r-DGFJfzjGASV2pTt2lE9rjiubLYsVeplfLNnJmLBMpx9SMOsZ29xduAbcSozHXgS6jyJR4",
    rating: 4.8,
    reviewCount: 124,
    prep: "20m",
    cook: "45m",
    yield: "1 Quart",
    difficulty: "Intermediate",
    calories: 240,
    caloriesLabel: "Calories per serving",
    ingredients: [
      "2 cups <strong>heavy cream</strong>",
      "1 cup <strong>whole milk</strong>",
      "3/4 cup <strong>granulated sugar</strong>",
      "1 tbsp <strong>vanilla extract</strong>",
      "1 cup <strong>fresh strawberries</strong>, diced",
      "4 oz <strong>cream cheese</strong>, softened",
      "1/2 cup <strong>graham crackers</strong>, crushed",
    ],
    proTipLabel: "Recommended",
    proTipText: "Use Mr. A's Pure Madagascar Vanilla",
    proTipProductImage: PRODUCT_IMAGE,
    chefTip:
      "For the best texture, make sure your strawberries are chopped very small. Large chunks can become icy in the freezer. Macerating them in sugar for 15 minutes before adding helps prevent ice crystals!",
    steps: [
      {
        title: "Prepare the Mix-ins",
        body: "In a small bowl, toss the diced strawberries with 1 tablespoon of the sugar. Let them sit for about 15 minutes to release their juices. Meanwhile, chop the graham crackers into coarse crumbs.",
      },
      {
        title: "Blend the Base",
        body: "In a blender or food processor, combine the cream cheese, remaining sugar, milk, and vanilla extract. Blend until smooth and creamy, ensuring no lumps of cream cheese remain.",
        imageUrl: STEP_IMAGE,
      },
      {
        title: "Combine and Chill",
        body: "Stir in the heavy cream by hand (do not blend, or you might whip it). Cover the mixture and refrigerate for at least 2 hours, or overnight for best results. Cold base churns better!",
      },
      {
        title: "Churn",
        body: "Pour the chilled mixture into your ice cream maker and churn according to the manufacturer's instructions (usually 20-25 minutes). In the last 2 minutes of churning, add the strawberries and their juices.",
      },
      {
        title: "Layer and Freeze",
        body: "Transfer 1/3 of the ice cream to a freezer-safe container. Sprinkle with 1/3 of the graham cracker crumbs. Repeat layers. Cover with plastic wrap pressed directly onto the surface and freeze for at least 4 hours to firm up.",
      },
    ],
    reviews: [
      {
        name: "Sarah Jenkins",
        date: "2 days ago",
        stars: 5,
        text: "Absolutely delicious! The cheesecake chunks really make this special. I used Mr. A's tip about macerating the strawberries and the texture was perfect. Will make again!",
        avatarUrl: REVIEW_AVATAR_1,
      },
      {
        name: "Mike Ross",
        date: "1 week ago",
        stars: 4,
        text: "Great flavor, but a bit too sweet for my taste. I might reduce the sugar next time. Still, a crowd pleaser at the BBQ!",
        avatarUrl: REVIEW_AVATAR_2,
      },
    ],
    ratingBars: [
      { stars: 5, pct: 80 },
      { stars: 4, pct: 12 },
      { stars: 3, pct: 5 },
      { stars: 2, pct: 2 },
      { stars: 1, pct: 1 },
    ],
  },
];

export function getRecipeBySlug(slug: string): PremiumRecipe | undefined {
  return PREMIUM_RECIPES.find((r) => r.slug === slug);
}
