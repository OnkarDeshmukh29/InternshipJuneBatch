from django.urls import path
from .views import UserListCreateView, UserDetailView, RoleListCreateView, RegisterView, LoginView

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user-list-create'),
    path('<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('roles/', RoleListCreateView.as_view(), name='role-list-create'),
    path('register', RegisterView.as_view(), name='register'), # Map to Angular's expected /api/auth/register
    path('login', LoginView.as_view(), name='login'), # Map to Angular's expected /api/auth/login
]
