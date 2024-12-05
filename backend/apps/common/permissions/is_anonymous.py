from rest_framework import permissions


class IsAnonymous(permissions.BasePermission):
    """
    Allows access only to anonymous (not logged in) users.
    """

    def has_permission(self, request, view):
        return not request.user.is_authenticated
