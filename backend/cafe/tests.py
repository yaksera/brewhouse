from datetime import time, timedelta

from django.core.cache import cache
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import MenuItem, Reservation


def tomorrow():
    return (timezone.localdate() + timedelta(days=1)).isoformat()


VALID = {
    'full_name': 'Aasha Shrestha',
    'email': 'Aasha@Example.com',
    'phone': '+977 980-0000000',
    'time': '18:30',
    'party_size': 4,
}


class MenuTests(APITestCase):
    def test_menu_lists_seeded_items(self):
        res = self.client.get(reverse('menu'))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['categories']), 4)
        self.assertGreaterEqual(len(res.data['items']), 12)
        self.assertTrue(any(i['is_popular'] for i in res.data['items']))

    def test_unavailable_items_hidden(self):
        MenuItem.objects.filter(name='Caramel Latte').update(is_available=False)
        res = self.client.get(reverse('menu'))
        self.assertFalse(any(i['name'] == 'Caramel Latte' for i in res.data['items']))


class ReservationTests(APITestCase):
    def setUp(self):
        cache.clear()

    def post(self, **overrides):
        return self.client.post(reverse('reservations'), {**VALID, 'date': tomorrow(), **overrides}, format='json')

    def test_create_with_pre_order_snapshots_prices(self):
        latte = MenuItem.objects.get(name='Caramel Latte')
        res = self.post(pre_order=[{'item': latte.id, 'quantity': 1}, {'item': latte.id, 'quantity': 2}])
        self.assertEqual(res.status_code, status.HTTP_201_CREATED, res.data)
        booking = Reservation.objects.get()
        self.assertEqual(booking.email, 'aasha@example.com')
        self.assertEqual(booking.phone, '+9779800000000')
        line = booking.pre_order.get()
        self.assertEqual((line.quantity, line.unit_price), (3, latte.price))
        self.assertEqual(res.data['pre_order_total'], latte.price * 3)

    def test_rejects_past_date_and_out_of_hours(self):
        yesterday = (timezone.localdate() - timedelta(days=1)).isoformat()
        res = self.post(date=yesterday, time='22:00')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('date', res.data)
        self.assertIn('time', res.data)

    def test_rejects_party_too_large_and_unavailable_item(self):
        item = MenuItem.objects.first()
        item.is_available = False
        item.save()
        res = self.post(party_size=40, pre_order=[{'item': item.id, 'quantity': 1}])
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('party_size', res.data)
        self.assertIn('pre_order', res.data)

    def test_same_day_needs_lead_time(self):
        now = timezone.localtime()
        if not (time(7, 30) <= now.time() <= time(20, 30)):
            self.skipTest('Only meaningful during opening hours.')
        res = self.post(date=timezone.localdate().isoformat(), time=now.strftime('%H:%M'))
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('time', res.data)


class ContactTests(APITestCase):
    def setUp(self):
        cache.clear()

    def test_create_and_validate(self):
        ok = self.client.post(reverse('contact'), {'name': 'Ram', 'email': 'ram@x.np', 'message': 'Do you host events?'}, format='json')
        self.assertEqual(ok.status_code, status.HTTP_201_CREATED)
        bad = self.client.post(reverse('contact'), {'name': '', 'email': 'nope', 'message': 'hi'}, format='json')
        self.assertEqual(bad.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(set(bad.data), {'name', 'email', 'message'})
