from django.urls import path

from . import views

urlpatterns = [
    path('health/', views.HealthView.as_view(), name='health'),
    path('menu/', views.MenuView.as_view(), name='menu'),
    path('reservations/', views.ReservationCreateView.as_view(), name='reservations'),
    path('contact/', views.ContactMessageCreateView.as_view(), name='contact'),
]
