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
  LISTINGS = '/account/listings'
  LISTING_CREATE = '/account/listings/create'
  LISTING_SUCCESS = '/account/listings/create/success'
  CHAT = '/account/chat'
  FAVORITE = '/account/favorites'
  PROFILE = '/account/profile'
  SETTINGS = '/account/settings'
}

export const PRIVATE_PAGES = new PrivatePages()
