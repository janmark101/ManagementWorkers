from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FCMDevice
from .serializers import FCMDeviceSerializer
from rest_framework.permissions import IsAuthenticated 

class FCMDeviceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FCMDeviceSerializer(data=request.data)
        if serializer.is_valid():
            FCMDevice.objects.update_or_create(
                registration_id=serializer.validated_data['registration_id'],
                defaults={
                    'user': request.user,
                    'type': serializer.validated_data.get('type', 'android'),
                    'active': True
                }
            )
            return Response({'status': 'Device registered'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)