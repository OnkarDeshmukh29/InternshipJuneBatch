from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from .permissions import IsNotStaffOrSuperuser

class ContactMessageCreateView(APIView):
    permission_classes = [IsNotStaffOrSuperuser] # Only standard authenticated users can submit
    
    def post(self, request):
        # 1. Pass the incoming JSON/FormData to the serializer
        serializer = ContactMessageSerializer(data=request.data)
        
        # 2. Validate the data
        if serializer.is_valid():
            # 3. Save the new message (including the file attachment) to the database
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        # 4. If invalid, return the error details
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

