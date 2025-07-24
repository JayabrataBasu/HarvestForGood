from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0009_like'),
    ]

    operations = [
        migrations.CreateModel(
            name='ForumTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=50, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('usage_count', models.IntegerField(db_index=True, default=0)),
            ],
            options={
                'db_table': 'forum_tag',
                'ordering': ['-usage_count', 'name'],
            },
        ),
        migrations.CreateModel(
            name='ForumPostTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forum.forumpost')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forum.forumtag')),
            ],
            options={
                'db_table': 'forum_post_tag',
            },
        ),
        migrations.AddField(
            model_name='forumpost',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='posts', through='forum.ForumPostTag', to='forum.forumtag'),
        ),
        migrations.AlterUniqueTogether(
            name='forumposttag',
            unique_together={('post', 'tag')},
        ),
    ]
