from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import uuid

class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True) 
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class CustomUserManager(BaseUserManager):
    """
    A custom user manager is required when using AbstractBaseUser.
    It tells Django exactly how to create standard users and superusers.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        # normalize_email standardizes the domain part of the email address
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        # set_password hashes the password securely before saving to the database
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    By using AbstractBaseUser, we bypass Django's default 'username' logic.
    PermissionsMixin gives us the standard Django permissions (is_superuser, groups, user_permissions).
    """
    # --- CORE AUTHENTICATION FIELDS ---
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True) # Used as the primary login identifier instead of username
    
    # --- REQUIRED DJANGO FIELDS FOR ABSTRACTBASEUSER ---
    is_active = models.BooleanField(default=True) # Used to soft-delete users instead of actually removing them from DB
    is_staff = models.BooleanField(default=False) # Used to allow access to the Django Admin site
    date_joined = models.DateTimeField(default=timezone.now)

    # --- EDUCATIONAL FIELDS DEMONSTRATION ---
    
    # CharField: Best for short text like names, titles, statuses. Requires max_length.
    firstName = models.CharField(max_length=150, blank=True)
    lastName = models.CharField(max_length=150, blank=True)
    status = models.CharField(max_length=20, default='Active')

    # TextField: Best for long, unbounded text like biographies or blog posts.
    bio = models.TextField(blank=True, null=True, help_text="Write a short biography.")
    
    # IntegerField: Used for whole numbers (e.g., age, points, counters).
    age = models.IntegerField(null=True, blank=True)
    
    # DecimalField: Used for precise numbers like currency or precise measurements. Requires max_digits and decimal_places.
    account_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # DateField & DateTimeField: Used for tracking dates and timestamps without a time component.
    birth_date = models.DateField(null=True, blank=True)
    
    # URLField: A specialized CharField that validates the input is a proper web URL.
    website = models.URLField(blank=True, null=True)

    # ImageField / FileField: Used for uploading files. Requires 'upload_to' to specify the save directory.
    profileImage = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    # ForeignKey: Used for Many-to-One relationships (Many Users can have One Role).
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)

    # --- CONFIGURATION ---
    # Tell Django that 'email' is the main field used for logging in
    USERNAME_FIELD = 'email'
    
    # These fields will be prompted when running `python manage.py createsuperuser` in the terminal
    REQUIRED_FIELDS = ['firstName', 'lastName']

    # Attach the custom manager to this model
    objects = CustomUserManager()

    def __str__(self):
        return self.email


class permissions(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True) 
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

# py manage.py makemigrations
# py manage.py migrate