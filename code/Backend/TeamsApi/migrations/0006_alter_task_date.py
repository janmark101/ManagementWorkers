# Generated by Django 4.2.7 on 2023-11-27 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TeamsApi', '0005_alter_task_error'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='date',
            field=models.DateTimeField(),
        ),
    ]
