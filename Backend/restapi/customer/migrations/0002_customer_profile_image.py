# Generated migration file

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customer', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='profile_image',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
