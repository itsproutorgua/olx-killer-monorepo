class PublicPages {
  HOME = '/'
  LOGIN = '/login'
  REGISTER = '/register'
  PRODUCTS = '/products'
  CATALOG = '/catalog'
}

export const PUBLIC_PAGES = new PublicPages()

class PrivatePages {
  ACCOUNT = '/account'
  LISTINGS = 'listings'
  CHAT = '/account/chat'
  FAVORITE = '/account/favorites'
  PROFILE = '/account/profile'
  SETTINGS = 'settings'
}

export const PRIVATE_PAGES = new PrivatePages()
