export interface Location {
  name: string
  region: string
  location_type: string
  latitude: string
  longitude: string
}

export interface Seller {
  id: number
  picture_url: string | null
  username: string
  first_name: string
  last_name: string
  email: string
  phone_numbers: string[]
  location: Location
  last_login: string | null
  created_at: string
}
