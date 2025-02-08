export interface Location {
  id: number
  name: string
  location_type: string
  region: string
  latitude: number
  longitude: number
}

export interface UserProfile {
  id: number
  picture: string
  username: string
  first_name: string
  last_name: string
  email: string
  phone_numbers: string[]
  location: Location
  created_at: string
  updated_at: string
}
