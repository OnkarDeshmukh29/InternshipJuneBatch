from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from .models import CustomUser, Role
from .serializers import UserSerializer, RoleSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from django.http import Http404

from rest_framework.permissions import IsAuthenticated, IsAdminUser

class UserListCreateView(APIView):
    """
    Explicitly showing GET and POST methods instead of using generics.
    Great for teaching how HTTP methods map to Python functions.
    """
    # Protect this endpoint: Requires a valid JWT token AND the user must be a super admin (is_staff=True)
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # 1. Get all users from the database
        users = CustomUser.objects.all()
        # 2. Convert complex model instances into JSON using the serializer (many=True for lists)
        serializer = UserSerializer(users, many=True)
        # 3. Return the JSON response
        return Response(serializer.data)

    def post(self, request):
        # 1. Pass the incoming JSON data to the serializer
        serializer = UserSerializer(data=request.data)
        # 2. Check if the data is valid according to our rules
        if serializer.is_valid():
            # 3. Save to database
            serializer.save()
            # 4. Return success response with 201 Created status
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # 5. If invalid, return the errors with 400 Bad Request status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    """
    Explicitly showing GET, PUT, and DELETE methods for a specific user ID (pk).
    """
    def get_object(self, pk):
        try:
            return CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        # Pass the existing user and the new data to update it
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RoleListCreateView(generics.ListCreateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

class RegisterView(APIView):
    def post(self, request):
        # The angular app sends "name" for register, map it to firstName
        data = request.data.copy()
        if 'name' in data and 'firstName' not in data:
            data['firstName'] = data['name']
            
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        print(f"Login attempt for email: {email}")  # Debugging line
        # deshmukhonkar29@gmail.com
        mobile = request.data.get('mobile')
        print(f"Login attempt for mobile: {mobile}")  # Debugging line  
        password = request.data.get('password')
                
        # Since USERNAME_FIELD is 'email', we authenticate using email
        user = authenticate(request, email=email,mobile=mobile, password=password)
                # deshmukhonkar29@gmail.com=deshmukhnkar29@gmail.com
        
        if user is not None:
            login(request, user)
            
            # Generate JWT Tokens
            refresh = RefreshToken.for_user(user)
            print("refresh", refresh)
            
            # Return both tokens and the user data to match Angular's new expectation
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
