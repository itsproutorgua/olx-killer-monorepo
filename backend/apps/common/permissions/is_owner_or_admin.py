from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission that allows only the creator or administrator to edit or delete a product.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = getattr(obj, 'user', None) or getattr(obj, 'seller')
        return user == request.user or request.user.is_staff
