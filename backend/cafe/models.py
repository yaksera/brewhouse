from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class MenuCategory(models.Model):
    name = models.CharField(max_length=60)
    slug = models.SlugField(unique=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name_plural = 'menu categories'

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    class Badge(models.TextChoices):
        NONE = '', 'None'
        BESTSELLER = 'bestseller', 'Bestseller'
        CHEF_CHOICE = 'chef_choice', 'Chef Choice'
        NEW = 'new', 'New'

    category = models.ForeignKey(MenuCategory, on_delete=models.PROTECT, related_name='items')
    name = models.CharField(max_length=80)
    description = models.CharField(max_length=240)
    price = models.PositiveIntegerField(help_text='Price in NPR.')
    badge = models.CharField(max_length=16, choices=Badge.choices, blank=True)
    note = models.CharField(max_length=40, blank=True, help_text='Short flavour note, e.g. "Rich & Creamy".')
    is_popular = models.BooleanField(default=False, help_text='Show under "Most Popular".')
    is_available = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['category__order', 'order', 'id']

    def __str__(self):
        return f'{self.name} (Rs. {self.price})'


class Reservation(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELLED = 'cancelled', 'Cancelled'

    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    date = models.DateField()
    time = models.TimeField()
    party_size = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(20)])
    notes = models.TextField(blank=True, max_length=500)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f'{self.full_name} — {self.party_size} on {self.date} {self.time:%H:%M}'


class PreOrderItem(models.Model):
    """Menu items a guest added to their tray before reserving."""

    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='pre_order')
    item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    quantity = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(20)])
    unit_price = models.PositiveIntegerField(help_text='Price at the time of booking.')

    def __str__(self):
        return f'{self.quantity} × {self.item.name}'


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField(max_length=2000)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name}: {self.message[:40]}'
