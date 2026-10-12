import re
from datetime import datetime, time, timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from .models import ContactMessage, MenuCategory, MenuItem, PreOrderItem, Reservation

PHONE_RE = re.compile(r'^\+?\d{7,15}$')

# Open 7:30 AM – 9:30 PM; the kitchen closes at 9:00 PM, so the last seating is 8:30 PM.
FIRST_SEATING = time(7, 30)
LAST_SEATING = time(20, 30)
MAX_DAYS_AHEAD = 60


class MenuItemSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='slug', read_only=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'badge', 'note', 'is_popular', 'category']


class MenuCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'slug']


class PreOrderItemSerializer(serializers.Serializer):
    item = serializers.PrimaryKeyRelatedField(queryset=MenuItem.objects.filter(is_available=True))
    quantity = serializers.IntegerField(min_value=1, max_value=20)


class PreOrderLineSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='item.name')

    class Meta:
        model = PreOrderItem
        fields = ['name', 'quantity', 'unit_price']


class ReservationSerializer(serializers.ModelSerializer):
    pre_order = PreOrderItemSerializer(many=True, required=False, write_only=True)
    pre_order_lines = PreOrderLineSerializer(source='pre_order', many=True, read_only=True)
    pre_order_total = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            'id', 'full_name', 'email', 'phone', 'date', 'time', 'party_size', 'notes',
            'pre_order', 'pre_order_lines', 'pre_order_total', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def get_pre_order_total(self, obj):
        return sum(line.unit_price * line.quantity for line in obj.pre_order.all())

    def validate_full_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError('Please enter your full name.')
        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        cleaned = re.sub(r'[\s\-()]', '', value)
        if not PHONE_RE.match(cleaned):
            raise serializers.ValidationError('Enter a valid phone number, e.g. +977 9800000000.')
        return cleaned

    def validate_date(self, value):
        today = timezone.localdate()
        if value < today:
            raise serializers.ValidationError('Please choose today or a future date.')
        if value > today + timedelta(days=MAX_DAYS_AHEAD):
            raise serializers.ValidationError(f'We take reservations up to {MAX_DAYS_AHEAD} days ahead.')
        return value

    def validate_time(self, value):
        if not (FIRST_SEATING <= value <= LAST_SEATING):
            raise serializers.ValidationError('We seat guests between 7:30 AM and 8:30 PM.')
        return value

    def validate_pre_order(self, lines):
        merged = {}
        for line in lines:
            item = line['item']
            merged[item.pk] = {'item': item, 'quantity': merged.get(item.pk, {}).get('quantity', 0) + line['quantity']}
        if any(line['quantity'] > 20 for line in merged.values()):
            raise serializers.ValidationError('At most 20 of each item.')
        return list(merged.values())

    def validate(self, attrs):
        date, slot = attrs.get('date'), attrs.get('time')
        if date and slot and date == timezone.localdate():
            now = timezone.localtime()
            booked_at = timezone.make_aware(datetime.combine(date, slot), now.tzinfo)
            if booked_at < now + timedelta(minutes=30):
                raise serializers.ValidationError({'time': 'Please book at least 30 minutes ahead.'})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        lines = validated_data.pop('pre_order', [])
        reservation = Reservation.objects.create(**validated_data)
        PreOrderItem.objects.bulk_create(
            PreOrderItem(reservation=reservation, item=line['item'], quantity=line['quantity'], unit_price=line['item'].price)
            for line in lines
        )
        return reservation


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError('Please tell us your name.')
        return value

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 5:
            raise serializers.ValidationError('Your message is a little short.')
        return value
