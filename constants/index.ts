import {
  FilePlus,
  Globe,
  Heart,
  Home,
  MessageSquare,
  Search,
  Tag,
  User,
  UserPlus,
  Users,

} from '@geist-ui/icons';

export const sidebarLinks = [
  {
    icon: Home,
    route: "/",
    label: "Home",
  },
  {
    icon: Search,
    route: "/search",
    label: "Search",
  },
  {
    icon: Heart,
    route: "/activity",
    label: "Activity",
  },
  {
    icon: FilePlus,
    route: "/create-review",
    label: "Create Review",
  },
  {
    icon: Globe,
    route: "/communities",
    label: "Communities",
  },
  {
    icon: User,
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "reviews", label: "Reviews", icon: MessageSquare },
  { value: "replies", label: "Replies", icon: Users },
  { value: "tagged", label: "Tagged", icon: Tag },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: MessageSquare },
  { value: "members", label: "Members", icon: Users },
  { value: "requests", label: "Requests", icon: UserPlus },
];