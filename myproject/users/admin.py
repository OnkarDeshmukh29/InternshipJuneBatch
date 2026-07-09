from django.contrib import admin
from .models import CustomUser, Role

# Register your models here so they appear in the Django Admin Panel
admin.site.register(CustomUser)
admin.site.register(Role)
