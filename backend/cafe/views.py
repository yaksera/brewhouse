from rest_framework import generics
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import MenuCategory, MenuItem
from .serializers import ContactMessageSerializer, MenuCategorySerializer, MenuItemSerializer, ReservationSerializer


class SubmissionMixin:
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'submissions'


class MenuView(APIView):
    """GET /api/menu/ — categories and available items."""

    def get(self, request):
        items = MenuItem.objects.filter(is_available=True).select_related('category')
        return Response({
            'categories': MenuCategorySerializer(MenuCategory.objects.all(), many=True).data,
            'items': MenuItemSerializer(items, many=True).data,
        })


class ReservationCreateView(SubmissionMixin, generics.CreateAPIView):
    """POST /api/reservations/ — book a table, optionally with a pre-order."""

    serializer_class = ReservationSerializer


class ContactMessageCreateView(SubmissionMixin, generics.CreateAPIView):
    """POST /api/contact/ — the "Send a Message" form."""

    serializer_class = ContactMessageSerializer


class HealthView(APIView):
    def get(self, request):
        return Response({'status': 'ok'})
