from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from .models import CustomUser, Role, Team
from .serializers import UserSerializer, RoleSerializer, TeamSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from django.http import Http404

from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

from django.db.models import Q

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
        
        # 2. Extract the search and status query parameters from the URL
        search_query = request.query_params.get('search', None)
        status_query = request.query_params.get('status', None)
        
        # 3. If there is a search query, filter the users by name or email
        if search_query:
            users = users.filter(
                Q(first_name__icontains=search_query) | 
                Q(last_name__icontains=search_query) |
                Q(email__icontains=search_query)
            )
            
        # 4. If there is a status query, filter by status
        if status_query and status_query != 'All Statuses':
            is_active_filter = True if status_query.lower() == 'active' else False
            users = users.filter(is_active=is_active_filter)

        # 5. Serialize the filtered data
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    # Protect this endpoint too!
    permission_classes = [IsAuthenticated, IsAdminUser]
    
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
        data = request.data
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        mobile = request.data.get('mobile')
        password = request.data.get('password')
                
        # Since USERNAME_FIELD is 'email', we authenticate using email
        user = authenticate(request, email=email,mobile=mobile, password=password)
        
        if user is not None:
            login(request, user)
            
            # Generate JWT Tokens
            refresh = RefreshToken.for_user(user)
            
            # Return both tokens and the user data to match Angular's new expectation
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        # We don't actually need to do much here since JWT tokens are stateless,
        # but we provide this endpoint for the Angular frontend to call so it feels like a real logout
        return Response({'message': 'Logged out perfectly!'}, status=status.HTTP_205_RESET_CONTENT)

class TeamListCreateView(APIView):
    """
    Handles the dynamic FormArray example.
    """
    permission_classes = [AllowAny] # For demonstration purposes

    def post(self, request):
        # 1. Pass the nested JSON object from Angular to our new serializer
        serializer = TeamSerializer(data=request.data)
        
        # 2. Validate it (this validates both the parent Team AND the array of TeamMembers)
        if serializer.is_valid():
            # 3. Save it (triggers the custom create() method in our serializer)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        # 4. If invalid, return errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
