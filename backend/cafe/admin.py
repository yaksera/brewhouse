from django.contrib import admin

from .models import ContactMessage, MenuCategory, MenuItem, PreOrderItem, Reservation


@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    list_editable = ['order']
    prepopulated_fields = {'slug': ['name']}


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'badge', 'is_popular', 'is_available', 'order']
    list_editable = ['price', 'badge', 'is_popular', 'is_available', 'order']
    list_filter = ['category', 'badge', 'is_popular', 'is_available']
    search_fields = ['name', 'description']


class PreOrderInline(admin.TabularInline):
    model = PreOrderItem
    extra = 0
    readonly_fields = ['unit_price']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'date', 'time', 'party_size', 'phone', 'status', 'created_at']
    list_editable = ['status']
    list_filter = ['status', 'date']
    search_fields = ['full_name', 'email', 'phone']
    date_hierarchy = 'date'
    inlines = [PreOrderInline]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at', 'is_read']
    list_editable = ['is_read']
    list_filter = ['is_read']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at']
