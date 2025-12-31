import images from "./images";

export const onboardingData = [
  {
    id: "1",
    type: "hero",
    image: images.onboardingCard1,
    title: "Everything You Need,",
    subtitle: "One ",
    highlightedSubtitle: "Trusted",
    subtitleEnd: " Platform.",
  },
  {
    id: "2",
    type: "hero",
    image: images.onboardingCard2,
    title: "With ",
    highlightedTitle: "Pishonserv",
    titleEnd: ", comfort",
    subtitle: "is an understatement",
  },
  {
    id: "3",
    type: "collage",
    cards: [images.cardRight, images.cardMiddle, images.cardLeft ],
    title: "Find. ",
    highlightedTitle: "Book.",
    titleEnd: " Move In.",
  },
];
