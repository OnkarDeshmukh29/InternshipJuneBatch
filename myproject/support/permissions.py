from rest_framework import permissions

class IsNotStaffOrSuperuser(permissions.BasePermission):
    """
    Custom permission to deny access to staff or superusers.
    Only allows standard, authenticated users to pass.
    """
    def has_permission(self, request, view):
        # 1. User must be authenticated to even be evaluated
        if not request.user or not request.user.is_authenticated:
            return False
            
        # 2. If the user is staff or a superuser, DENY access
        if request.user.is_staff or request.user.is_superuser:
            return False
            
        # 3. Otherwise (it's a standard user), ALLOW access
        return True
