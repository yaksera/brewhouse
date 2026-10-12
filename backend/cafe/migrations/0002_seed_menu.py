from django.db import migrations

CATEGORIES = [
    ('beverage', 'Beverage'),
    ('breakfast', 'Breakfast'),
    ('main-course', 'Main Course'),
    ('desserts', 'Desserts'),
]

# (category, name, description, price, badge, note, is_popular)
ITEMS = [
    ('beverage', 'Caramel Latte',
     'Double shot Himalayan espresso, gently steamed textured cow milk, and artisanal slow-cooked jaggery caramel drizzle.',
     380, 'bestseller', 'Rich & Creamy', True),
    ('beverage', 'Single Origin Pour-Over',
     'Hand-brewed V60 of washed Nuwakot beans with notes of stone fruit, brown sugar and a clean, bright finish.',
     420, 'chef_choice', 'Bright & Fruity', True),
    ('beverage', 'Flat White',
     'Ristretto double shot under a thin layer of velvety micro-foam, poured in a 6 oz cup.',
     340, '', 'Bold & Smooth', False),
    ('beverage', 'Himalayan Masala Chiya',
     'Assam leaf simmered with fresh ginger, cardamom and clove in full-cream milk, sweetened to taste.',
     180, '', 'Warm & Spiced', False),
    ('beverage', 'Iced Honey Cold Brew',
     '18-hour cold brew over ice with wild Chitwan honey and a splash of oat milk.',
     360, 'new', 'Cool & Mellow', False),

    ('breakfast', 'Muesli Bowl',
     'House-toasted oats, nuts and seeds with Himalayan yoghurt, seasonal fruit and a drizzle of local honey.',
     420, 'bestseller', 'Light & Wholesome', True),
    ('breakfast', 'Sourdough Avocado Toast',
     'Slow-fermented sourdough, smashed avocado, cherry tomatoes, timur pepper and a soft poached egg.',
     520, 'chef_choice', 'Fresh & Zesty', False),
    ('breakfast', 'Butter Toast & Eggs',
     'Thick-cut house bread with cultured butter, two eggs your way and sautéed greens.',
     360, '', 'Simple & Hearty', False),
    ('breakfast', 'Buckwheat Pancakes',
     'Fluffy Mustang buckwheat pancakes with whipped butter, berry compote and maple syrup.',
     450, '', 'Sweet & Fluffy', False),

    ('main-course', 'Italian Pasta',
     'Penne in slow-simmered tomato and basil sauce with garlic, chilli flakes and shaved yak cheese.',
     650, 'bestseller', 'Savory & Herby', True),
    ('main-course', 'Chicken Momo Platter',
     'Ten hand-folded steamed momos with roasted tomato–sesame achar and a light jhol.',
     480, 'chef_choice', 'Juicy & Spiced', True),
    ('main-course', 'Grilled Chicken Sandwich',
     'Herb-marinated chicken, caramelised onion, pickled cucumber and aioli on toasted ciabatta.',
     560, '', 'Smoky & Filling', False),
    ('main-course', 'Thakali Veg Set',
     'Mustang-style dal, rice, seasonal tarkari, gundruk, achar and papad, served as a full set.',
     620, '', 'Comforting & Homely', False),

    ('desserts', 'Sizzling Brownie',
     'Warm dark-chocolate brownie on a hot skillet with vanilla ice cream and hot chocolate sauce.',
     450, 'chef_choice', 'Rich & Gooey', True),
    ('desserts', 'Chocolate Layer Cake',
     'Four layers of moist cocoa sponge with dark chocolate ganache, topped with a fresh raspberry.',
     380, '', 'Decadent & Moist', False),
    ('desserts', 'Lemon Cheesecake',
     'Baked New York–style cheesecake with a buttery biscuit base and tangy lemon curd.',
     420, 'new', 'Tangy & Creamy', False),
]


def seed(apps, schema_editor):
    MenuCategory = apps.get_model('cafe', 'MenuCategory')
    MenuItem = apps.get_model('cafe', 'MenuItem')
    cats = {}
    for order, (slug, name) in enumerate(CATEGORIES):
        cats[slug], _ = MenuCategory.objects.get_or_create(slug=slug, defaults={'name': name, 'order': order})
    for order, (cat, name, desc, price, badge, note, popular) in enumerate(ITEMS):
        MenuItem.objects.get_or_create(
            name=name,
            defaults={
                'category': cats[cat], 'description': desc, 'price': price, 'badge': badge,
                'note': note, 'is_popular': popular, 'order': order,
            },
        )


def unseed(apps, schema_editor):
    apps.get_model('cafe', 'MenuItem').objects.filter(name__in=[i[1] for i in ITEMS]).delete()
    apps.get_model('cafe', 'MenuCategory').objects.filter(slug__in=[c[0] for c in CATEGORIES]).delete()


class Migration(migrations.Migration):
    dependencies = [('cafe', '0001_initial')]

    operations = [migrations.RunPython(seed, unseed)]
