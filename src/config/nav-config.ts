import { 
  Car01Icon, 
  SteeringIcon, 
  Location01Icon, 
  UserAccountIcon, 
  HelpCircleIcon, 
  Home01Icon, 
  Search01Icon, 
  Message01Icon, 
  PlusSignCircleIcon,
  Contact01Icon,
  QuestionIcon,
  Building01Icon,
  LicenseIcon
} from "@hugeicons/core-free-icons"

export const NAV_CONFIG = {
  mainNav: [
    {
      title: "Car Requests",
      href: "/car-requests",
    },
    {
      title: "Rent a Car",
      href: "/search",
      items: [
        { title: "Browse All Cars", href: "/search", description: "Explore our entire fleet of vehicles." },
        { title: "Newly Listed Cars", href: "/search?sort=newest", description: "Be the first to drive our latest additions." },
        { title: "Luxury Cars", href: "/search?category=luxury", description: "Premium vehicles for a premium experience." },
        { title: "Economy Cars", href: "/search?category=economy", description: "Budget-friendly options for daily use." },
        { title: "SUVs / 4x4", href: "/search?category=suv", description: "Built for tough terrains and families." },
        { title: "Vans & Buses", href: "/search?category=van", description: "Perfect for large groups and cargo." },
      ],
    },
    {
      title: "Categories",
      href: "/categories",
      isMega: true,
      items: [
        { title: "Economy Cars", href: "/search?category=economy", description: "Budget-friendly daily drivers.", icon: "/icons/economy-cars.svg" },
        { title: "Luxury Cars", href: "/search?category=luxury", description: "Premium executive experience.", icon: "/icons/luxury.svg" },
        { title: "SUVs / 4x4", href: "/search?category=suv", description: "Spacious for family & adventures.", icon: "/icons/suv.svg" },
        { title: "Sports Cars", href: "/search?category=sports", description: "High performance and style.", icon: "/icons/sports-cars.svg" },
        { title: "Vans & Buses", href: "/search?category=van", description: "Perfect for large groups.", icon: "/icons/van.svg" },
        { title: "Convertible", href: "/search?category=convertible", description: "Feel the breeze on the road.", icon: "/icons/convertible.svg" },
      ],
    },
    {
      title: "Why RentNowPk",
      href: "/why-choose-us",
      items: [
        { title: "Every Vendor is Verified", href: "/trust", description: "CNIC, business docs, and vehicle ownership verified for your safety." },
        { title: "What You See is What You Pay", href: "/pricing-policy", description: "Clear rates. Zero hidden fees. Just honest pricing." },
        { title: "Communicate Directly with Owners", href: "/how-it-works#chat", description: "Real-time chat and instant booking confirmations in one place." },
        { title: "Self-Drive or Chauffeur", href: "/search", description: "Flexible plans for any trip, from an hour to a month." },
        { title: "Available Across All Major Cities", href: "/cities", description: "Trusted vendors in Lahore, Karachi, Islamabad, and beyond." },
        { title: "24/7 Customer Support", href: "/help", description: "Our local team is always a message away to help." },
      ],
    },
    {
      title: "Help Center",
      href: "/help",
      items: [
        { title: "Contact Us", href: "/help/contact", description: "Get in touch with our team." },
        { title: "FAQs", href: "/help/faq", description: "Frequently asked questions." },
        { title: "How It Works", href: "/help/how-it-works", description: "Learn about our rental process." },
        { title: "About Us", href: "/about", description: "Know more about our company." },
        { title: "Blog & Guides", href: "/blog", description: "Travel tips and car rental guides." },
      ],
    },
  ],
  mobileBottomNav: [
    { label: "Home", href: "/", icon: Home01Icon },
    { label: "Explore", href: "/search", icon: Search01Icon },
    { label: "Inbox", href: "/customer/messages", icon: Message01Icon, badge: 3 },
    { label: "Profile", href: "/customer", icon: UserAccountIcon },
  ],
}
