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


export const featured = [
  {
    id: "1",
    title: "Josie Rentals",
    location: "Ikeja, Lagos",
    rating: 4.8,
    price: "₦20,000",
    image: images.featured1,
  },
  {
    id: "2",
    title: "Delux Homes",
    location: "Island, Lagos",
    rating: 4.8,
    price: "₦35,000",
    image: images.featured2,
  },
  {
    id: "3",
    title: "Greenfield Apartments",
    location: "Yaba, Lagos",
    rating: 4.7,
    price: "₦25,000",
    image: images.featured3,
  },
  {
    id: "4",
    title: "Sunset Villas",
    location: "Lekki, Lagos",
    rating: 4.9,
    price: "₦40,000",
    image: images.featured4,
  },
];


export const heroBanners = [
  {
    id: "1",
    image: images.hero1,
    title: "Find Your \n Dream Property",
    subtitle: "Browse the best real estate deals for \n Buy, Rent, Shortlet, and more.",
  },
  {
    id: "2",
    image: images.hero2,
    title: "Find Your \n Dream Property",
    subtitle: "Browse the best real estate deals for \n Buy, Rent, Shortlet, and more.",
  },
  {
    id: "3",
    image: images.hero3,
    title: "Find Your \n Dream Property",
    subtitle: "Browse the best real estate deals for \n Buy, Rent, Shortlet, and more.",
  },
];


export const categories = [
  { title: "All", category: "All" },
  { title: "Houses", category: "House" },
  { title: "Condos", category: "Condos" },
  { title: "Duplexes", category: "Duplexes" },
  { title: "Studios", category: "Studios" },
  { title: "Villas", category: "Villa" },
  { title: "Apartments", category: "Apartments" },
  { title: "Townhomes", category: "Townhomes" },
  { title: "Others", category: "Others" },
];
