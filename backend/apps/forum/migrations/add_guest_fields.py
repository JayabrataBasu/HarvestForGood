from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0001_initial'),  # Make sure this matches your last migration
    ]

    operations = [
        migrations.AddField(
            model_name='forumpost',
            name='guest_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='forumpost',
            name='guest_affiliation',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='forumpost',
            name='guest_email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='comment',
            name='guest_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='comment',
            name='guest_affiliation',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='comment',
            name='guest_email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name='forumpost',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=models.deletion.CASCADE, related_name='forum_posts', to='users.user'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=models.deletion.CASCADE, related_name='forum_comments', to='users.user'),
        ),
    ]
