from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    discount_price = models.FloatField()
    rating = models.FloatField()
    review_count = models.IntegerField()

    def __str__(self):
        return self.name
