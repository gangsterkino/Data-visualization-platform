# Generated by Django 5.0.1 on 2024-02-18 08:24

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("appDemo", "0003_novelshistory"),
    ]

    operations = [
        migrations.RenameField(
            model_name="novelshistory",
            old_name="rating",
            new_name="rating_votes",
        ),
    ]
