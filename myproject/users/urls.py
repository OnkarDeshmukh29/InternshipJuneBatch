from django.urls import path
from .views import (
    UserListCreateView, 
    UserDetailView, 
    RoleListCreateView, 
    RegisterView, 
    LoginView, 
    LogoutView,
    TeamListCreateView
)

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user-list-create'),
    path('<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('roles/', RoleListCreateView.as_view(), name='role-list-create'),
    
    # Auth endpoints
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    
    # FormArray demonstration endpoint
    path('teams/', TeamListCreateView.as_view(), name='team-list-create'),
]
