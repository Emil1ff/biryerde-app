import type React from "react"
import { Search, MoreHorizontal, Calendar, Clock, MapPin } from "lucide-react-native"

interface IconProps {
  size?: number
  color?: string
}

export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = "#E0E0E0" }) => (
  <Search size={size} color={color} />
)

export const MoreHorizontalIcon: React.FC<IconProps> = ({ size = 20, color = "#B0BEC5" }) => (
  <MoreHorizontal size={size} color={color} />
)

export const CalendarIcon: React.FC<IconProps> = ({ size = 16, color = "#B0BEC5" }) => (
  <Calendar size={size} color={color} />
)

export const ClockIcon: React.FC<IconProps> = ({ size = 16, color = "#B0BEC5" }) => <Clock size={size} color={color} />

export const MapPinIcon: React.FC<IconProps> = ({ size = 16, color = "#B0BEC5" }) => (
  <MapPin size={size} color={color} />
)
