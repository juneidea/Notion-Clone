# Generated by Django 4.2.14 on 2024-07-25 21:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_document_is_archived_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='is_archived',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='document',
            name='is_published',
            field=models.BooleanField(),
        ),
    ]
