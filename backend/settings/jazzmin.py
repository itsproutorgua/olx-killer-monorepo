from django.utils.translation import gettext_lazy as _


# JAZZMIN
JAZZMIN_SETTINGS = {
    'site_header': 'OLX Killer',
    'site_title': 'OLX Killer',
    'login_title': '123',
    'site_brand': 'OLX Killer',
    'copyright': 'OLX Killer',
    'site_icon': 'favicon.ico',
    'site_logo': 'favicon.ico',
    'show_ui_builder': True,
    'language_chooser': True,
    'custom_css': 'admin/css/jazzmin_admin.css',
    'icons': {
        'users.user': 'fas fa-user',
        'auth.group': 'fas fa-users',
        'users.profile': 'fas fa-id-badge',
        'products.product': 'fas fa-box',
        'products.category': 'fas fa-tags',
        'products.currency': 'fas fa-dollar-sign',
        'locations.location': 'fas fa-map-marker-alt',
        'locations.city': 'fas fa-city',
        'locations.village': 'fas fa-tree',
        'locations.region': 'fas fa-map',
        'user_messages.message': 'fas fa-envelope',
        'favorites.favorite': 'fas fa-heart',
    },
    ############
    # Top Menu #
    ############
    # Links to put along the top menu
    'topmenu_links': [
        {
            'name': 'Home',
            'url': 'admin:index',
            'permissions': ['auth.view_user'],
        },
        {
            'name': _('Users'),
            'model': 'user.User',
            'url': 'admin:users_user_changelist',
            'permissions': ['auth.view_user'],
        },
        {
            'name': _('Categories'),
            'model': 'product.Category',
            'url': 'admin:products_category_changelist',
            'permissions': ['auth.view_user'],
        },
        {
            'name': _('Products'),
            'model': 'product.Product',
            'url': 'admin:products_product_changelist',
            'permissions': ['auth.view_user'],
        },
        {
            'name': _('Locations'),
            'model': 'location.Location',
            'url': 'admin:locations_location_changelist',
            'permissions': ['auth.view_user'],
        },
        {
            'name': _('Favorites'),
            'model': 'favorites.Favorite',
            'url': 'admin:favorites_favorite_changelist',
            'permissions': ['auth.view_user'],
        },
        {
            'name': _('Chat'),
            'model': 'chat.ChatRoom',
            'url': 'admin:chat_chatroom_changelist',
            'permissions': ['auth.view_user'],
        },
        {
            'name': _('Messages'),
            'model': 'chat.Message',
            'url': 'admin:chat_message_changelist',
            'permissions': ['auth.view_user'],
        },
    ],
}

JAZZMIN_UI_TWEAKS = {
    'navbar_small_text': False,
    'footer_small_text': False,
    'body_small_text': True,
    'brand_small_text': False,
    'brand_colour': 'navbar-navy',
    'accent': 'accent-warning',
    'navbar': 'navbar-navy navbar-dark',
    'no_navbar_border': False,
    'navbar_fixed': True,
    'layout_boxed': False,
    'footer_fixed': False,
    'sidebar_fixed': True,
    'sidebar': 'sidebar-dark-warning',
    'sidebar_nav_small_text': False,
    'sidebar_disable_expand': False,
    'sidebar_nav_child_indent': False,
    'sidebar_nav_compact_style': True,
    'sidebar_nav_legacy_style': False,
    'sidebar_nav_flat_style': False,
    'theme': 'solar',
    'dark_mode_theme': 'solar',
}
